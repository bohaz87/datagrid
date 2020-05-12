import React from 'react';
import DataGrid from '../datagrid';

export default function AddressBook(){
  let columns = [
    {title: 'ID', field: 'id', sortable: true},
    {title: 'Name', field: 'name', sortable: true}, 
    {title: 'Loation', field: 'loc',sortable: true},
    {title:'Office', field: 'office',sortable: true}, 
    {title:'Phone', items:[
      {title: 'Office', field: 'phone.office',sortable: true, editable: true},
      {title: 'Cell', field: 'phone.cell',sortable: true, editable: true},
      // {title:'test', items: [{title: 'a'}, {title: 'b'}]}
  ]}];

  let [data] = React.useState([
    {'id': '501', 'name': 'Shali Zhang','loc': 'HaiNan',	'office': 'C-103',	'phone': {'office': 'x55778',	'cell': '650-353-1239'}},
    {'id': '203', 'name': 'Fhali Zhang',	'loc': 'BeiJing',	'office': 'B-104',	'phone': {'office': 'y55778',	'cell': '250-353-1239'}},
    {'id': '301', 'name': 'Kbali Zhang',	'loc': 'NanJing',	'office': 'D-303',	'phone': {'office': 'z55778',	'cell': '350-353-1239'}},
    {'id': '201', 'name': 'DDDli Zhang',	'loc': 'GuangDong',	'office': 'X-503',	'phone': {'office': 'a55778',	'cell': '450-353-1239'}}
  ]);

  return <DataGrid columns={columns} selectable={true} data={data}/>
}