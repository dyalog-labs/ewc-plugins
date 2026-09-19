# kendo

Kendo UI components — chart, grid, Sankey — for
[EWC](https://github.com/Dyalog/ewc), delivered as a plugin.

It is an example of writing a connector between EWC and a _proprietary_
external library.

## Using it

```apl
      ]link.create ~/dev/ewc/EWC
      ]link.create KendoPlugin ~/dev/ewc-plugins/kendo/APLSource
      KendoPlugin.Register
      EWC.Init 'Browser'
```

`Register` may be called before or after `Init`.

```apl
      'F1.BAR' eWC 'KendoChart' (50 10)(540 780) series 'bar'
```

## Prerequisite: a Kendo licence

Kendo UI is a commercial Progress product. Activation is an explicit step, not
something `npm run build` does for you:

```bash
cd js
cp /path/to/your/key kendo-ui-license.txt
npx kendo-ui-license activate
npm run build
```

`KENDO_UI_LICENSE=<key> npx kendo-ui-license activate` works too. Note the file
belongs in `js/`, where the build runs — not the plugin root.

Without a valid key Kendo still renders, with a warning banner.

## Building the bundle

```bash
cd js
npm install
npm run build
```

## Licensing

The code in this plugin is MIT (see the repository's `LICENSE`). It distributes no
Kendo code.

## Running the demo app

```bash
EWC=/path/to/ewc ./run.sh
```

then open <http://localhost:22322/>

Or from Dyalog:

```apl
      ]link.create ~/dev/ewc/EWC
      ]link.create KendoPlugin ~/dev/ewc-plugins/kendo/APLSource
      ]link.create KendoApp    ~/dev/ewc-plugins/kendo/app
      KendoApp.Run
```
