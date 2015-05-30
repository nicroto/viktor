# viktor [![Build Status](https://secure.travis-ci.org/nicroto/viktor.png?branch=master)](http://travis-ci.org/nicroto/viktor)

Synthesizer.

## Dev procedures

### Compress images for site

```
$ for i in *.png; do ffmpeg -i $i -vframes 1 -compression_level 100 $i-1.png; done
```

## Release History

## License
Copyright (c) 2015 nicroto  
Licensed under the MIT license.
