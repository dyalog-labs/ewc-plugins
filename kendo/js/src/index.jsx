// Emitted as ../assets/ewc-kendo.css. A library build does not inject its own
// CSS, so register() adds the <link> below.
import '@progress/kendo-theme-default/dist/all.css';

import KendoChart from './KendoChart.jsx';
import KendoGrid from './KendoGrid.jsx';
import KendoSankey from './KendoSankey.jsx';

/**
 * Entry point, called by the loader EWC injects (see APLSource/KendoPlugin/Inject.aplf).
 *
 * Returns a status string: the result is JSON-encoded back to APL, so a module
 * or a component would arrive as null.
 */
export function register(EWC) {
  // Kendo's theme ships as a separate file from the same mounted folder as this
  // bundle. Resolve it through EWC.url for the same reason the bundle itself is
  // loaded that way: the EWC server is not always the page's own origin.
  if (!document.getElementById('ewc-kendo-theme')) {
    const link = document.createElement('link');
    link.id = 'ewc-kendo-theme';
    link.rel = 'stylesheet';
    link.href = EWC.url('/kendo/ewc-kendo.css');
    document.head.appendChild(link);
  }

  EWC.registerComponent('KendoChart', KendoChart);
  EWC.registerComponent('KendoGrid', KendoGrid);
  EWC.registerComponent('KendoSankey', KendoSankey);

  return 'ewc-kendo: KendoChart, KendoGrid, KendoSankey registered';
}
