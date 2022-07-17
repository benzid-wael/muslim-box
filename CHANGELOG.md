# Changelog

## [Unreleased]

### Fixed
- fix broken adhan
- recover after failure to invoke transition and remove the lock
- center slide horizontally
- quick transition due to lag on setting timer

### Added
- support of ARM architecture
- onReachEndStrategy for customizable sliding experience
- AutoUpdater support

### Changed
- use directly css3 properties for transition: remove react-spring dependency to decrease bundle size


## [0.0.1] - 10/07/2022
- auto-resolve the geocoordinate to compute prayer times
- prayer times calculation is suitable for high latitude locations
- initial +400 slides
- auto-play adhan at prayer times
- show random Quran verses
- low coverage for the English language in terms of slides
