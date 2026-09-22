// See KendoChart.jsx for why this import is required despite looking unused.
import React, { useState } from 'react';
import { filterBy, orderBy } from '@progress/kendo-data-query';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';

// APL sends pairs, not objects.
const pairsToObject = (pairs) =>
  Object.fromEntries((pairs || []).map((p) => [p[0], p[1]]));

export default function KendoGrid({ data, ewc }) {
  const { ColTitles, Values, Options, Event } = data.Properties;

  // Unset, the Options default arrives as an empty array rather than an object.
  const opts = Options && !Array.isArray(Options) ? Options : {};

  const titles = ColTitles || [];
  const rows = (Values || []).map((row) => {
    const o = {};
    titles.forEach((ct, i) => {
      o[ct] = row[i];
    });
    return o;
  });

  const [filter, setFilter] = useState({ logic: 'and', filters: [] });
  const [sort, setSort] = useState([]);

  const columnTypes = pairsToObject(opts.columnTypes);
  const filterableCols = pairsToObject(opts.filterableCols);
  const sortableCols = opts.sortableCols || [];

  const fire = (value) => {
    if (!(Event || []).some((ev) => ev[0] === 'Select')) return;
    ewc.socket.send(
      JSON.stringify({ Event: { EventName: 'Select', ID: data.ID, Info: [value] } })
    );
  };

  // Assets are resolved through ewc.url: the EWC server is not always the
  // page's own origin.
  const ImageCell = (p) =>
    p.dataItem[p.field] ? (
      <td>
        <img src={ewc.url(p.dataItem[p.field])} alt="" />
      </td>
    ) : (
      <td />
    );

  const VideoCell = (p) =>
    p.dataItem[p.field] ? (
      <td>
        <video controls>
          <source src={ewc.url(p.dataItem[p.field])} type="video/mp4" />
        </video>
      </td>
    ) : (
      <td />
    );

  const ButtonCell = (p) => (
    <td>
      <Button onClick={() => fire(p.dataItem[p.field])}>{p.dataItem[p.field]}</Button>
    </td>
  );

  const cells = { Image: ImageCell, Video: VideoCell, Button: ButtonCell };

  return (
    <div id={data.ID} style={ewc.utils.setStyle(data.Properties)}>
      <Grid
        style={{ width: '100%', height: '100%' }}
        data={orderBy(filterBy(rows, filter), sort)}
        navigatable
        filterable={opts.filterable == 1}
        filter={filter}
        onFilterChange={(e) => setFilter(e.filter)}
        sortable={opts.sortable == 1 ? { allowUnsort: true, mode: 'multiple' } : undefined}
        sort={sort}
        onSortChange={(e) => setSort(e.sort)}
      >
        {titles.map((ct) => (
          <GridColumn
            key={ct}
            field={ct}
            title={ct}
            cells={{ data: cells[columnTypes[ct]] }}
            filterable={Object.prototype.hasOwnProperty.call(filterableCols, ct)}
            filter={filterableCols[ct] === '' ? undefined : filterableCols[ct]}
            sortable={sortableCols.includes(ct)}
          />
        ))}
      </Grid>
    </div>
  );
}
