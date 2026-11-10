import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useBox } from './ewc.js';

// A container. Children are ordinary EWC objects, rendered after the card so
// they sit above it, and positioned against the outer box like any child of a
// Group.
export default function MuiCard({ data, ewc }) {
  const { Title, Elevation } = data.Properties;
  const children = ewc.utils.excludeKeys(data);
  const { SelectComponent } = ewc;

  return (
    <div {...useBox(data, ewc)}>
      <Card elevation={Elevation ?? 1} sx={{ width: '100%', height: '100%' }}>
        {Title && <CardHeader title={Title} />}
      </Card>
      {Object.keys(children).map((key) => (
        <SelectComponent key={key} data={children[key]} />
      ))}
    </div>
  );
}
