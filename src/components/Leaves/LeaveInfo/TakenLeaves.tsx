import { Tooltip } from '@mui/material'
import React, { useState } from 'react'
import DataTable from "react-data-table-component";
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { AppliedLeave } from '@/redux/slice/takenLeaveSclice';
import EditTakenLeave from './ApproveTakenLeaveDrawer';
import DeleteTakenLeaveDrawer from './DeleteTakenLeaveDrawer';
import ViewTakenLeaveDrawer from './ViewTakenLeaveDrawer';
import UpdateTakenLeaveDrawer from './UpdateTakenLeaveDrawer';


const StatusBadge = ({ status }: { status: string }) => {
  const baseClasses = "px-1.5 py-[3px]   rounded-full";
  let statusClasses = "";

  switch (status?.toLowerCase()) {
    case 'pending':
      statusClasses = "bg-warning text-white ";
      break;
    case 'approved':
      statusClasses = "bg-success text-white";
      break;
    case 'rejected':
      statusClasses = "bg-danger text-white";
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
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<AppliedLeave | null>(null);

  const toggleEditTakenLeaveDrawer = (value: boolean) => {
    setIsEditTakenLeaveDrawerShowing(value);
  }
  const toggleDeleteTakenLeaveDrawer = (value: boolean) => {
    setIsDeleteTakenLeaveDrawerShowing(value);
  }

  const handleOpenViewDrawer = (leave: AppliedLeave) => {
    setSelectedLeave(leave);
    setIsViewDrawerOpen(true);
  };

  const handleUpdate = (leave: AppliedLeave) => {
    setSelectedLeave(leave);
    setIsViewDrawerOpen(false);
    setIsUpdateDrawerOpen(true);
  };

  
  const columns = [
    {
      name: "S No",
      cell: (row: AppliedLeave, index: number) => (currentPage - 1) * rowsPerPage + index + 1,
      sortable: false,
      width: "60px",
    },
    {
      name: "User Name",
      cell: (row: AppliedLeave) => (
        <div style={{ minWidth: "100px", maxWidth: "auto" }}>
          {row?.user_details?.name || '-'}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Leave Type",
      cell: (row: AppliedLeave) => (
        <div style={{ minWidth: "100px", maxWidth: "auto" }}>
          {typeof row.leave_type === 'object' ? row.leave_type.name : row.leave_type || 'N/A'}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Mode",
      cell: (row: AppliedLeave) => (
        <div style={{ minWidth: "60px", maxWidth: "auto" }}>
          {row.leave_mode}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Dates",
      cell: (row: AppliedLeave) => (
        <div style={{ minWidth: "120px", maxWidth: "auto" }}>
          {row.leave_mode === 'Multi-Days' && Array.isArray((row as any).dates) && (row as any).dates.length > 0
            ? 'Multi'
            : formatDate(row?.start_date)}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Days",
      cell: (row: AppliedLeave) => row?.days_count,
      sortable: true,
      width: "75px"
    },

    {
      name: "Status",
      cell: (row: AppliedLeave) => (
        <div style={{ minWidth: "100px", maxWidth: "auto" }}>
          <StatusBadge status={row.status} />
        </div>
      )
      ,
      sortable: true,
    },

    {
      name: "Actions",
      cell: (row: any) => (
        <div className="flex gap-3">
          <Tooltip
            title="Approve Leave">
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

          <Tooltip title="View leave">
            <button
              onClick={() => {
                handleOpenViewDrawer(row);
              }}
              className="text-red-500 "
            >
              <FaEye className="" />
            </button>
          </Tooltip>
          <Tooltip title="Delete leave">
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
        </div>
      ),
    }
  ];


  return (
    <div className="flex justify-center items-center w-full">
      <div className='overflow-x-scroll w-full'>

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
                backgroundColor: "transparent", // Allow row background to show through
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
                backgroundColor: "transprant", // Light mode row background
                color: "#1C243F", // Light mode row text
              },
              highlightOnHoverStyle: {
                backgroundColor: "#e4e7f7",
                color: "white",
                cursor: "pointer",
              },
            },
          }}
        />
      </div>
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
      <ViewTakenLeaveDrawer
        selectedLeave={selectedLeave}
        isViewTakenLeaveDrawerShowing={isViewDrawerOpen}
        toggleDrawer={setIsViewDrawerOpen}
        onUpdate={handleUpdate}
      />
      <UpdateTakenLeaveDrawer
        selectedLeave={selectedLeave}
        isUpdateDrawerShowing={isUpdateDrawerOpen}
        toggleDrawer={setIsUpdateDrawerOpen}
      />
    </div>
  );
}

export default TakenLeaves

