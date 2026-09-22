# gallery

Every plugin in this repository in one EWC app: a tab per plugin, a link to
its home, and the plugin's own demo underneath.

The gallery is a deliberate hack. It does not carry its own copies of the
demos - at startup `Reroot` reads each demo app's functions, re-roots
their object names under the tab's SubForm, prefixes their names so four
demos can coexist, and `⎕FX`es the results. The demo apps stay exactly as
they are; do not take the gallery as a model for writing applications.

## Running it

```bash
EWC=/path/to/ewc ./run.sh
```

then open <http://localhost:22322/>. The Kendo tab needs its bundle built
first (`cd kendo/js && npm install && npm run build`); the other tabs fetch
their engines from CDNs at runtime.

Or from Dyalog: link everything as `run.sh` does - `EWC`, each plugin's
`APLSource` and `app`, and `gallery/app` as `Gallery` - then
`Gallery.Start 'Browser'` (one user), `Gallery.Start 'Multi'` (a clone per
connection) or `Gallery.Start 'Desktop'` (a native window).

## Docker

The gallery ships as a self-contained container for demos: EWC from its
release zip, the bundles built during the image build, everything served from
inside.

```bash
docker build -t ewc-gallery -f gallery/Dockerfile .   # from the repo root
docker run -p 22322:22322 ewc-gallery
```

then open <http://localhost:22322/>. It runs in Multi mode, so every browser
gets its own independent gallery. Dyalog APL is free for non-commercial use
but is not free software; the Kendo tab renders with a watermark unless you
build its bundle with your own licence.
