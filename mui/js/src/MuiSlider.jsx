import Slider from '@mui/material/Slider';
import { fire, useBox, useSynced, writeModel } from './ewc.js';

// The model follows the thumb while it drags; Scroll fires once, on release.
export default function MuiSlider({ data, ewc }) {
  const { Value, Limits, Step, Active } = data.Properties;
  const [min, max] = Limits?.length === 2 ? Limits : [0, 100];
  const [value, setValue] = useSynced(Value ?? min);

  return (
    <div {...useBox(data, ewc)}>
      <Slider
        min={min}
        max={max}
        step={Step || 1}
        valueLabelDisplay="auto"
        disabled={Active === 0}
        value={value}
        onChange={(e, v) => {
          setValue(v);
          writeModel(ewc, data, { Value: v });
        }}
        onChangeCommitted={(e, v) => fire(ewc, data, 'Scroll', [v])}
      />
    </div>
  );
}
