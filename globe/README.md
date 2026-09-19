# globe

A 3D choropleth globe for [EWC](https://github.com/Dyalog/ewc), built on
[globe.gl](https://globe.gl/) and delivered as a plugin. It is the plugin the
EWC User Guide's plugin tutorial builds, step by step.

## Using it

```apl
      ]link.create ~/dev/ewc/EWC
      ]link.create GlobePlugin ~/dev/ewc-plugins/globe/APLSource
      GlobePlugin.Register
      EWC.Init 'Browser'
```

`Register` may be called before or after `Init`.

```apl
      'F1.G' eWC 'Globe' ('Size' 500 700) ('Values' data) ('Event' 'click' 'CBGlobe')
      'F1.G' eWS 'Values' data
```

`Values` is a matrix of (ISO-3166 alpha-3 code, value) rows. Countries are
coloured green→red by value, hovering raises and labels them, and a click
reports `(code name value)` as an ordinary EWC event.

## How the JavaScript arrives

There is no build step. `assets/globe.js` is a hand-written ES module, served
by EWC itself at `/globe/globe.js` and injected the first time a Globe object
is created. Everything third-party arrives from CDNs at runtime - the globe.gl
bundle (which includes three.js), an earth texture, and the country polygons -
so the plugin needs the network, and nothing is vendored into this repository.

## Running the demo app

```bash
EWC=/path/to/ewc ./run.sh
```

then open <http://localhost:22322/>.

Or from Dyalog:

```apl
      ]link.create ~/dev/ewc/EWC
      ]link.create GlobePlugin ~/dev/ewc-plugins/globe/APLSource
      ]link.create GlobeApp    ~/dev/ewc-plugins/globe/app
      GlobeApp.Run
```

`GlobeApp.RunDesktop` runs the same app in its own native window.
