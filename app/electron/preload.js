const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const i18nextBackend = require("i18next-electron-fs-backend");
const Store = require("secure-electron-store").default;
const ContextMenu = require("secure-electron-context-menu").default;
const SecureElectronLicenseKeys = require("secure-electron-license-keys");

// Create the electron store to be made available in the renderer process
const store = new Store();

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  i18nextElectronBackend: i18nextBackend.preloadBindings(ipcRenderer, process),
  store: store.preloadBindings(ipcRenderer, fs),
  contextMenu: ContextMenu.preloadBindings(ipcRenderer),
  licenseKeys: SecureElectronLicenseKeys.preloadBindings(ipcRenderer),
  onBackendUrlChanged: (callback) => {
    ipcRenderer.on("backend-url-changed", function (evt, message) {
      console.log(`backendUrlChanged: ${message.backendURL}`)
      callback(message)
    })
  },
  onLanguageInitialized: (callback) => {
    ipcRenderer.on("language-initialized", function (evt, message) {
      callback(message)
    })
  },
  onGeocoordinatesChanged: (callback) => {
    console.log(`[preload] onGeocoordinatesChanged initialized`)
    ipcRenderer.on("geocordinates-changed", function (evt, message) {
      console.log(`[preload] onGeocoordinatesChanged: ${JSON.stringify(message)}`)
      callback(message)
    })
  },
});
