import { useRef } from 'react';
import TextField from '@mui/material/TextField';
import { fire, useBox, useSynced, writeModel } from './ewc.js';

// Change fires on blur, and only if the text differs from what it was on
// focus - the same contract as a native Edit.
export default function MuiTextField({ data, ewc }) {
  const { Text, Label, Variant, HelperText, Active } = data.Properties;
  const [text, setText] = useSynced(Text ?? '');
  const onFocus = useRef(text);

  return (
    <div {...useBox(data, ewc)}>
      <TextField
        fullWidth
        size="small"
        label={Label}
        variant={Variant || 'outlined'}
        helperText={HelperText || undefined}
        disabled={Active === 0}
        value={text}
        onFocus={() => (onFocus.current = text)}
        onChange={(e) => {
          setText(e.target.value);
          writeModel(ewc, data, { Text: e.target.value });
        }}
        onBlur={() => {
          if (text !== onFocus.current) fire(ewc, data, 'Change', [text]);
        }}
      />
    </div>
  );
}
