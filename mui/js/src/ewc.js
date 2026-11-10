// What every MUI class shares in talking to EWC.

import { useEffect, useState } from 'react';

// Props for the outermost element. The id must be there - ⎕WG of Size and Posn
// measures it - and the attach style goes last, as the built-in components do.
export function useBox(data, ewc) {
  const attach = ewc.hooks.useAttachStyle(data);
  return {
    id: data.ID,
    style: { ...ewc.utils.setStyle(data.Properties), ...attach },
  };
}

// Only send events the application registered a callback for.
export function fire(ewc, data, name, info = []) {
  if (!ewc.utils.hasEventCallback(data, name)) return;
  ewc.socket.send(JSON.stringify({ Event: { EventName: name, ID: data.ID, Info: info } }));
}

// Record a user change in the client's data model, so a ⎕WG of a property
// listed in the class's Dynamic.apla answers what the user sees.
export function writeModel(ewc, data, props) {
  ewc.handleData({ ID: data.ID, Properties: props }, 'WS');
}

// State the user changes but the server may also ⎕WS: local for responsiveness,
// reset whenever the property arrives with a new value.
export function useSynced(value) {
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [JSON.stringify(value)]);
  return [v, setV];
}
