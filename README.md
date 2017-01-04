# Viktor NV-1 Synthesizer [![Build Status](https://secure.travis-ci.org/nicroto/viktor.png?branch=master)](http://travis-ci.org/nicroto/viktor)

Synthesizer built on the Web Audio API.

## Development

### Setup

Fork and clone the repo. `cd` into it and install npm dependencies:

```shell
$ cd viktor
$ npm install
```

Install grunt-cli:

```shell
$ npm install -g grunt-cli
```

`cd` into the website dir, install bower dependencies and return to root:

```shell
$ cd src/server/client/
$ bower install
$ cd ../../../
```

This next step will be the only one you will use from now-on:

```shell
$ grunt d
```

This will rebuild the site in dev mode (scripts are not minified etc.), will start a node Express server and will start listening for changes on the FS, in case of which it will rebuild the site for you. You can access the site on `localhost:5000`.

### Note on commit procedure

Always execute grunt on the root of the repo to run linting and tests. If you setup a CI build in Travis for your fork, you will get notified if you accidentally broke the build.

### Contributing

I am happy to accept contributions. Please follow these rules, in case you want to submit a pull request:
 * Follow the coding style (your code should blend with the rest of it in a file or overall in the architecture);
 * Don't submit coding style changes, unless agreed upon in an issue;
 * Don't submit code that doesn't have any tangible benefit for the performance, look, functionality or sound of Viktor;
 * Always submit an issue (and wait for response from an owner), before you start coding, except in obvious situations like non-breaking fixes;
 * For every fix/feature do your best to cover them with tests (the project has almost no unit tests, right now, but this will change, if it breaks the state of a prototype and this is how it would happen).

## Dev procedures

### Add non-CommonJS dependency, which you need to load in the browserifyied code

Check how ng-file-upload is added to the browserify's pipeline in package.json. It's available on npm but it's not a CommonJS module, so me need to link to its dist file in `browser` and then to tell browserify what does it depend on what should be exported from it, in the browserify section:

```json
{
  ...
  "browser": {
	...
    "ng-file-upload": "./node_modules/ng-file-upload/dist/ng-file-upload-all.js",
    ...
  },
  "browserify-shim": {
  	...
    "ng-file-upload": {
      "depends": "angular",
      "exports": "angular.module('ngFileUpload')"
    },
    ...
  },
  ...
}
```

### Add a CommonJS dependency, which you need to load in the browserifyied code, but isn't on npm

Like the previous we need to specify where the source is (in the browser section), but there is no need for manually exporting stuff - it is a CommonJS module, it just isn't available through the npm. Check how I add Tuna.js for reference on this scenario.

### Compress images for site

Ideally images will, at some point be replaced, but until then, they need to be png's (for transparency) and since they are loaded once and the site doesn't navigate anywhere internally, it's better to have them as compressed as possible to save some bandwidth. This snippet can be improved to replace the old images (right now it creates the new ones alongside the oldies).

```
$ for i in *.png; do ffmpeg -i $i -vframes 1 -compression_level 100 $i-1.png; done
```

## Release History

 * 1.9.0 (4th of October, 2016)
   * Add: Envelope: lower boundary;
   * Fix: Filter Envelope: frequency shouldn’t go down under 1Hz;
   * Fix: Filter LFO: shouldn’t get filter frequency to anything lower than 1Hz;
   * Reenable: all disabled patches.
 * 0.8.5 (27th of September, 2016)
   * Fix: breaking change in Chrome (53...), AudioParam.setValueAtTime doesn't accept 0 for time (only a value relative to context.currentTime).
 * 0.8.4 (5th of August, 2016)
   * Fix: ChromeIssue: with latest update AudioParam.setTargetAtTime doesn't accept 0 as last param.
   * Improve: order of default patches;
   * TemporaryFix: Chrome's newest Web Audio breaks patches - had to disable a couple of patches.
 * 0.8.3 (22nd of June, 2016)
   * Fix: Envelope: too quick release clips.
   * Fix: changing patches often causes loud glitches.
   * Fix: Library: error on load when selected patch doesn't exist.
   * Add: Patch: "EQUIVALENT-CHORD-PAD-1".
   * Add: Patch: "EQUIVALENT-CHORD-PAD-2".
   * Add: Patch: "Gryphon 1977".
   * Add: Patch: "Gryphon 1979".
   * Add: Patch: "Wow - Cats".
   * TemporaryFix: Chrome's newest Web Audio breaks patches:
     * TemporaryRemove: Patch: "Danger Bubbles".
     * TemporaryRemove: Patch: "Sirens' Awakening".
     * TemporaryRemove: Patch: "Cooh bass 1".
     * TemporaryRemove: Patch: "BRAINPAIN Mod Wheel Frenzy".
 * 0.8.2 (4th of April, 2016)
   * DevImprove: Lock npm dependencies.
 * 0.8.1 (13th of March, 2016)
   * Add: Settings: MIDI Input.
   * Add: change patch selection with Left & RightArrow keys.
 * 0.8 (12th of March, 2016)
   * Fix: patches with Envelope set to Release:0 stop system sound in Chrome.
   * Add: Patch: "EQUIVALENT-BASS-1".
   * Add: Patch: "BRAINPAIN Mod Wheel Frenzy".
   * Add: Patch: "Pumped Bass".
   * Add: Patch: "Cooh bass 1".
   * Add: Patch: "Timmo^Bass01".
   * Add: Patch: "Freqax Bass".
   * Add: Patch: "Niada's Sap Bass".
   * Add: Patch: "Eclectic Method Bass".
   * Add: Patch: "Soft Bass".
   * Add: Patch: "8 mile Free World Car Bass".
   * Add: Patch: "Muffled Razr Bass".
   * Add: Patch: "Da Buzzer".
   * Add: Patch: "Glass Bell Bass".
   * Add: Patch: "Turbo Saw Lead".
   * Add: Patch: "singende Säge Lead".
   * Add: Patch: "Orchestra Pad".
   * Add: Patch: "Netjester Kush Pad".
   * Add: Patch: "Bass Fanfares".
   * Add: Patch: "suitcase organ pad".
   * Add: Patch: "Sirens' Awakening".
   * Add: Patch: "Long Kiss".
   * Add: Patch: "Danger Bubbles".
   * Add: Patch: "Syo - demo".
   * Add: Patch: "Flint Kids Shuttledron".
   * Add: Patch: "Whale song - Synthakt".
   * Add: Patch: "AC1".
   * Add: Patch: "AC2".
   * Add: Patch: "Ghosts".
   * Add: Patch: "BB8".
   * Add: Patch: "Outer Space".
 * 0.7 (5th of January, 2016)
   * Improve: Remove the need for async init of Viktor.
 * 0.6 (26th of September, 2015)
   * Add: Effect: Compressor.
 * 0.5.3 (21th of September, 2015)
   * Add: Patch: Cut through that Mix.
 * 0.5.2 (21th of September, 2015)
   * Add: FineDetune of oscillators.
 * 0.5.1 (18th of September, 2015)
   * FineTune: ModWheel.
 * 0.5 (17th of September, 2015)
   * Add: MIDI: Sustain pedal support;
   * Add: MIDI: Volume knob/slider support;
   * Add: Patch: Underwater Bass Lead.
 * 0.4.1 (11th of September, 2015)
   * Add: Velocity Sensitivity.
 * 0.4 (10th of September, 2015)
   * Add: Polyphony;
   * Add: Patch: Electric Piano;
   * Add: Patch: 8-bit Shogun;
   * Add: Patch: Electric Clavessine;
   * Add: Patch: Electric Clavessine 2;
   * Add: Patch: Organ Thingie;
   * Add: Patch: Accordion.
 * 0.3 (6th of September, 2015)
   * Add: sharing a patch through url;
   * Add: creating a custom patch from url params;
   * Add: selecting patch by url param.
 * 0.2 (4th of September, 2015)
   * Extract: viktor-nv1-engine npm package;
   * Extract: viktor-nv1-settings-convertor npm package.

 * 0.1.1 (14th of June, 2015)
   * Fix: synth: multiple noteOn of the same tone before noteOff creates constant tone;
   * Add: control through QWERTY keyboard.

 * 0.1 (1st of June, 2015).

## License
Copyright (c) 2017 Nikolay Tsenkov  
Licensed under the MIT license.
