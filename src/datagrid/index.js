import React, { useState } from 'react';
import Editable from '../editable';

import './index.css';

function checkColumnsDepth(columns = []) {
  let depth = columns.length ? 1 : 0;
  columns.forEach(col => {
    if (col.items && col.items.length) {
      depth = Math.max(depth, 1 + checkColumnsDepth(col.items));
    }
  });
  return depth;
}

function normalizeColumnConfig(columns) {
  const normalized = [];
  columns.forEach(column => {
    if (typeof column === 'string') {
      normalized.push({ title: column, field: column });
    } else {
      if (column.items && column.items.length) {
        column.items = normalizeColumnConfig(column.items);
      }
      normalized.push({ ...column, field: column.field || column.title });
    }
  });
  return normalized;
}

function buildColSpan(columns = []) {
  columns.forEach(column => {
    if (column.items && column.items.length) {
      buildColSpan(column.items);
      column.colSpan = column.items.reduce((value, item) => value + item.colSpan, 0);
    } else {
      column.colSpan = 1;
    }
  });
}

function buildRowSpan(columns = []) {
  let depth = checkColumnsDepth(columns);
  columns.forEach(column => {
    if (column.items && column.items.length) {
      column.rowSpan = depth - checkColumnsDepth(column.items);
      buildRowSpan(column.items);
    } else {
      column.rowSpan = depth;
    }
  });
}

function getFlattenConfig(columns = []) {
  let config = [];
  columns.forEach(column => {
    if (column.items && column.items.length) {
      config.push.apply(config, getFlattenConfig(column.items));
    } else {
      config.push(column);
    }
  });
  return config;
}

export default function DataGrid({ columns, data, selectable }) {
  columns = normalizeColumnConfig(columns);
  console.log('normalized columns', columns);
  const depth = checkColumnsDepth(columns);
  const gridHeaderConfig = Array(depth).fill(0).map(() => []);
  buildRowSpan(columns);
  buildColSpan(columns);

  function getGridHeaderConfig(columns = [], level) {
    columns.forEach(col => {
      if (col.items && col.items.length) {
        gridHeaderConfig[level - 1].push(col);
        getGridHeaderConfig(col.items, level + 1);
      } else {
        gridHeaderConfig[level - 1].push(col);
      }
    });
  }

  getGridHeaderConfig(columns, 1);
  console.log(gridHeaderConfig);


  let [selected, setSelected] = useState([]);
  let [selectAll, setSelectAll] = useState(false);
  let [sdata, setsData] = useState(data);
  const flattenConfig = getFlattenConfig(columns);
  console.log(flattenConfig);

  function sortBy(field) {
    console.log(field);
    sdata.sort((d1, d2) => {
      if (field.indexOf('.') > -1) {
        field.split('.').forEach(f => {
          d1 = d1 && d1[f];
          d2 = d2 && d2[f];
        });
        console.log(d1, d2);
        return String(d1).localeCompare(String(d2));
      } else {
        return String(d1[field]).localeCompare(String(d2[field]));
      }
    });
    console.log('after sort', sdata);
    setsData([...sdata]);
  }

  function updateValue(rowIndex, field, newVal) {
    var newData = [...sdata];
    if (field.indexOf('.') > -1) {
      let ref = newData[rowIndex];
      let fields = field.split('.');
      let lastF = fields.pop();
      fields.forEach(f => {
        ref = ref[f];
      });
      ref[lastF] = newVal;
    } else {
      newData[field] = newVal;
    }
    setsData(newData);
  }

  console.log(sdata);

  return (<div className="datagrid">
    <table>
      <thead>
        {
          gridHeaderConfig.map((header, i) => {
            return (<tr key={i}>
              {selectable && i === 0 && <td rowSpan={depth}><input type="checkbox" onClick={() => { setSelected([]); setSelectAll(!selectAll) }} /></td>}
              {header.map((col, index) => {
                return <td key={index} rowSpan={col.rowSpan} colSpan={col.colSpan}>
                  {col.sortable ?
                    (<div title={`click to sort by ${col.title}`} onClick={() => sortBy(col.field)}>{col.title}</div>)
                    : col.title}
                </td>
              })}
            </tr>)
          })
        }
      </thead>
      <tbody>
        {
          sdata.map((rowData, i) => {
            return (<tr key={rowData.id || i}>
              {selectable &&
                <td >
                  <input type="checkbox" checked={selectAll || selected.indexOf(i) > -1}
                    onChange={() => {
                      if (selected.indexOf(i) > -1) {
                        selected.splice(selected.indexOf(i), 1);
                      } else {
                        selected.push(i);
                      }
                      setSelected([].concat(selected));
                    }} />
                </td>
              }
              {
                flattenConfig.map((column, j) => {
                  const field = column.field;
                  let colData;
                  if (field.indexOf('.') > -1) {
                    colData = rowData;
                    field.split('.').forEach(f => {
                      colData = colData && colData[f];
                    })
                  } else {
                    colData = rowData[field];
                  }
                  return <td key={j}>{
                    column.editable ? <Editable value={colData} onUpdate={(value) => updateValue(i, column.field, value)}></Editable> : colData
                  }</td>
                })
              }
            </tr>)
          })
        }
      </tbody>
    </table>
  </div>)
}