// Required: the build uses the classic JSX runtime, so JSX below compiles to
// React.createElement. `react` is aliased to src/react-shim.js, which re-exports
// the EWC client's own instance. Editors that don't read vite.config.mjs will
// report this import as unused — it is not.
import React from 'react';
import { Chart, ChartSeries, ChartSeriesItem } from '@progress/kendo-react-charts';

const COLORS = ['#ff6358', '#ffd246', '#78d237', '#28b4c8', '#2d73f5', '#aa46be'];

export default function KendoChart({ data, ewc }) {
  const { Series, ChartType, Event } = data.Properties;

  // Only send events the application actually registered a callback for.
  const fire = (name) => (e) => {
    if (!(Event || []).some((ev) => ev[0] === name)) return;
    ewc.socket.send(
      JSON.stringify({
        Event: {
          EventName: name,
          ID: data.ID,
          Info: [e?.category ?? '', e?.value ?? 0],
        },
      })
    );
  };

  // The id must be on the outermost element: ⎕WG of Size and Posn measures it.
  return (
    <div id={data.ID} style={ewc.utils.setStyle(data.Properties)}>
      <Chart
        style={{ width: '100%', height: '100%' }}
        seriesColors={COLORS}
        pannable
        zoomable
        onSeriesClick={fire('click')}
        onLegendItemClick={fire('legendclick')}
      >
        <ChartSeries>
          {(Series || []).map((s, i) => (
            <ChartSeriesItem
              key={i}
              data={s.data}
              type={ChartType || 'line'}
              name={`series-${i}`}
            />
          ))}
        </ChartSeries>
      </Chart>
    </div>
  );
}
