// See KendoChart.jsx for why this import is required despite looking unused.
import React from 'react';
import { Sankey } from '@progress/kendo-react-charts';

export default function KendoSankey({ data, ewc }) {
  const { Links, Event } = data.Properties;
  const rows = Links || [];

  const ids = [];
  rows.forEach((row) => {
    [row[0], row[1]].forEach((x) => {
      if (!ids.includes(x)) ids.push(x);
    });
  });

  const sankeyData = {
    nodes: ids.map((id) => ({ id, label: { text: String(id) } })),
    links: rows.map((row) => ({ sourceId: row[0], targetId: row[1], value: row[2] })),
  };

  const fire = (name) => (e) => {
    if (!(Event || []).some((ev) => ev[0] === name)) return;
    const d = e && e.dataItem ? e.dataItem : {};
    ewc.socket.send(
      JSON.stringify({
        Event: {
          EventName: name,
          ID: data.ID,
          Info: [String(d.id != null ? d.id : `${d.sourceId} → ${d.targetId}`), d.value || 0],
        },
      })
    );
  };

  return (
    <div id={data.ID} style={ewc.utils.setStyle(data.Properties)}>
      <Sankey
        style={{ width: '100%', height: '100%' }}
        data={sankeyData}
        onNodeClick={fire('NodeClick')}
        onLinkClick={fire('LinkClick')}
      />
    </div>
  );
}
