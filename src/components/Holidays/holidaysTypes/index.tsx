'use client'
import React, { useEffect, useState } from 'react';
import Button from '../../common/Button';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash } from 'react-icons/fa';
import CreateHolidayType from './CreateHolidayType';
import EditHolidayType from './EditHolidayType';
import DeleteHolidayType from './DeleteHolidayType';

// Mock API functions and data
const fetchHolidayTypesFn = async () => {
  // Simulate API call
  return [
    { id: 1, name: 'Public Holiday', description: 'National holidays' },
    { id: 2, name: 'Optional Holiday', description: 'Optional holidays' },
  ];
};

const HolidayTypes = () => {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [holidayTypes, setHolidayTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchHolidayTypes = async () => {
    setLoading(true);
    const data = await fetchHolidayTypesFn();
    setHolidayTypes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHolidayTypes();
  }, []);

  const filteredHolidayTypes = holidayTypes.filter(ht =>
    ht.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      name: 'S No',
      cell: (_row: any, idx: number) => idx + 1,
      width: '80px',
      sortable: false,
    },
    {
      name: 'Holiday Name',
      selector: (row: any) => row.name,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Description',
      selector: (row: any) => row.description,
      sortable: true,
      width: '300px',
    },
    {
      name: 'Actions',
      cell: (row: any) => (
        <div className="flex gap-3">
          <button onClick={() => { setSelected(row); setIsEditDrawerOpen(true); }} className="text-blue-500 hover:text-blue-700"><FaEdit /></button>
          <button onClick={() => { setSelected(row); setIsDeleteDrawerOpen(true); }} className="text-red-500 hover:text-red-700"><FaTrash /></button>
        </div>
      ),
      width: '120px',
    },
  ];

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="rounded bg-[#eff4fb] border  p-1 text-[12px] text-black outline-none dark:bg-boxdark dark:text-bodydark"
        />
        <Button name='Create Holiday Type' type="button" onClick={() => setIsCreateDrawerOpen(true)} />
      </div>
      <div className="mt-5 overflow-x-auto">
        <DataTable
          columns={columns}
          data={filteredHolidayTypes}
          progressPending={loading}
          pagination
          paginationPerPage={rowsPerPage}
          paginationTotalRows={filteredHolidayTypes.length}
          onChangePage={setCurrentPage}
          onChangeRowsPerPage={setRowsPerPage}
          className="custom_tbl"
        />
      </div>
      <CreateHolidayType open={isCreateDrawerOpen} toggleDrawer={setIsCreateDrawerOpen} direction="ltr" fetchHolidayTypes={fetchHolidayTypes} />
      <EditHolidayType open={isEditDrawerOpen} toggleDrawer={setIsEditDrawerOpen} direction="ltr" selected={selected} setSelected={setSelected} fetchHolidayTypes={fetchHolidayTypes} />
      <DeleteHolidayType open={isDeleteDrawerOpen} toggleDrawer={setIsDeleteDrawerOpen} selected={selected} setSelected={setSelected} fetchHolidayTypes={fetchHolidayTypes} />
    </div>
  );
};

export default HolidayTypes; 