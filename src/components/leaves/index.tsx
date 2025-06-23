"use client"
import React, { useEffect, useState } from 'react'
import Button from '../common/Button'
import CreateLeave from './CreateLeave'
import DeleteLeave from './DeleteLeave'
import EditLeave from './EditLeave'
import { useDirection } from '@/context/DirectionContext'
import { fetchLeaveTypeFn } from '@/utility/queryFetcher'
import { useDispatch, useSelector } from 'react-redux'
import { setLeaves, setLeavesLoading, setLeavesError } from '@/redux/slice/leaveTypesSlice'
import { RootState } from '@/redux/store'
import DataTable from 'react-data-table-component'
import CustomPagination from '../CustomPagination'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useHasPermission } from '@/hooks/useUserPermissions'

const Leaves = () => {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchBasis, setSearchBasis] = React.useState("name");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState("");
  const [selected, setSelected] = useState<any>(null);

  const { direction } = useDirection()
  const { leaveTypes, total, page, totalPages, limit, loading, error } = useSelector((state: RootState) => state.leave);
  const dispatch = useDispatch();
  const hasPermission = useHasPermission();

  console.log(leaveTypes, "leaveTypes")

  const fetchLeavesType = React.useCallback(() => {
    // dispatch(setLeavesLoading());
    fetchLeaveTypeFn()
      .then(data => {
        dispatch(setLeaves(data));
      })
      .catch(err => {
        dispatch(setLeavesError(err?.message || "Failed to fetch leaves"));
      });
  }, [dispatch]);

  useEffect(() => {
    fetchLeavesType();
  }, [fetchLeavesType]);

  // Debouncinng search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, searchBasis]);

  // Memoize filtered data 
  const filteredLeaves = React.useMemo(() => {
    if (!leaveTypes) return [];
    if (!debouncedSearchQuery.trim()) return leaveTypes;
    return leaveTypes.filter((leave: any) => {
      const value = leave[searchBasis]?.toString().toLowerCase() || '';
      return value.includes(debouncedSearchQuery.toLowerCase());
    });
  }, [leaveTypes, debouncedSearchQuery, searchBasis]);

  const toggleCreateDrawer = (value: boolean) => setIsCreateDrawerOpen(value)
  const toggleEditLeaveDrawer = (value: boolean) => setIsEditDrawerOpen(value);
  const toggleDeleteLeaveDrawer = (value: boolean) => setIsDeleteDrawerOpen(value)

  const columns = [
    {
      name: 'S No',
      cell: (_row: any, idx: number) => (currentPage - 1) * rowsPerPage + idx + 1,
      width: '80px',
      sortable: false,
    },
    {
      name: 'Leave Name',
      selector: (row: any) => row.name,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Paid',
      selector: (row: any) => (row.paid ? 'Yes' : 'No'),
      sortable: true,
      width: '120px',
    },
    {
      name: 'Half Day Allowed',
      selector: (row: any) => (row.half_day_allowed ? 'Yes' : 'No'),
      sortable: true,
      width: '160px',
    },
    {
      name: 'Status',
      selector: (row: any) => (row.status ? 'Yes' : 'No'),
      sortable: true,
      width: '160px',
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

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <select
          value={searchBasis}
          onChange={(e) => setSearchBasis(e.target.value)}
          className="rounded bg-[#eff4fb] border px-1 py-2 text-[12px] text-black outline-none dark:bg-boxdark dark:text-bodydark"
        >
          <option value="name">Leave Name</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${searchBasis}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded bg-[#eff4fb] border  p-1 text-[12px] text-black outline-none dark:bg-boxdark dark:text-bodydark"
        />
        {hasPermission('Create Leave Type') && (
          <Button name='Create Leave' type="button" onClick={() => toggleCreateDrawer(true)} />
        )}
      </div>

      <div className="mt-5 overflow-x-auto">
        <DataTable
          columns={columns}
          data={filteredLeaves}
          progressPending={loading}
          pagination
          paginationPerPage={rowsPerPage}
          paginationTotalRows={total}
          paginationComponent={() => (
            <CustomPagination
              rowsPerPage={rowsPerPage}
              currentPage={currentPage}
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
                backgroundColor: "#F9FAFB",
                color: "#1C243F",
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
      </div>

      <CreateLeave direction={direction} open={isCreateDrawerOpen} toggleDrawer={toggleCreateDrawer} fetchLeavesType={fetchLeavesType} />
      <EditLeave direction={direction} open={isEditDrawerOpen} toggleDrawer={toggleEditLeaveDrawer} selected={selected} setSelected={setSelected} fetchLeavesType={fetchLeavesType} />
      <DeleteLeave direction={direction} open={isDeleteDrawerOpen} toggleDrawer={toggleDeleteLeaveDrawer} selected={selected} setSelected={setSelected} fetchLeavesType={fetchLeavesType} />
    </div>
  )
}

export default Leaves