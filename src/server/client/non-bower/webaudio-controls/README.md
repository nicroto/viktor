# webaudio-controls

**WebAudioControls** is GUI parts library for Web application using [Polymer] WebComponents.  
Especially suitable for audio-applications like VST plugins.  

**WebAudioControls** is consist of following components  

Component | Description 
---|---
webaudio-knob | Rotating or some other frame-by-frame animation knob
webaudio-slider | Vertical or Horizontal slider
webaudio-switch | Toggle/Kick/Radio switches
webaudio-param | Editable value display field
webaudio-keyboard | Mouse/Touch playable keyboard. multi-touch support.

Chrome / Firefox / Safari / Opera / IE compatible  
iOS and Android touch devices compatible  

[Live Demo sample1 (with external image-files)](https://rawgithub.com/g200kg/webaudio-controls/master/sample1.html)  
[Live Demo sample2 (with code example)](https://rawgithub.com/g200kg/webaudio-controls/master/sample2.html)  
[Live Demo sample3 (Knob/Slider/Switch/Param/Keyboard default style)](https://rawgithub.com/g200kg/webaudio-controls/master/sample3.html)  
[Live Demo sample4 (webaudio-keyboard to webMIDIAPI)](https://rawgithub.com/g200kg/webaudio-controls/master/sample4.html)  
 (need Mac+ChromeCanary+flagEnabled+MIDIdevice or Win+JazzPlugin or Mac+JazzPlugin+MidiDevice)  
[Renoid : Practical application using webaudio-controls](http://www.g200kg.com/renoid/)  

Using with external image-files.  
[![](img/demo.png)](https://rawgithub.com/g200kg/webaudio-controls/master/sample1.html)  

Default style with no external image-files.  
[![](img/sample3.png)](https://rawgithub.com/g200kg/webaudio-controls/master/sample3.html)  

## To Operate  
Operation | Component | Description
---|---|---
**Click** | Switch/Param | toggle / activate the switch or focus the param
**Drag** | Knob/Slider | up/right to increase value / down/left to decrease value
**Shift+Drag** | Knob/Slider | fine control
**Ctrl+Click / Command+Click(Mac)** | Knob/Slider/Switch | set to default value
**Edit with Keyboard** | Param | edit the value directly
**MouseWheel** | Knob/Slider | rotate upward to increase value / downward to decrease value
**Shift+MouseWheel** | Knob/Slider | fine control
**Mouse Button Press / Touch** | Keyboard | play keyboard. multi-touch is supported

---
## How to use

- load polymer.html
```html
<link rel="import" href="./bower_components/polymer/polymer.html">
```

- link to webaudio-knob component
```html
<link rel="import" href="webcomponents/webaudio-controls.min.html">
```

- insert `webaudio-knob/slider/switch/param/keyboard` element
```html
<webaudio-knob src="img/LittlePhatty.png" sprites="100" min="0" max="100"></webaudio-knob>
<webaudio-slider src="img/hsliderbody.png"></webaudio-slider>
<webaudio-switch src="img/switch_toggle.png" width="32" height="32"></webaudio-switch>  
<webaudio-param src="" link="knob-1"></webaudio-param>
<webaudio-keyboard keys="25"></webaudio-keyboard&gt;  
````

### Performance
hoge.min.html, which is vulcanized polymer element, are located in _lib_ direcotry. Use these for faster loading of polymer elements.

## Attributes

### webaudio-knob

Attribute  | Options      | Default          | Description
---        | ---                  | ---                 | ---
**src** | string | Internal embedded resource is used if not specified | url of the vertical stitched knob image
**value** | float | `0` | The current value. Also used as initial value if specified
**defvalue** | float | Initial 'value' is used if not specified | The default value that will be used when ctrl+click
**min** | float | `0` | Minimum value of the knob
**max** | float | `100` | Maximum value of the knob
**step** | float | `1` | Value step of the control. The 'value' is always rounded to multiple of 'step'
**width** | int | `64` | Knob display width in px
**height** | int | `64` | Knob display height in px
**diameter** | int | `64` | Knob display diameter in px. This attribute can be used instead of width / height if the display image is square
**sprites** | int | `0` | if `0`, the "src" image should be single frame image that indicate middle position. the image will be rotated -135deg to +135deg. if "sprirites" is not `0`, the "src" image should be stitched multi-framed image. "sprites" specify the max frame number in the stitched knob image. Note that this is (number of frames) - 1
**sensitivity** | float | `1` | Pointing device sensitivity. min-max range correspond to (128 / 'sensitivity') px
**valuetip** | `0`,`1` | `1` | Enable the overlaid value-tip display.
**tooltip** | string | `null` | Tooltip text that will be shown when mouse hover a while
**enable** | `0`,`1` | `1` | Enable control with the pointing device.

### webaudio-slider

Attribute  | Options      | Default          | Description
---        | ---                  | ---                 | ---
**src** | string | Internal embedded resource is used if not specified | url of the slider background image
**knobsrc** | string | Internal embedded resouce is used if not specified | url of the slider knob part image
**value** | float | `0` | The current value. Also used as initial value if specified
**defvalue** | float | Initial 'value' is used if not specified | The default value that will be used when ctrl+click
**min** | float | `0` | Minimum value of the slider
**max** | float | `100` | Maximum value of the slider
**step** | float | `1` | Value step of the control. The 'value' is always rounded to multiple of 'step'
**width** | int | `24` | Slider display width in px
**height** | int | `128` | Slider display height in px
**knobwidth** | int | same as 'width' if 'direction' is `vert`, or same as 'height' if 'direction' is `horz` | Slider knob part width in px
**knobheight** | int | same as 'width' if 'direction' is `vert`, or same as 'height' if 'direction' is `horz` | Slider knob part height in px
**ditchLength** | int | ('height'-'knobheight') or ('width'-'knobwidth')  depends on 'direction' | Knob movable length
**direction** | `"vert"`,`"horz"` | `"vert"` | Slider direction. vertical or horizontal
**sensitivity** | float | `1` | Pointing device sensitivity. min-max range correspond to (128 / 'sensitivity') px
**valuetip** | `0`,`1` | `1` | Enable the overlaid value-tip display.
**tooltip** | string | `null` | Tooltip text that will be shown when mouse hover a while
**enable** | `0`, `1` | `1` | Enable control with the pointing device.

### webaudio-switch

Attribute  | Options      | Default          | Description
---        | ---                  | ---                 | ---
**src** | string | Internal embedded resource is used if not specified | url of the vertical stitched switch image
**value** | `0`,`1` | `0` | The current value (`0` or `1`). Also used as initial value of the switch if specified
**defvalue** | `0`,`1` | Initial 'value' is used if not specified | The default value that will be used when ctrl+click
**width** | int | `32` | Switch display width in px
**height** | int | `32` | Switch display height in px
**type** | `"toggle"`,`"kick"`,`"radio"` | `"toggle"` | Switch type. `"toggle"` switch has so-called 'checkbox' function. `"radio"` switch is a radio-button and the `"kick"` switch is a general command button
**group** | string | `null` | Group id string used if the 'type' is `"radio"`. Only one switch will be set to `"1"` in same group
**tooltip** | string | `null` | Tooltip text that will be shown when mouse hover a while
**enable** | `0`,`1` | `1` | Enable control with the pointing device.

### webaudio-param

Attribute  | Options      | Default          | Description
---        | ---                  | ---                 | ---
**src** | string | Black rectangle if not specified | url of the background image. Transparent if set to `""`
**value** | float | `0` | The current value. Usually same as linked control
**width** | int | `32` | Parameter display width in px
**height** | int | `16` | Parameter display height in px
**fontsize** | int | `9` | Font-size of the parameter display
**color** | string | `"#ffffff"` | Text color
**link** | string | `null` | Specify the linked webaudio-knob/slider/switch by Id

### webaudio-keyboard

Attribute  | Options      | Default          | Description
---        | ---                  | ---                 | ---
**values** | int array | `[]` | The array of current pressed key numbers. "values" may has more than one element in multi-touch environment.
**width** | int | `480` | Keyboard display width in px
**height** | int | `128` | Keyboard display height in px
**min** | int | `0` | Lowest Key number. Each key is numbered incrementally from this number. If the "min" is not `0` and the modulo 12 is not zero, the keyboard is started from corresponding position (not-C). Note that the specified key should be a 'white-key'.
**keys** | int | `25` | Number of keys. `25` means 25 keys keyboard.
**colors** | string | '#222; #eee;#ccc; #333;#000; #e88;#c44; #c33;#800' | semicolon separated 9 keyboard colors. 'border; whitekey-grad-from;whitekey-grad-to; blackkey-grad-from;blackkey-grad-to; active-whitekey-grad-from;active-whitekey-grad-to; active-blackkey-grad-from;active-blackkey-grad-to'. Each key surface can has garadient left to right with 'from' and 'to'.
**enable** | `0`,`1` | `1` | Enable control with the pointing device.

---
## Functions
### setValue(value, fire)  
`webaudio-knob` | `webaudio-slider` | `webaudio-switch`  
**description**: Each control can be setup and redraw by calling this function from JavaScript.
If the `fire` parameter is `undefined` or `false`, this function will not fire `'change'` event. Or the `change` event will be fired.


### setNote(state,note)  
`webaudio-keyboard`  
**description**: webaudio-keyboard can be setup pressing state with this function from JavaScript. corresponding key specified by the `note` is pressed if the `state` is non-zero otherwise the key is released. This function will NOT fire the 'change' event.

---
## Events
### 'change'  
`webaudio-knob` | `webaudio-slider` | `webaudio-switch` | `webaudio-keyboard`  
**description**: 'change' event is emitted everytime value changes by user action or setValue() function with fire flag is `true`. In the event handler of `webaudio-knob`,`webaudio-slider` or `webaudio-switch`, current value can be get with referring `event.target.value`.  

```
var knobs = document.getElementsByTagName('webaudio-knob');
for (var i = 0; i < knobs.length; i++) {
  var knob = knobs[i];
  knob.addEventListener('change', function(e) {
    console.log(e.target.value);
  });
}
```

For the `webaudio-keyboard`, each 'change' event has the property '.note' that contain a array `[key-state, key-number]`. For example `event.note = [1, 60]` if the key#60 is on, or `event.note = [0, 60]` if the key#60 is off.

```
var keyboard = document.getElementsById('keyboard');
keyboard.addEventListener('change', function(e) {
	if(e.note[0])
		console.log("Note-On:"+e.note[1]);
	else
		console.log("Note-Off:"+e.note[1]);
});
```

**Note**: The addEventListener() function is recommended for event handler setup instead of 'onchange=' attribute. 'onchange=' attribute seems not work on Safari.

### 'click'  
`webaudio-switch (kick)`  
**description**: 'click' event is emitted if the 'kick' type webaudio-switch has clicked.

---
## Creating knob images
webaudio-knob (with sprites is `0` (default)) use a single frame knob image that indicate center position.
For example,  
![](img/testknob.png)  
This image will be rotated from -135deg to +135deg. This approach will works well if the image is flat designed, but more complex animation (for example, drop-shadowed, highlighted or something elastic) will need pre-rendered frame-by-frame animation as below.

webaudio-knob (with non zero "sprites") use a vertical 'stitched' multi-frames animation image, and webaudio-switch use a vertical 'stitched' two-frames animation image.
For example,   
![](https://raw.github.com/g200kg/webaudio-controls/master/img/LittlePhatty_sample.png)
![](https://raw.github.com/g200kg/webaudio-controls/master/img/switch_toggle.png)  

This knob example has only 5 frames but it should has more frames for smooth animation. I recommend to use JKnobMan/WebKnobMan for making these stitched images,

- [JKnobMan](http://www.g200kg.com/en/software/knobman.html) -- Java based Knob image creation tool.
- [WebKnobMan](http://www.g200kg.com/en/webknobman/) -- WebApp version of the JknobMan
- [KnobGallery](http://www.g200kg.com/en/webknobman/gallery.php) -- knob data sharing space

---

Here is a brief instruction  to export knob-image from KnobGallery

- Go to [KnobGallery](http://www.g200kg.com/en/webknobman/gallery.php)
- Find your favorite knob design and click 'Open with WebKnobMan'
- Click on 'Export' to download `png` file
- Of course, you can create your own!

**Note: comply with license requirements**

---
## License
WebAudio-Controls is developped based on:  
- [WebAudio-Knob](https://github.com/agektmr/webaudio-knob) by [Eiji Kitamura](http://google.com/+agektmr)  
- [WebAudio-Slider](https://github.com/ryoyakawai/webaudio-slider) by [Ryoya KAWAI](https://plus.google.com/108242669191458983485/posts)  
- [WebAudio-Switch](http://aikelab.net/switch/) by [Keisuke Ai](http://d.hatena.ne.jp/aike/)  
Integrated and enhanced by [g200kg](http://www.g200kg.com/)

Copyright (c) 2013 Eiji Kitamura / Ryoya KAWAI / Keisuke Ai / g200kg (Tatsuya Shinyagaito)  
Licensed under the Apache License, Version 2.0

---
Knob/Switch images in samples are from [Knob Gallery](http://www.g200kg.com/en/webknobman/gallery.php)  
[switch_toggle.knob](http://www.g200kg.com/en/webknobman/gallery.php?m=p&p=58) by [az](http://bji.yukihotaru.com/) (c) 2011 [CC-BY](http://creativecommons.org/licenses/by/3.0/)
