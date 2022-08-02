/**
 * updater.js
 *
 * Please use manual update only when it is really required, otherwise please use recommended non-intrusive auto update.
 *
 * Import steps:
 * 1. create `updater.js` for the code snippet
 * 2. require `updater.js` for menu implementation, and set `checkForUpdates` callback from `updater` for the click property of `Check Updates...` MenuItem.
 */
const os = require("os");
const path = require("path");

const { dialog } = require("electron");
const { autoUpdater, UpdateInfo } = require("electron-updater");
const gh = require("github-url-to-object");

const pkg = require(path.join(__dirname, "/../../package.json"));

const userAgent = `${pkg.name}/${pkg.version} (${os.platform()}:${os.arch()})`;
let updater;

autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";
autoUpdater.autoDownload = false;

autoUpdater.on("error", (error) => {
  updater.enabled = true;
  dialog.showErrorBox("[😡] Error: ", error == null ? "unknown" : (error.stack || error).toString());
});

autoUpdater.on("checking-for-update", () => {
  logger.info("✨ checking for update...");
});

autoUpdater.on("update-available", (updateInfo) => {
  logger.info("🆕 update available");
  // For further details, see https://github.com/electron/update-electron-app/blob/master/index.js
  const { version, releaseName, releaseDate } = updateInfo;
  const releaseInfoMsg = releaseName ? `${releaseName} (v${version})` : `Version ${updateInfo.version}`;
  dialog
    .showMessageBox({
      type: "info",
      title: releaseName ? `${releaseName} available` : `v${version} available`,
      message: `${releaseInfoMsg} is available. Do you want update now?`,
      buttons: ["Sure", "No"],
    })
    .then((buttonIndex) => {
      if (buttonIndex === 0) {
        autoUpdater.downloadUpdate();
      } else {
        updater.enabled = true;
        updater = null;
      }
    });
});

autoUpdater.on("update-not-available", () => {
  dialog.showMessageBox({
    title: "No Updates",
    message: "Current version is up-to-date.",
  });
  updater.enabled = true;
  updater = null;
});

autoUpdater.on("update-downloaded", () => {
  dialog
    .showMessageBox({
      title: "Install Updates",
      message: "Updates downloaded, application will be quit for update...",
    })
    .then(() => {
      // setImmediate(() => autoUpdater.quitAndInstall())

      setTimeout(function () {
        autoUpdater.quitAndInstall();
      }, 3000);
    });
});

// export this to MenuItem click callback
function checkForUpdates(menuItem, focusedWindow, event) {
  logger.info("🚢 Checking for updates...");
  updater = menuItem;
  updater.enabled = false;
  autoUpdater.checkForUpdates();
}

module.exports.checkForUpdates = checkForUpdates;
