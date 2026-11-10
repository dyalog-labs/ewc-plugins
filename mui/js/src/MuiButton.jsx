import Button from '@mui/material/Button';
import { fire, useBox } from './ewc.js';

export default function MuiButton({ data, ewc }) {
  const { Caption, Variant, Color, Active } = data.Properties;
  return (
    <div {...useBox(data, ewc)}>
      <Button
        sx={{ width: '100%', height: '100%' }}
        variant={Variant || 'contained'}
        color={Color || 'primary'}
        disabled={Active === 0}
        onClick={() => fire(ewc, data, 'Select')}
      >
        {Caption}
      </Button>
    </div>
  );
}
