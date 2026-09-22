// The client half of the Globe plugin: a 3D choropleth globe driven by the
// `Values` property of the `Globe` EWC class - pairs of (ISO-3166 alpha-3 code,
// value), coloured green→red by value.
//
// This file is served by EWC itself at /globe/globe.js. Everything third-party
// arrives from CDNs at runtime: the globe.gl bundle (which includes three.js),
// an earth texture, and the country polygons. Nothing is vendored.

const ENGINE_URL = 'https://unpkg.com/globe.gl';
const TEXTURE_URL = 'https://unpkg.com/three-globe/example/img/earth-dark.jpg';
const COUNTRIES_URL =
  'https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson';

let engine; // promise for the CDN script, created on first use
let countries; // promise for the country polygons

function loadEngine() {
  engine ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = ENGINE_URL;
    script.onload = () => resolve(window.Globe);
    script.onerror = () => {
      engine = undefined; // allow a retry on the next mount
      reject(new Error(`ewc-globe: failed to load ${ENGINE_URL}`));
    };
    document.head.appendChild(script);
  });
  return engine;
}

function loadCountries() {
  countries ??= fetch(COUNTRIES_URL).then((r) => r.json());
  return countries;
}

export function register(EWC) {
  const React = EWC.React;

  function GlobeChart({ data, ewc }) {
    const { Posn, Size, Values, Event } = data?.Properties;
    const styles = ewc.utils.setStyle(data?.Properties);

    const nodeRef = React.useRef(null);
    const globeRef = React.useRef(null);

    // Values arrives as rows of (code value); accessors read the latest
    // through a ref so a ⎕WS of Values needs no re-mount.
    const valuesRef = React.useRef(new Map());
    valuesRef.current = new Map((Values || []).map(([c, v]) => [c, v]));
    const max = Math.max(1, ...valuesRef.current.values());
    const maxRef = React.useRef(max);
    maxRef.current = max;

    // Natural Earth marks a few countries (France, Norway) ISO_A3 = "-99"
    const iso = (f) =>
      f.properties.ISO_A3 === '-99' ? f.properties.ADM0_A3 : f.properties.ISO_A3;

    const capColor = (f) => {
      const v = valuesRef.current.get(iso(f));
      if (v == null) return 'rgba(100,100,100,0.55)';
      return `hsl(${Math.round(120 - (120 * v) / maxRef.current)},70%,45%)`;
    };
    const label = (f) =>
      `<b>${f.properties.ADMIN}</b>: ${valuesRef.current.get(iso(f)) ?? 'no data'}`;

    React.useEffect(() => {
      let disposed = false;
      Promise.all([loadEngine(), loadCountries()])
        .then(([Globe, geo]) => {
          if (disposed) return;
          const feats = geo.features.filter((f) => f.properties.ISO_A2 !== 'AQ');
          const g = Globe()(nodeRef.current)
            .width(Size?.[1] ?? 600)
            .height(Size?.[0] ?? 400)
            .globeImageUrl(TEXTURE_URL)
            .polygonsData(feats)
            .polygonAltitude(0.01)
            .polygonCapColor(capColor)
            .polygonSideColor(() => 'rgba(0,60,60,0.3)')
            .polygonStrokeColor(() => '#111')
            .polygonLabel(label)
            .polygonsTransitionDuration(300);
          g.onPolygonHover((h) => g.polygonAltitude((f) => (f === h ? 0.06 : 0.01)));
          if ((Event || []).some((e) => e[0] === 'click')) {
            g.onPolygonClick((f) =>
              ewc.socket.send(
                JSON.stringify({
                  Event: {
                    EventName: 'click',
                    ID: data.ID,
                    Info: [
                      iso(f),
                      f.properties.ADMIN,
                      valuesRef.current.get(iso(f)) ?? 0,
                    ],
                  },
                })
              )
            );
          }
          g.controls().autoRotate = true;
          g.controls().autoRotateSpeed = 1.2;
          globeRef.current = g;
        })
        .catch((e) => console.error(String(e)));
      return () => {
        disposed = true;
        globeRef.current?._destructor?.();
        globeRef.current = null;
      };
    }, []);

    // A ⎕WS of Values recolours in place: re-setting the accessors makes
    // globe.gl re-evaluate them against the new values.
    React.useEffect(() => {
      const g = globeRef.current;
      if (!g) return;
      g.polygonCapColor(capColor).polygonLabel(label);
    }, [Values]);

    return React.createElement('div', {
      id: data.ID,
      ref: nodeRef,
      style: {
        position: 'absolute',
        top: Posn && Posn[0],
        left: Posn && Posn[1],
        overflow: 'hidden',
        ...styles,
      },
    });
  }

  EWC.registerComponent('Globe', GlobeChart);
  return 'ewc-globe: Globe registered';
}
