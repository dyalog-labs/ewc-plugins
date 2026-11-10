# mui

[Material UI](https://mui.com/material-ui/) components for
[EWC](https://github.com/Dyalog/ewc), delivered as a plugin:
`MuiButton`, `MuiTextField`, `MuiSwitch`, `MuiSlider`, `MuiSelect` and `MuiCard`.

Unlike the chart plugins, these are input controls: what the user changes is
written back to the client's data model, so `⎕WG` of the listed properties
answers what is on screen, and `⎕WS` updates them from APL.

## Using it

```apl
      ]link.create ~/dev/ewc/EWC
      ]link.create MuiPlugin ~/dev/ewc-plugins/mui/APLSource
      MuiPlugin.Register
      EWC.Init 'Browser'
```

```apl
      'F1.B'eWC'MuiButton' 'Save'(10 10)(36 120)('Event' 'Select' 'CBSave')
      'F1.T'eWC'MuiTextField' 'Hello'(60 10)(56 200)('Label' 'Name')
      'F1.T'eWG'Text'
```

| Class | Properties | Live for ⎕WG | Event (Info) |
|---|---|---|---|
| MuiButton | Caption Variant Color Active | | Select |
| MuiTextField | Text Label Variant HelperText Active | Text | Change (text) - on blur, if changed |
| MuiSwitch | Caption State Active | State | Select (state) |
| MuiSlider | Value Limits Step Active | Value | Scroll (value) - on release |
| MuiSelect | Items SelItems Label Active | SelItems | Select (item, 1-based index) |
| MuiCard | Title Elevation | | - |

All take `Posn` and `Size`. `MuiCard` is a container: its children are
ordinary EWC objects. `Variant` and `Color` take MUI's own values
(`'contained' 'outlined' 'text'`, `'primary' 'secondary'`, ...).

## Building the bundle

```bash
cd js
npm install --legacy-peer-deps
npm run build
```

`--legacy-peer-deps` keeps npm from installing React: the bundle renders with
the EWC client's own React, and `react`, `react/jsx-runtime` and `react-dom` are
all aliased to small shims in `js/src` (see `vite.config.mjs` for why).

## Licensing

The code in this plugin is MIT (see the repository's `LICENSE`), as is MUI's
core. The built bundle is not committed, as for the other plugins.

## Running the demo app

```bash
EWC=/path/to/ewc ./run.sh
```

then open <http://localhost:22322/>
