# Changelog

## [Unreleased]

### Fixed

- fix broken adhan
- recover after failure to invoke transition and remove the lock
- center slide horizontally
- quick transition due to redux action lag when setting timer for slide duration
- build failure as electron expects icons inside <RESOURCE_DIR>/icons
- runtime error due the provided cwd flag when spawning server process

### Added

- Support of ARM architecture
- onReachEndStrategy for customizable sliding experience
- AutoUpdater support
- Settings page
- Support of Contextual slides
- Support of prayer time slides: we aim to show relevant slides before/after prayer

### Changed

- use directly css3 properties for transition: remove react-spring dependency to decrease bundle size
- move palying adhan responsability to the root component

## [0.0.1] - 10/07/2022

- auto-resolve the geocoordinate to compute prayer times
- prayer times calculation is suitable for high latitude locations
- initial +400 slides
- auto-play adhan at prayer times
- show random Quran verses
- low coverage for the English language in terms of slides
