import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { fire, useBox, useSynced, writeModel } from './ewc.js';

export default function MuiSwitch({ data, ewc }) {
  const { Caption, State, Active } = data.Properties;
  const [on, setOn] = useSynced(State === 1);

  return (
    <div {...useBox(data, ewc)}>
      <FormControlLabel
        label={Caption}
        disabled={Active === 0}
        control={
          <Switch
            checked={on}
            onChange={(e) => {
              const state = e.target.checked ? 1 : 0;
              setOn(state === 1);
              writeModel(ewc, data, { State: state });
              fire(ewc, data, 'Select', [state]);
            }}
          />
        }
      />
    </div>
  );
}
