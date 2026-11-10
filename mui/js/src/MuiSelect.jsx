import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { fire, useBox, useSynced, writeModel } from './ewc.js';

// Items and SelItems as for a native Combo: SelItems is a boolean per item, and
// Select reports the chosen item and its 1-based index.
export default function MuiSelect({ data, ewc }) {
  const { Items, SelItems, Label, Active } = data.Properties;
  const items = Items || [];
  const [index, setIndex] = useSynced((SelItems || []).indexOf(1));
  const labelId = `${data.ID}-label`;

  return (
    <div {...useBox(data, ewc)}>
      <FormControl fullWidth size="small" disabled={Active === 0}>
        <InputLabel id={labelId}>{Label}</InputLabel>
        <Select
          labelId={labelId}
          label={Label}
          value={index < 0 ? '' : index}
          onChange={(e) => {
            const i = e.target.value;
            setIndex(i);
            writeModel(ewc, data, { SelItems: items.map((_, j) => (j === i ? 1 : 0)) });
            fire(ewc, data, 'Select', [items[i], i + 1]);
          }}
        >
          {items.map((item, i) => (
            <MenuItem key={i} value={i}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
