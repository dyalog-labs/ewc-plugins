import { createTheme, ThemeProvider } from '@mui/material/styles';

import MuiButton from './MuiButton.jsx';
import MuiCard from './MuiCard.jsx';
import MuiSelect from './MuiSelect.jsx';
import MuiSlider from './MuiSlider.jsx';
import MuiSwitch from './MuiSwitch.jsx';
import MuiTextField from './MuiTextField.jsx';

const classes = { MuiButton, MuiCard, MuiSelect, MuiSlider, MuiSwitch, MuiTextField };

// No CssBaseline: it resets the whole page, which would restyle EWC's own
// components too. Each class gets the theme through its own provider instead.
const theme = createTheme();

const themed = (Component) =>
  function Themed(props) {
    return (
      <ThemeProvider theme={theme}>
        <Component {...props} />
      </ThemeProvider>
    );
  };

// ⎕WG reply straight from the data model. The client's generic reply treats a
// falsy value as missing, so a State or Value of 0 would come back as ⍬.
const WG = (send, serverEvent, refData) =>
  send({
    WG: {
      ID: serverEvent.ID,
      WGID: serverEvent.WGID,
      Properties: Object.fromEntries(
        serverEvent.Properties.map((p) => [p, refData.Properties[p] ?? []])
      ),
    },
  });

// Entry point, called by the loader EWC injects (see APLSource/Inject.aplf).
// Returns a status string: the result is JSON-encoded back to APL, so a module
// or a component would arrive as null.
export function register(EWC) {
  for (const [name, Component] of Object.entries(classes)) {
    EWC.registerComponent(name, { component: themed(Component), WG });
  }
  return `ewc-mui: ${Object.keys(classes).join(', ')} registered`;
}
