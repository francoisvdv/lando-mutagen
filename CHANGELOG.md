# Changelog
.
### [1.0.12](https://github.com/francoisvdv/lando-mutagen/compare/v1.0.11...v1.0.12) (2022-08-08)


### Bug Fixes

* Use root path to specify mutagen file location ([95173f9](https://github.com/francoisvdv/lando-mutagen/commit/95173f947eb3401c4d2fabcd2fd5cc412329f640))

### [1.0.11](https://github.com/francoisvdv/lando-mutagen/compare/v1.0.10...v1.0.11) (2022-07-15)


### Bug Fixes

* **#66:** lando-mutagen now works with lando configuration files that do not have an explicit 'services' key - for example when using just a recipe ([2ff9df3](https://github.com/francoisvdv/lando-mutagen/commit/2ff9df3d3a1ebb15ba87b8287c774d4435c98d0f)), closes [#66](https://github.com/francoisvdv/lando-mutagen/issues/66)

### [1.0.10](https://github.com/francoisvdv/lando-mutagen/compare/v1.0.9...v1.0.10) (2022-05-05)


### Bug Fixes

* **#56:** On checking if Mutagen is available in the project, do not crash when there are no services defined and instead do nothing (not use mutagen). ([8a17b64](https://github.com/francoisvdv/lando-mutagen/commit/8a17b64847f49edbb969e52040bf284512f54e54)), closes [#56](https://github.com/francoisvdv/lando-mutagen/issues/56)

### [1.0.9](https://github.com/francoisvdv/lando-mutagen/compare/v1.0.8...v1.0.9) (2022-04-25)


### Bug Fixes

* **#39:** Use 'where.exe' instead of 'which' on Windows to check for existence of mutagen executable ([bc80072](https://github.com/francoisvdv/lando-mutagen/commit/bc800720672b0328b3611c31e5c44f3c01ac44bf)), closes [#39](https://github.com/francoisvdv/lando-mutagen/issues/39)

### [1.0.8](https://github.com/francoisvdv/lando-mutagen/compare/v1.0.7...v1.0.8) (2022-03-28)


### Bug Fixes

* Strip non-alphanumeric characters from mutagen sync name to prevent "invalid synchronization session name" error. Fixes [#28](https://github.com/francoisvdv/lando-mutagen/issues/28) ([62711cb](https://github.com/francoisvdv/lando-mutagen/commit/62711cb7e86c8e8920cb3c9eb145422d9eadf488))

### [1.0.7](https://github.com/francoisvdv/lando-mutagen/compare/v1.0.6...v1.0.7) (2022-02-24)


### Bug Fixes

* Do not print mutagen isRunning output (too much noise) ([32dff96](https://github.com/francoisvdv/lando-mutagen/commit/32dff96154046f662ae617496eb8dde63cc91b6c))
* If the mutagen project is already running when starting a Lando project, log it and do not throw an error ([358eb8e](https://github.com/francoisvdv/lando-mutagen/commit/358eb8e8fcc4f167bd744eb581fbc015c1499866))
* Stopping Lando project throws error if mutagen project not running ([#2](https://github.com/francoisvdv/lando-mutagen/issues/2)) ([c2a214f](https://github.com/francoisvdv/lando-mutagen/commit/c2a214f630d28a55d055b8293fd9a3505b842351))
* Fix mutagen sample's indentation in README ([5bc793c](https://github.com/francoisvdv/lando-mutagen/commit/5bc793cee2a82e977d1b5300f1e611e00c0fab38))

### [1.0.6](https://github.com/francoisvdv/lando-mutagen/compare/v1.0.5...v1.0.6) (2022-02-21)

### [1.0.5](https://github.com/francoisvdv/lando-mutagen/compare/v1.0.4...v1.0.5) (2022-02-21)

### [1.0.4](https://github.com/francoisvdv/lando-mutagen/compare/v1.0.3...v1.0.4) (2022-02-21)

### [1.0.3](https://github.com/francoisvdv/lando-mutagen/compare/v1.0.2...v1.0.3) (2022-02-21)

### [1.0.2](https://github.com/francoisvdv/lando-mutagen/compare/v1.0.1...v1.0.2) (2022-02-21)

### [1.0.1](https://github.com/francoisvdv/lando-mutagen/compare/v1.0.0...v1.0.1) (2022-02-21)
