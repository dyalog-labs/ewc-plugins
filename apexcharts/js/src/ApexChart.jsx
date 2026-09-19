// Required: the build uses the classic JSX runtime, so JSX below compiles to
// React.createElement. `react` is aliased to src/react-shim.js, which re-exports
// the EWC client's own instance. Editors that don't read vite.config.mjs will
// report this import as unused — it is not.
import React from 'react';
import ReactApexChart from 'react-apexcharts';

export default function ApexChart({ data, ewc }) {
  const { Options, Posn, Series, Size, ChartType, Event, CSS } = data?.Properties;
  const { socket } = ewc;
  const customStyles = ewc.utils.parseFlexStyles(CSS);
  const styles = ewc.utils.setStyle(data?.Properties);

  const sendEvent = (event, chartContext, config, chartConfig) => {
    // ApexCharts reports indices as strings for some click targets; APL
    // arithmetic wants numbers. -1 is ApexCharts' own "no datapoint".
    const num = (v) => (v == null || v === '' || isNaN(v) ? -1 : Number(v));
    const obj = {
      dataPointIndex: num(chartConfig?.dataPointIndex),
      seriesIndex: num(chartConfig?.seriesIndex),
      series: chartConfig?.config?.series,
      xaxis: chartConfig?.config?.xaxis,
      yaxis: chartConfig?.config?.yaxis,
    };
    socket.send(
      JSON.stringify({
        Event: { ID: data?.ID, EventName: event, Info: [JSON.stringify(obj)] },
      })
    );
  };

  const options = {
    ...Options,
    chart: {
      // ...Options?.chart so an application's chart options (animations, type)
      // survive the event wiring
      ...Options?.chart,
      events: {
        ...(Event?.some((item) => item[0] === 'click') && {
          click: (chartContext, config, chartConfig) =>
            sendEvent('click', chartContext, config, chartConfig),
        }),
        ...(Event?.some((item) => item[0] === 'legendclick') && {
          legendClick: (chartContext, config, chartConfig) =>
            sendEvent('legendclick', chartContext, config, chartConfig),
        }),
      },
    },
  };

  return (
    <div
      id={data.ID}
      style={{
        position: 'absolute',
        top: Posn && Posn[0],
        left: Posn && Posn[1],
        ...styles,
        ...customStyles,
      }}
    >
      <ReactApexChart
        // Changing type on a live ApexCharts instance crashes inside its
        // update path; keying by type remounts instead.
        key={ChartType || 'line'}
        options={options}
        width={Size && Size[1]}
        height={Size && Size[0]}
        type={ChartType}
        series={Series}
      />
    </div>
  );
}
