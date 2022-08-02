// Contains a whitelist of languages for our app
const whitelistMap = {
  ar: "العربية", // Arabic
  "ar-TN": "العربية (تونس)", // Arabic-Tunisia
  en: "English",
  fr: "Français", // French
};

const Whitelist = (function () {
  const keys = Object.keys(whitelistMap);
  const clickFunction = function (channel, lng, i18nextMainBackend) {
    return function (menuItem, browserWindow, event) {
      // Solely within the top menu
      i18nextMainBackend.changeLanguage(lng);

      // Between renderer > main process
      browserWindow.webContents.send(channel, {
        lng,
      });
    };
  };

  return {
    langs: keys,
    buildSubmenu: function (channel, i18nextMainBackend) {
      let submenu = [];

      for (const key of keys) {
        submenu.push({
          label: whitelistMap[key],
          click: clickFunction(channel, key, i18nextMainBackend),
        });
      }

      return submenu;
    },
  };
})();

module.exports = Whitelist;
