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
Copyright (c) 2015 Nikolay Tsenkov  
Licensed under the MIT license.
