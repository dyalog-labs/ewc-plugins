import ApexChart from './ApexChart.jsx';

/**
 * Entry point, called by the loader EWC injects (see APLSource/Inject.aplf).
 *
 * Returns a status string: the result is JSON-encoded back to APL, so a module
 * or a component would arrive as null.
 */

// SVG is a Dynamic property: its value lives in the browser. Serialize the
// rendered chart straight from the DOM at ⎕WG time, so it is always current.
function WG(wsSend, serverEvent, refData) {
  const svg =
    document
      .getElementById(serverEvent.ID)
      ?.querySelector('svg.apexcharts-svg')?.outerHTML ?? '';
  wsSend({
    WG: {
      ID: serverEvent.ID,
      Properties: { SVG: svg },
      WGID: serverEvent.WGID,
    },
  });
}

export function register(EWC) {
  EWC.registerComponent('XApexChart', { component: ApexChart, WG });
  return 'ewc-apexcharts: XApexChart registered';
}
