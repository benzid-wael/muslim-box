const { fork } = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const geoip = require("fast-geoip");
const axios = require("axios");

const {
  app,
  protocol,
  BrowserWindow,
  session,
  ipcMain,
  Menu
} = require("electron");
const logger = require("electron-log");
const SecureElectronLicenseKeys = require("secure-electron-license-keys");
const i18nextBackend = require("i18next-electron-fs-backend");
const Store = require("secure-electron-store").default;
const ContextMenu = require("secure-electron-context-menu").default;

const { findPort, isPortAvailable } = require("./find-open-port");
const Protocol = require("./protocol");
const MenuBuilder = require("./menu");
const i18nextMainBackend = require("../localization/i18n.mainconfig");

const isDev = process.env.NODE_ENV === "development";
const port = 40992; // Hardcoded; needs to match webpack.development.js and package.json
const selfHost = `http://localhost:${port}`;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;
let menuBuilder = null;
let serverProcess = null;
let serverPort = null;

const installExtensions = () => {
  logger.info("[🛠️ ] installing extensions...")
  const installer = require("electron-devtools-installer");
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ["REACT_DEVELOPER_TOOLS", "REDUX_DEVTOOLS"];

  extensions.forEach(name => {
    const extension = installer[name]
    try {
      installer.default(extension, forceDownload)
      logger.info("[🛠️ ] extension %s installed 👌🏻", name)
    } catch {
      logger.info("[🛠️ ] failed to install extension: %s", error)
    }
  })
};

const createBackgroundProcess = (port) => {
  serverProcess = fork(path.join(__dirname, "../server"), [
    "--port",
    port
  ])

  serverProcess.on("message", msg => {
    console.log(`[server] ${msg}`)
  })
}

const createWindow = async () => {
  console.log(`createWindow invoked`)

  // If you'd like to set up auto-updating for your app,
  // I'd recommend looking at https://github.com/iffy/electron-updater-example
  // to use the method most suitable for you.
  // eg. autoUpdater.checkForUpdatesAndNotify();

  if (!isDev) {
    // Needs to happen before creating/loading the browser window;
    // protocol is only used in prod
    protocol.registerBufferProtocol(Protocol.scheme, Protocol.requestHandler); /* eng-disable PROTOCOL_HANDLER_JS_CHECK */
  }

  const store = new Store({
    path: app.getPath("userData")
  });

  // Use saved config values for configuring your
  // BrowserWindow, for instance.
  // NOTE - this config is not passcode protected
  // and stores plaintext values
  // let savedConfig = store.mainInitialStore(fs);

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "MuslimBox...",
    webPreferences: {
      devTools: isDev,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      enableRemoteModule: false,
      additionalArguments: [`storePath:${app.getPath("userData")}`],
      preload: path.join(__dirname, "preload.js"),
      /* eng-disable PRELOAD_JS_CHECK */
      disableBlinkFeatures: "Auxclick"
    }
  });

  // Sets up main.js bindings for our i18next backend
  i18nextBackend.mainBindings(ipcMain, mainWindow, fs);

  // Sets up main.js bindings for our electron store;
  // callback is optional and allows you to use store in main process
  const callback = function (success, initialStore) {
    logger.log(`${!success ? "Un-s" : "S"}uccessfully retrieved store in main process.`);
    logger.log(initialStore); // {"key1": "value1", ... }
  };

  store.mainBindings(ipcMain, mainWindow, fs, callback);

  // Sets up bindings for our custom context menu
  ContextMenu.mainBindings(ipcMain, mainWindow, Menu, isDev, {
    "loudAlertTemplate": [{
      id: "loudAlert",
      label: "AN ALERT!"
    }],
    "softAlertTemplate": [{
      id: "softAlert",
      label: "Soft alert"
    }]
  });

  // Setup bindings for offline license verification
  SecureElectronLicenseKeys.mainBindings(ipcMain, mainWindow, fs, crypto, {
    root: process.cwd(),
    version: app.getVersion()
  });

  // Load app
  if (isDev) {
    mainWindow.loadURL(selfHost);
  } else {
    mainWindow.loadURL(`${Protocol.scheme}://rse/index.html`);
  }

  const ipResponse = await axios.get("http://api.ipify.org")
  const ip = ipResponse.data
  console.log(`[ipcMain] IP address: ${ip}`)
  const geo = await geoip.lookup(ip);
  console.log(`[ipcMain] geographical info: ${JSON.stringify(geo)}`)

  mainWindow.webContents.on("did-finish-load", () => {
    console.log("did-finish-load")
    mainWindow.setTitle(`MuslimBox (v${app.getVersion()})`);

    // update renderer
    console.log(`[ipcMain] sync ipcRenderer`)
    mainWindow.webContents.send("backend-url-changed", {backendURL: `http://localhost:${serverPort}/gql/`})
    mainWindow.webContents.send("language-initialized", {language: i18nextMainBackend.language})
    mainWindow.webContents.send("geocordinates-changed", {
      coordinates: {longitude: geo.ll[1], latitude: geo.ll[0]},
      city: geo.city,
      timezone: geo.timezone,
    })
  });

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // https://electronjs.org/docs/tutorial/security#4-handle-session-permission-requests-from-remote-content
  const ses = session;
  const partition = "default";
  ses.fromPartition(partition) /* eng-disable PERMISSION_REQUEST_HANDLER_JS_CHECK */
    .setPermissionRequestHandler((webContents, permission, permCallback) => {
      const allowedPermissions = []; // Full list here: https://developer.chrome.com/extensions/declare_permissions#manifest

      if (allowedPermissions.includes(permission)) {
        permCallback(true); // Approve permission request
      } else {
        logger.error(
          `The application tried to request permission for "${permission}". `
          `This permission was not whitelisted and has been blocked.`
        );

        permCallback(false); // Deny
      }
    });

  // https://electronjs.org/docs/tutorial/security#1-only-load-secure-content;
  // The below code can only run when a scheme and host are defined, I thought
  // we could use this over _all_ urls
  // ses.fromPartition(partition).webRequest.onBeforeRequest({urls:["http://localhost./*"]}, (listener) => {
  //   if (listener.url.indexOf("http://") >= 0) {
  //     listener.callback({
  //       cancel: true
  //     });
  //   }
  // });

  menuBuilder = MenuBuilder(mainWindow);

  // Set up necessary bindings to update the menu items
  // based on the current language selected
  // i18nextMainBackend.on("loaded", (loaded) => {
  //   i18nextMainBackend.changeLanguage("en");
  //   i18nextMainBackend.off("loaded"); // Remove listener to this event as it's not needed anymore
  // });
  i18nextMainBackend.on("initialized", (loaded) => {
    i18nextMainBackend.changeLanguage("en");
    i18nextMainBackend.off("initialized"); // Remove listener to this event as it's not needed anymore
  });

  // When the i18n framework starts up, this event is called
  // (presumably when the default language is initialized)
  // BEFORE the "initialized" event is fired - this causes an
  // error in the logs. To prevent said error, we only call the
  // below code until AFTER the i18n framework has finished its
  // "initialized" event.
  i18nextMainBackend.on("languageChanged", (lng) => {
    if (i18nextMainBackend.isInitialized) {
      menuBuilder.buildMenu(i18nextMainBackend);
    }
  });
}

// Needs to be called before app is ready;
// gives our scheme access to load relative files,
// as well as local storage, cookies, etc.
// https://electronjs.org/docs/api/protocol#protocolregisterschemesasprivilegedcustomschemes
protocol.registerSchemesAsPrivileged([{
  scheme: Protocol.scheme,
  privileges: {
    standard: true,
    secure: true
  }
}]);

const start = async () => {

  if (isDev) {
    installExtensions();
  }

  require("electron-debug")(); // https://github.com/sindresorhus/electron-debug

  if(serverProcess === null) {
    // openServerPort = await findPort();
    // serverPort = isPortAvailable(3001) ? 3001 : openServerPort
    serverPort = 8888
    console.log(`Running server on 0.0.0.0:${serverPort}`)
    createBackgroundProcess(serverPort);
  }

  if(mainWindow === null) {
    await createWindow();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on("ready", createWindow);
// Create a new browser window by invoking the createWindow
// function once the Electron application is initialized.
// Install REACT_DEVELOPER_TOOLS as well if isDev
app.whenReady().then(async () => {
  await start();
});

app.on("activate", async () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    await start();
  }
});

app.on("before-quit", () => {
  if (serverProcess) {
    serverProcess.kill()
    serverPort = null
    serverProcess = null
  }
})

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  } else {
    i18nextBackend.clearMainBindings(ipcMain);
    ContextMenu.clearMainBindings(ipcMain);
    SecureElectronLicenseKeys.clearMainBindings(ipcMain);
    store.clearMainBindings(ipcMain);
  }
});

// https://electronjs.org/docs/tutorial/security#12-disable-or-limit-navigation
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (contentsEvent, navigationUrl) => {
    /* eng-disable LIMIT_NAVIGATION_JS_CHECK  */
    const parsedUrl = new URL(navigationUrl);
    const validOrigins = [selfHost];

    // Log and prevent the app from navigating to a new page if that page"s origin is not whitelisted
    if (!validOrigins.includes(parsedUrl.origin)) {
      logger.error(
        `The application tried to navigate to the following address: "${parsedUrl}". This origin is not whitelisted and the attempt to navigate was blocked.`
      );

      contentsEvent.preventDefault();
    }
  });

  contents.on("will-redirect", (contentsEvent, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    const validOrigins = [];

    // Log and prevent the app from redirecting to a new page
    if (!validOrigins.includes(parsedUrl.origin)) {
      logger.error(
        `The application tried to redirect to the following address: "${navigationUrl}". This attempt was blocked.`
      );

      contentsEvent.preventDefault();
    }
  });

  // https://electronjs.org/docs/tutorial/security#11-verify-webview-options-before-creation
  contents.on("will-attach-webview", (contentsEvent, webPreferences, params) => {
    // Strip away preload scripts if unused or verify their location is legitimate
    delete webPreferences.preload;
    delete webPreferences.preloadURL;

    // Disable Node.js integration
    webPreferences.nodeIntegration = false;
  });

  // https://electronjs.org/docs/tutorial/security#13-disable-or-limit-creation-of-new-windows
  // This code replaces the old "new-window" event handling;
  // https://github.com/electron/electron/pull/24517#issue-447670981
  contents.setWindowOpenHandler(({
    url
  }) => {
    const parsedUrl = new URL(url);
    const validOrigins = [];

    // Log and prevent opening up a new window
    if (!validOrigins.includes(parsedUrl.origin)) {
      logger.error(
        `The application tried to open a new window at the following address: "${url}". This attempt was blocked.`
      );

      return {
        action: "deny"
      };
    }

    return {
      action: "allow"
    };
  });
});

// Filter loading any module via remote;
// you shouldn't be using remote at all, though
// https://electronjs.org/docs/tutorial/security#16-filter-the-remote-module
app.on("remote-require", (event, webContents, moduleName) => {
  event.preventDefault();
});

// built-ins are modules such as "app"
app.on("remote-get-builtin", (event, webContents, moduleName) => {
  event.preventDefault();
});

app.on("remote-get-global", (event, webContents, globalName) => {
  event.preventDefault();
});

app.on("remote-get-current-window", (event, webContents) => {
  event.preventDefault();
});

app.on("remote-get-current-web-contents", (event, webContents) => {
  event.preventDefault();
});
