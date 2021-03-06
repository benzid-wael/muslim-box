# About this repository

## Features
Taken from the [best-practices](https://electronjs.org/docs/tutorial/security) official page, here is what this repository offers!

1. [Only load secure content](https://electronjs.org/docs/tutorial/security#1-only-load-secure-content) - ✅ (But the developer is responsible for loading secure assets only 🙂)
2. [Do not enable node.js integration for remote content](https://electronjs.org/docs/tutorial/security#2-do-not-enable-nodejs-integration-for-remote-content) - ✅
3. [Enable context isolation for remote content](https://electronjs.org/docs/tutorial/security#3-enable-context-isolation-for-remote-content) - ✅
4. [Handle session permission requests from remote content](https://electronjs.org/docs/tutorial/security#4-handle-session-permission-requests-from-remote-content) - ✅
5. [Do not disable websecurity](https://electronjs.org/docs/tutorial/security#5-do-not-disable-websecurity) - ✅
6. [Define a content security policy](https://electronjs.org/docs/tutorial/security#6-define-a-content-security-policy) - ✅
7. [Do not set allowRunningInsecureContent to true](https://electronjs.org/docs/tutorial/security#7-do-not-set-allowrunninginsecurecontent-to-true) - ✅
8. [Do not enable experimental features](https://electronjs.org/docs/tutorial/security#8-do-not-enable-experimental-features) - ✅
9. [Do not use enableBlinkFeatures](https://electronjs.org/docs/tutorial/security#9-do-not-use-enableblinkfeatures) - ✅
10. [Do not use allowpopups](https://electronjs.org/docs/tutorial/security#10-do-not-use-allowpopups) - ✅
11. [&lt;webview&gt; verify options and params](https://electronjs.org/docs/tutorial/security#11-verify-webview-options-before-creation) - ✅
12. [Disable or limit navigation](https://electronjs.org/docs/tutorial/security#12-disable-or-limit-navigation) - ✅
13. [Disable or limit creation of new windows](https://electronjs.org/docs/tutorial/security#13-disable-or-limit-creation-of-new-windows) - ✅
14. [Do not use openExternal with untrusted content](https://electronjs.org/docs/tutorial/security#14-do-not-use-openexternal-with-untrusted-content) - ✅
15. [Disable remote module](https://electronjs.org/docs/tutorial/security#15-disable-the-remote-module) - ✅
16. [Filter the remote module](https://electronjs.org/docs/tutorial/security#16-filter-the-remote-module) - ✅
17. [Use a current version of electron](https://electronjs.org/docs/tutorial/security#17-use-a-current-version-of-electron) - ✅

## Included frameworks
Built-in to this template are a number of popular frameworks already wired up to get you on the road running.

- [Electron](https://electronjs.org/)
- [Express JS](https://expressjs.com/)
- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/) (with [Redux toolkit](https://redux-toolkit.js.org/))
- [Babel](https://babeljs.io/)
- [Webpack](https://webpack.js.org/) (with [webpack-dev-server](https://github.com/webpack/webpack-dev-server))
- [Electron builder](https://www.electron.build/) (for packaging up your app)
- [Mocha](https://mochajs.org/)

## Bonus modules
What would a template be without some helpful additions?

- [i18next](https://www.i18next.com/) (with [this plugin](https://github.com/reZach/i18next-electron-fs-backend) for localization).
- [Store](https://github.com/reZach/secure-electron-store) (for saving config/data)
- [Context menu](https://github.com/reZach/secure-electron-context-menu) (supports custom context menus)
- [Easy redux undo](https://github.com/reZach/easy-redux-undo) (for undo/redoing your redux actions)
- [License key validation](https://github.com/reZach/secure-electron-license-keys) (for validating a user has the proper license to use your app) **new!**
