# MuslimBox

MuslimBox aims to assist any muslim by providing useful information that touch their daily life. This app is designed to work on any desktop (linux, windows and macos). The app is useful for individuals as well as organisations and mosques.

## Get Started
To get started, clone this repository. Once cloned, install the dependencies for the repo by running the following commands:

```
npm i
npm run dev
```

> Are you using `yarn`? You'll want to [read this issue](https://github.com/reZach/secure-electron-template/issues/62).

When you'd like to test your app in production, or package it for distribution, please navigate to [this page](https://github.com/benzid-wael/muslim-box/blob/master/docs/scripts.md) for more details on how to do this.

To edit the SQLite database, you can use [SQLite Browser](https://sqlitebrowser.org/dl/)

```
brew install --cask db-browser-for-sqlite
```

## Architecture
For a more detailed view of the architecture of the template, please check out [here](https://github.com/benzid-wael/muslim-box/blob/master/docs/architecture.md). I would _highly_ recommend reading this document to get yourself familiarized with this project.


## FAQ
Please see [our faq](https://github.com/benzid-wael/muslim-box/blob/master/docs/faq.md) for any common questions you might have.
**NEW TO ELECTRON?** Please visit [this page](https://github.com/benzid-wael/muslim-box/blob/master/docs/newtoelectron.md).


## Release Process
1. Create a temporary [Github Token](https://github.com/settings/tokens/new.) with the following permissions:
    - repo scope permission
    - write packages permission
1. Create a release branch
1. Update package version in package.json
1. Run `GH_TOKEN=<token> npm run publish`
1. Check Github, you should find a new draft release with assets attached
1. Merge branch into master & tag the release
1. Edit Release description and publish it
