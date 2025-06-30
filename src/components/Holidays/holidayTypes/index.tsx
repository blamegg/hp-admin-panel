'use client'
import React, { useEffect, useState } from 'react';
import Button from '../../common/Button';
import Input from '../../common/Input';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import CreateHolidayType from './CreateHolidayType';
import EditHolidayType from './EditHolidayType';
import DeleteHolidayType from './DeleteHolidayType';
import ViewHolidayTypeDrawer from './ViewHolidayTypeDrawer';
import DataTable from 'react-data-table-component';
import CustomPagination from '@/components/CustomPagination';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchHolidayTypes, deleteHolidayType } from '@/redux/slice/holidayTypesSlice';
import { HolidayType } from '@/redux/slice/holidayTypesSlice';
import useDebounce from '@/hooks/useDebounce';
import { toast } from 'sonner';
import { Tooltip } from '@mui/material';

const HolidayTypes = () => {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<HolidayType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const dispatch = useDispatch<AppDispatch>();
  const { holidayTypes, loading, error, total } = useSelector((state: RootState) => state.holidayTypes);

  useEffect(() => {
    dispatch(fetchHolidayTypes({ page: currentPage, limit: rowsPerPage, search: debouncedSearchQuery }));
  }, [dispatch, currentPage, rowsPerPage, debouncedSearchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newLimit: number) => {
    setRowsPerPage(newLimit);
    setCurrentPage(1);
  };

  const toggleCreateDrawer = (value: boolean) => setIsCreateDrawerOpen(value);
  const toggleEditDrawer = (value: boolean) => setIsEditDrawerOpen(value);
  const toggleViewDrawer = (value: boolean) => setIsViewDrawerOpen(value);
  const toggleDeleteDrawer = (value: boolean) => {
    if (!value) {
      setSelected(null);
    }
    setIsDeleteDrawerOpen(value);
  };

  const handleDeleteConfirm = async () => {
    if (selected) {
      try {
        await dispatch(deleteHolidayType(selected._id)).unwrap();
        toast.success('Holiday type deleted successfully!');
        toggleDeleteDrawer(false);
      } catch (error) {
        // Error toast is likely handled by the slice, but can add one here if needed
      }
    }
  };

  const columns = [
    {
      name: 'S No',
      cell: (_row: any, idx: number) => (currentPage - 1) * rowsPerPage + idx + 1,
      width: '80px',
    },
    {
      name: 'Holiday Type Name',
      selector: (row: HolidayType) => row.name,
      sortable: true,
    },
    {
      name: 'Description',
      selector: (row: HolidayType) => row.description || 'N/A',
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row: HolidayType) => (
        <div className="flex gap-3">
          <Tooltip title="Edit Holiday">
          <button onClick={() => { setSelected(row); toggleEditDrawer(true); }} className="text-blue-500 hover:text-blue-700"><FaEdit /></button>
          </Tooltip>
          <Tooltip title="View Holiday">
          <button onClick={() => { setSelected(row); toggleViewDrawer(true); }} className="text-gray-500 hover:text-gray-700"><FaEye /></button>
          </Tooltip>
          <Tooltip title="Delete Holiday">
          <button onClick={() => { setSelected(row); toggleDeleteDrawer(true); }} className="text-danger "><FaTrash /></button>
          </Tooltip>
        </div>
      ),
      width: '120px',
    },
  ];

  if (error) {
    return <div className="p-4 text-danger">Error: {error}</div>;
  }

  return (
    <div className='rounded-lg'>
      <div className='flex justify-between items-center lg:w-1/3 mb-5'>
        <div>
          <Input
            label=""
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full max-w-xs"
          />
        </div>
        <Button name='Create Holiday Type' type="button" onClick={() => toggleCreateDrawer(true)} />
      </div>

      <DataTable
        columns={columns}
        data={holidayTypes}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={total}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleRowsPerPageChange}
        paginationComponent={() => (
          <CustomPagination
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            rowCount={total}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
          />
        )}
        className="custom_tbl"
        customStyles={{
          header: {
            style: {
              fontSize: "12px",
              minHeight: "30px",
              backgroundColor: "#F9FAFB", // Light mode header background
              color: "#1C243F", // Light mode header text
            },
          },
          headRow: {
            style: {
              fontSize: "12px",
              minHeight: "30px",
              backgroundColor: "#F9FAFB", // Light mode header row background
              borderBottomWidth: "1px",
              borderBottomColor: "#E2E8F0", // stroke
            },
          },
          headCells: {
            style: {
              fontWeight: 700,
              color: "#1C243F", // Light mode header cells text
              backgroundColor: "#F9FAFB", // Light mode header cells background
            },
          },
          cells: {
            style: {
              fontSize: "11px",
              fontWeight: 500,
              wordBreak: "break-word",
              overflowWrap: "break-word",
              height: "27px",
              color: "#1C243F", // Light mode cell text
              backgroundColor: "#FFFFFF", // Light mode cell background
            },
          },
          rows: {
            style: {
              fontSize: "11px",
              minHeight: "27px",
              "&:not(:last-of-type)": {
                borderBottomStyle: "solid",
                borderBottomWidth: "1px",
                borderBottomColor: "#E2E8F0", // stroke
              },
              backgroundColor: "#FFFFFF", // Light mode row background
              color: "#1C243F", // Light mode row text
            },
            highlightOnHoverStyle: {
              backgroundColor: "#F7F9FC", // gray-2
              color: "#1C243F",
              cursor: "pointer",
            },
          },
        }}
      />

      <CreateHolidayType
        open={isCreateDrawerOpen}
        toggleDrawer={toggleCreateDrawer}
      />
      <EditHolidayType
        open={isEditDrawerOpen}
        toggleDrawer={toggleEditDrawer}
        selected={selected}
      />
      <DeleteHolidayType
        open={isDeleteDrawerOpen}
        toggleDrawer={toggleDeleteDrawer}
        selectedHolidayType={selected}
        handleDelete={handleDeleteConfirm}
        loading={loading}
      />
      <ViewHolidayTypeDrawer
        open={isViewDrawerOpen}
        toggleDrawer={toggleViewDrawer}
        selected={selected}
      />
    </div>
  );
};

export default HolidayTypes; 