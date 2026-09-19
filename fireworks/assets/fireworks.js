// The client half of the Fireworks plugin: a full-page overlay driven by the
// `Running` property of the `Fireworks` EWC class.
//
// This file is served by EWC itself - Register.aplf mounts assets/ at
// /fireworks/, and Inject.aplf imports this module the first time a Fireworks
// object is created. The fireworks engine (fireworks-js) is fetched from a CDN
// on first use: how a plugin's JavaScript arrives is the plugin's choice, and
// mixing own code with a CDN library is fine.

const ENGINE_URL = 'https://unpkg.com/fireworks-js@2.x/dist/index.umd.js';

let engine; // promise for the CDN script, created on first use

function loadEngine() {
  engine ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = ENGINE_URL;
    script.onload = () => resolve(window.Fireworks);
    script.onerror = () => {
      engine = undefined; // allow a retry on the next mount
      reject(new Error(`ewc-fireworks: failed to load ${ENGINE_URL}`));
    };
    document.head.appendChild(script);
  });
  return engine;
}

/**
 * Entry point, called by the loader EWC injects (see APLSource/Inject.aplf).
 *
 * Returns a status string: the result is JSON-encoded back to APL, so a module
 * or a component would arrive as null.
 *
 * The component is built on the client's own React instance (EWC.React). A
 * plugin must never bundle a second React - its hooks would then run on a
 * different dispatcher to the app rendering the component.
 */
export function register(EWC) {
  const React = EWC.React;

  function Fireworks({ data }) {
    const containerRef = React.useRef(null);
    const fwRef = React.useRef(null);
    const running = data.Properties.Running !== 0;

    // The engine arrives asynchronously, so keep the latest wish in a ref and
    // apply it once the instance exists.
    const wantedRef = React.useRef(running);
    wantedRef.current = running;

    React.useEffect(() => {
      let disposed = false;
      loadEngine()
        .then((Engine) => {
          if (disposed) return;
          fwRef.current = new Engine.default(containerRef.current);
          if (wantedRef.current) fwRef.current.start();
        })
        .catch((e) => console.error(String(e)));
      return () => {
        disposed = true;
        if (fwRef.current) {
          fwRef.current.stop(true);
          fwRef.current = null;
        }
      };
    }, []);

    React.useEffect(() => {
      const fw = fwRef.current;
      if (!fw) return; // not loaded yet - wantedRef is applied on load
      if (running) fw.start();
      else fw.stop(true);
    }, [running]);

    // A fixed full-page overlay; pointer-events: none keeps the application
    // clickable underneath.
    return React.createElement('div', {
      id: data.ID,
      ref: containerRef,
      style: { position: 'fixed', inset: 0, zIndex: 99, pointerEvents: 'none' },
    });
  }

  EWC.registerComponent('Fireworks', Fireworks);
  return 'ewc-fireworks: Fireworks registered';
}
