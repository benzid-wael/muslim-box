const path = require('path');

const { Menu, MenuItem, BrowserWindow, shell } = require("electron");
const i18nBackend = require("i18next-electron-fs-backend");
const openAboutWindow = require("about-window").default;

const { checkForUpdates } = require("./updater");
const whitelist = require("../localization/whitelist");
const isMac = process.platform === "darwin";
const isDev = process.env.NODE_ENV === "development";
const prependPath = path.join(__dirname, "../..");

const MenuBuilder = function(mainWindow, processManager) {
  // https://electronjs.org/docs/api/menu#main-process
  const defaultTemplate = function(i18nextMainBackend) {
    const firstReleaseYear = 2022;
    const thisYear = new Date(Date.now()).getFullYear();
    const copyrightYear = thisYear === firstReleaseYear ? `${firstReleaseYear}` : `${firstReleaseYear} - ${thisYear}`;
    const icon = path.join(prependPath, "/resources/icon.png");
    const packageJson = require(path.join(prependPath, "package.json"))
    const deps = packageJson.dependencies;
    const devDeps = packageJson.devDependencies;

    const appMenu = [{
      label: i18nextMainBackend.t("About MuslimBox"),
      click: () => (
        openAboutWindow({
          fullScreenable: false,
          width: 600,
          height: 600,
          icon_path: icon,
          description: packageJson.description,
          copyright: `Copyright ©️ ${copyrightYear} MuslimBox`,
          package_json_dir: prependPath,
          open_devtools: isDev,
          use_version_info: [
            ['Electron', devDeps.electron],
            ['React', deps.react],
          ],
        })
      )
    }, {
      label: i18nextMainBackend.t("Check for Updates..."),
      accelerator: 'Command+U',
      click: checkForUpdates
    }, {
      type: 'separator'
    }, {
      role: "hide",
      label: i18nextMainBackend.t("Hide")
    }, {
      role: "hideothers",
      label: i18nextMainBackend.t("Hide Others")
    }, {
      role: "unhide",
      label: i18nextMainBackend.t("Unhide")
    }, {
      type: "separator"
    },
    ...(
    isMac
      ?
      [{
        role: "close",
        label: i18nextMainBackend.t("Close")
      },
      {
        role: "quit",
        label: i18nextMainBackend.t("Exit")
      }]
      :
      [{
        role: "quit",
        label: i18nextMainBackend.t("Exit")
      }]
    )];

    const viewMenu = [{
      role: "reload",
      label: i18nextMainBackend.t("Reload")
    }, {
      role: "forcereload",
      label: i18nextMainBackend.t("Force Reload")
    }, {
      role: "toggledevtools",
      label: i18nextMainBackend.t("Toggle Developer Tools")
    }, {
      label: i18nextMainBackend.t("Process Manager"),
      click: () => {
        processManager.openWindow()
      }
    }, {
      type: "separator"
    }, {
      role: "resetzoom",
      label: i18nextMainBackend.t("Reset Zoom")
    }, {
      role: "zoomin",
      label: i18nextMainBackend.t("Zoom In")
    }, {
      role: "zoomout",
      label: i18nextMainBackend.t("Zoom Out")
    }, {
      type: "separator"
    }, {
      role: "togglefullscreen",
      label: i18nextMainBackend.t("Toggle Fullscreen")
    }];

    return [
      // { role: "appMenu" }
      {
        label: i18nextMainBackend.t("MuslimBox"),
        submenu: appMenu,
      },
      // { role: "viewMenu" }
      ...(
        isDev
          ?
          [{
            label: i18nextMainBackend.t("View"),
            submenu: viewMenu,
          }]
          :
          []
      ),
      // language menu
      {
        label: i18nextMainBackend.t("Language"),
        submenu: whitelist.buildSubmenu(i18nBackend.changeLanguageRequest, i18nextMainBackend)
      },
      {
        role: "help",
        label: i18nextMainBackend.t("Help"),
        submenu: [
          {
            label: i18nextMainBackend.t("How we calculate prayer times?"),
            click: async () => {
              await shell.openExternal("https://www.moonsighting.com/how-we.html");
            }
          },
          {
            label: i18nextMainBackend.t("FAQ"),
            click: async () => {
              await shell.openExternal("https://www.moonsighting.com/faq_pt.html");
            }
          },
          ...(
            isDev
            ?
            [{
              label: i18nextMainBackend.t("Prayer Times Calculation"),
              click: async () => {
                await shell.openExternal("http://praytimes.org/calculation");
              }
            }]
            :
            []
          )
        ]
      }
    ];
  };

  return {
    buildMenu: function(i18nextMainBackend) {
      const menu = Menu.buildFromTemplate(defaultTemplate(i18nextMainBackend));
      Menu.setApplicationMenu(menu);
      // app.applicationMenu = menu;
      return menu;
    }
  };
};

module.exports = MenuBuilder;
