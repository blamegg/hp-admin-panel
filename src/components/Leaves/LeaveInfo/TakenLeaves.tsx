import { Card, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Button from '../../common/Button';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import Loader from '../../common/Loader';
import { fetchTakenLeaves } from '@/redux/slice/takenLeaveSclice';
import DataTable from "react-data-table-component";
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { TbLockOff } from 'react-icons/tb';
import { AppliedLeave } from '@/redux/slice/takenLeaveSclice';
import EditTakenLeave from './EditTakenLeaveDrawer';
import { deleteLeaveFn } from '@/utility/queryFetcher';
import DeleteTakenLeaveDrawer from './DeleteTakenLeaveDrawer';

interface LeaveType {
  _id: string;
  name: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const baseClasses = "px-1.5 py-1 text-xs font-medium rounded-full";
  let statusClasses = "";

  switch (status?.toLowerCase()) {
    case 'pending':
      statusClasses = "bg-yellow-100 text-yellow-800";
      break;
    case 'approved':
      statusClasses = "bg-green-100 text-green-800";
      break;
    case 'rejected':
      statusClasses = "bg-red-100 text-red-800";
      break;
    default:
      statusClasses = "bg-gray-100 text-gray-800";
  }

  return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
};

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', {
  year: 'numeric', month: 'short', day: 'numeric'
});

interface TakenLeavesProps {
  leaves: AppliedLeave[];
  loading: boolean;
  currentPage: number;
  rowsPerPage: number;
}

const TakenLeaves: React.FC<TakenLeavesProps> = ({ leaves, loading, currentPage, rowsPerPage }) => {

  const [isEditTakenLeaveDrawerShowing, setIsEditTakenLeaveDrawerShowing] = useState(false);
  const [isDeleteTakenLeaveDrawerShowing, setIsDeleteTakenLeaveDrawerShowing] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<AppliedLeave | null>(null);

  const toggleEditTakenLeaveDrawer = (value: boolean) => {
    setIsEditTakenLeaveDrawerShowing(value);
  }
  const toggleDeleteTakenLeaveDrawer = (value: boolean) => {
    setIsDeleteTakenLeaveDrawerShowing(value);
  }

  const columns = [
    {
      name: "S No",
      cell: (row: AppliedLeave, index: number) => (currentPage - 1) * rowsPerPage + index + 1,
      sortable: false,
      width: "60px",
    },
    {
      name: "Leave Type",
      selector: (row: AppliedLeave) => row.leave_type?.name || 'N/A',
      sortable: true,
      width: "110px",
    },
    {
      name: "From",
      cell: (row: AppliedLeave) => `${formatDate(row?.start_date)}`,
      sortable: true,
      width: "120px",
    },
    {
      name: "To",
      cell: (row: AppliedLeave) => `${formatDate(row?.end_date)}`,
      sortable: true,
      width: "120px",
    },
    {
      name: "Mode",
      selector: (row: AppliedLeave) => row.leave_mode,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row: AppliedLeave) => <StatusBadge status={row.status} />,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row: AppliedLeave) => row.description || '-',
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <div className="flex gap-3">
          <Tooltip
            title="Edit Leave">
            <button
              onClick={() => {
                setSelectedLeave(row);
                toggleEditTakenLeaveDrawer(true);
              }}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaEdit />
            </button>
          </Tooltip>

          <Tooltip title="Delete Leave">
            <button
              onClick={() => {
                setSelectedLeave(row)
                toggleDeleteTakenLeaveDrawer(true)
              }}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash className="text-danger" />
            </button>
          </Tooltip>

          <Tooltip title="Reset Password">
            <button
              // onClick={}
            >
              {row.isLocked && <TbLockOff className="w-4 h-4 text-danger" />}
            </button>
          </Tooltip>
        </div>
      ),
    }
  ];


  return (
    <div className="flex justify-center items-center h-full">
      <DataTable
        columns={columns}
        data={leaves}
        progressPending={loading}
        progressComponent={<p>Loading...</p>}
        highlightOnHover
        striped
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
      <EditTakenLeave
        toggleDrawer={toggleEditTakenLeaveDrawer}
        isEditTakenLeaveDrawerShowing={isEditTakenLeaveDrawerShowing}
        selectedLeave={selectedLeave}
      />
      <DeleteTakenLeaveDrawer
        toggleDrawer={toggleDeleteTakenLeaveDrawer}
        isDeleteTakenLeaveDrawerShowing={isDeleteTakenLeaveDrawerShowing}
        selectedLeave={selectedLeave}
      />
    </div>
  );
}

export default TakenLeaves

