# Changelog

## [1.7.0](https://github.com/schie/medical-out-of-pocket/compare/v1.6.0...v1.7.0) (2025-08-10)


### Features

* add ABA CPT codes ([617484e](https://github.com/schie/medical-out-of-pocket/commit/617484e1bf1470ba88c358ed98f52b7242f7416b))

## [1.6.0](https://github.com/schie/medical-out-of-pocket/compare/v1.5.0...v1.6.0) (2025-08-10)


### Features

* **components:** integrating deductible usage ([87bf5c9](https://github.com/schie/medical-out-of-pocket/commit/87bf5c91cad42a530eb42eb51e68619d3cee102c))
* **store:** adding `InsuranceState.deductibleUsed` ([d85e3fa](https://github.com/schie/medical-out-of-pocket/commit/d85e3fa06288df601f2d7aec2935ff107d49f285))
* **ui:** add empty procedures state message ([f083133](https://github.com/schie/medical-out-of-pocket/commit/f0831335c032b4cde721d15acb5d66b0c0cafa59))


### Reverts

* **store:** removing `updatePrimaryOOPUsage` and `updateSecondaryOOPUsage` ([ef084b7](https://github.com/schie/medical-out-of-pocket/commit/ef084b752e4aa9c1fb6a3d9c49e0cd8b3d0c88d9))

## [1.5.0](https://github.com/schie/medical-out-of-pocket/compare/v1.4.0...v1.5.0) (2025-06-21)


### Features

* add application header ([41ec36c](https://github.com/schie/medical-out-of-pocket/commit/41ec36c300ee09c6101ff4d389f8beb924eced73))
* **app:** update disclaimer footer with negotiated rates note ([4dd42bc](https://github.com/schie/medical-out-of-pocket/commit/4dd42bcdeed5458d659da1e171881dd63604d4e6))
* **procedures:** add ability to remove all ([11d3084](https://github.com/schie/medical-out-of-pocket/commit/11d3084e9fb07b8a2124647dcf0ba46663cbaabc))


### Bug Fixes

* **stores/selectors:** fixing floating point precision issues ([e2b80d4](https://github.com/schie/medical-out-of-pocket/commit/e2b80d400ea9319f274acd0ba64c63e3f225c4cb))

## [1.4.0](https://github.com/schie/medical-out-of-pocket/compare/v1.3.1...v1.4.0) (2025-06-20)


### Features

* **ccomponents/procedurescard:** adding cpt-code search ([01b8fc1](https://github.com/schie/medical-out-of-pocket/commit/01b8fc1faaa2ded21a573502a6d3b5deb21f85c6))
* preseting version ([#38](https://github.com/schie/medical-out-of-pocket/issues/38)) ([6a3961d](https://github.com/schie/medical-out-of-pocket/commit/6a3961d6086aecd4154cffeeb40aa50ed89d3c97))

## [1.3.1](https://github.com/schie/medical-out-of-pocket/compare/v1.3.0...v1.3.1) (2025-06-20)


### Bug Fixes

* extract Field component; fix form bug ([a5974e1](https://github.com/schie/medical-out-of-pocket/commit/a5974e1d250834d8e9df1fd243cf61fc3631340e))

## [1.3.0](https://github.com/schie/medical-out-of-pocket/compare/v1.2.0...v1.3.0) (2025-06-11)


### Features

* add disclaimer footer ([cce8e4a](https://github.com/schie/medical-out-of-pocket/commit/cce8e4afec374d47cd9e0e6c348d643b49db5f17))
* **components/insurancecard:** adding tool tips ([e874576](https://github.com/schie/medical-out-of-pocket/commit/e874576e97c09b05f56a1bfea55fe0a4808aa0d6))
* remove insurance name usage ([5aff557](https://github.com/schie/medical-out-of-pocket/commit/5aff5574eaedf373b3d15efc152c87c2549cd86e))

## [1.2.0](https://github.com/schie/medical-out-of-pocket/compare/v1.1.1...v1.2.0) (2025-06-11)


### Features

* add labels for insurance form inputs ([4c03489](https://github.com/schie/medical-out-of-pocket/commit/4c034892689d30c6bdd9690cc7e6a7f87bc7222a))
* adding secondary insurance, cost breakdown ([6c99ad4](https://github.com/schie/medical-out-of-pocket/commit/6c99ad43e537fdd498224b6840d01dda805460d6))
* **app:** arrange cards horizontally ([0ac4a88](https://github.com/schie/medical-out-of-pocket/commit/0ac4a88fe07ff66dac62888dcb24861b04a3f24c))
* **ui:** adding corner buttons for managing secondary insurance ([e661771](https://github.com/schie/medical-out-of-pocket/commit/e6617717829dcb608068d8bc34726ec29e29a006))


### Bug Fixes

* ***.css:** removing all old styling ([63abb57](https://github.com/schie/medical-out-of-pocket/commit/63abb57b1bca33c6fa567d393c7300ed98baa35a))

## [1.1.1](https://github.com/schie/medical-out-of-pocket/compare/v1.1.0...v1.1.1) (2025-06-08)


### Bug Fixes

* **app:** adding missing import of `useEffect` ([bdb91cd](https://github.com/schie/medical-out-of-pocket/commit/bdb91cd0a01a929b7cae39b2460b140ceddb73f5))

## [1.1.0](https://github.com/schie/medical-out-of-pocket/compare/v1.0.0...v1.1.0) (2025-06-08)


### Features

* Adding insurance plan card ([#15](https://github.com/schie/medical-out-of-pocket/issues/15)) ([a7b3dd8](https://github.com/schie/medical-out-of-pocket/commit/a7b3dd891c6b11c0fcae56aa0ac9ef05174cac3a))
* **ui:** enhance procedure forms with validator ([46daf3c](https://github.com/schie/medical-out-of-pocket/commit/46daf3c692480b36aa5858031ca5038a2c247eb3))


### Bug Fixes

* **ui:** align procedure items left and add scrolling ([d77915e](https://github.com/schie/medical-out-of-pocket/commit/d77915ee6e688a1c0f6736cbf7d27e2980c2e531))

## 1.0.0 (2025-06-08)


### Features

* adding procedures management card ([#6](https://github.com/schie/medical-out-of-pocket/issues/6)) ([a74978d](https://github.com/schie/medical-out-of-pocket/commit/a74978d513d55b7166f1b7b11e0ae21975355c33))
* **procedures:** show errors and disable invalid actions ([bf6aa43](https://github.com/schie/medical-out-of-pocket/commit/bf6aa436e6659bb5e32a05ffaaaff01f8904e875))
* **redux:** adding redux and tests ([bbe71b9](https://github.com/schie/medical-out-of-pocket/commit/bbe71b928d36adec6298557aa9dc359a474807a1))
* **ui:** integrate Font Awesome icons ([05d5e3d](https://github.com/schie/medical-out-of-pocket/commit/05d5e3d2903ce1561e3683e8aceceb08366985de))


### Bug Fixes

* **components/procedurescard:** linting ([4ab1ec6](https://github.com/schie/medical-out-of-pocket/commit/4ab1ec6599fe94490b38cd8fce2dede0ae1b8910))
