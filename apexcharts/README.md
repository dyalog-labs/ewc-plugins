# apexcharts

[ApexCharts](https://apexcharts.com/) for [EWC](https://github.com/Dyalog/ewc),
delivered as a plugin.

## Using it

```apl
      ]link.create ~/dev/ewc/EWC
      ]link.create ApexChartsPlugin ~/dev/ewc-plugins/apexcharts/APLSource
      ApexChartsPlugin.Register
      EWC.Init 'Browser'
```

`Register` may be called before or after `Init`.

```apl
      'F1.CHART' eWC 'XApexChart' (50 10)(540 780) series 'bar'
      'F1.CHART' eWS 'Series' (?2 10⍴100)
      svg ← 'F1.CHART' eWG 'SVG'
```

The class is `XApexChart` for now: EWC core still ships its own `ApexChart`,
and a plugin class cannot shadow a core one. It takes the `ApexChart` name
when core drops the built-in class.

`Series` accepts numeric vectors and matrices, `(yvalues name xvalues [type])`
triplets, namespaces, or JSON. `Options` is any ApexCharts options object, as a
namespace or a JSON5 string. `SVG` reads back the rendered chart.

## Building the bundle

```bash
cd js
npm install
npm run build
```

## Licensing

The code in this plugin is MIT (see the repository's `LICENSE`). It distributes
no ApexCharts code: `npm install` fetches the `apexcharts` and
`react-apexcharts` packages directly from npm, under ApexCharts' own licence
terms - which restrict use by larger organisations. Check those terms apply to
you before building.

## Running the demo app

```bash
EWC=/path/to/ewc ./run.sh
```

then open <http://localhost:22322/>.

Or from Dyalog:

```apl
      ]link.create ~/dev/ewc/EWC
      ]link.create ApexChartsPlugin ~/dev/ewc-plugins/apexcharts/APLSource
      ]link.create ApexApp         ~/dev/ewc-plugins/apexcharts/app
      ApexApp.Run
```
