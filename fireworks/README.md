# fireworks

A fireworks overlay for [EWC](https://github.com/Dyalog/ewc), delivered as a
plugin. It's intended to be extremely simple as a demo plugin - the smallest
complete example of the plugin contract.

## Using it

```apl
      ]link.create ~/dev/ewc/EWC
      ]link.create FireworksPlugin ~/dev/ewc-plugins/fireworks/APLSource
      FireworksPlugin.Register
      EWC.Init 'Browser'
```

`Register` may be called before or after `Init`. After `Init`, `Fireworks` is an
EWC class like any other.

```apl
      'F1.FW' eWC 'Fireworks'
      'F1.FW' eWS 'Running' 0
      'F1.FW' eWS 'Running' 1
```

The overlay covers the whole page and ignores the mouse, so the application
stays usable underneath.

## JavaScript injection

There is no build step. `assets/fireworks.js` is a hand-written ES module,
served by EWC itself at `/fireworks/fireworks.js`.
The first time a `Fireworks` object is created, EWC runs `Inject` from `APLSource`

The fireworks engine is [fireworks-js](https://github.com/crashmax-dev/fireworks-js),
fetched from a CDN the first time fireworks is run.

## Layout

```
APLSource/                     ← the package
  Register.aplf                builds the plugin namespace, calls EWC.RegisterPlugin
  Inject.aplf                  the loader EWC evaluates in the client
  Folder.aplf                  locates this package on disk
  classes/Fireworks/*.apla     the EWC class definition

assets/
  fireworks.js                 the component; served at /fireworks/

app/                           the demo app
  Start.aplf                   registers the plugin and starts EWC in the given mode
  Initialise.aplf              EWC calls this per browser connection
  CBStart.aplf CBStop.aplf     the two buttons

run.sh                         launch the demo app
```

## Running the demo app

```bash
EWC=/path/to/ewc ./run.sh
```

then open <http://localhost:22322/>. Or from a Dyalog session, which is the
more useful form while developing:

```apl
      ]link.create ~/dev/ewc/EWC
      ]link.create FireworksPlugin ~/dev/ewc-plugins/fireworks/APLSource
      ]link.create FireworksApp    ~/dev/ewc-plugins/fireworks/app
      FireworksApp.Start 'Browser'
```

`FireworksApp.Start 'Multi'` gives every browser its own independent copy.
