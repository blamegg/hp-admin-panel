import { Tooltip } from '@mui/material'
import React, { useState } from 'react'
import DataTable from "react-data-table-component";
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { AppliedLeave } from '@/redux/slice/takenLeaveSclice';
import EditTakenLeave from './ApproveTakenLeaveDrawer';
import DeleteTakenLeaveDrawer from './DeleteTakenLeaveDrawer';
import ViewTakenLeaveDrawer from './ViewTakenLeaveDrawer';
import UpdateTakenLeaveDrawer from './UpdateTakenLeaveDrawer';
import { useHasPermission } from '@/hooks/useUserPermissions';


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

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  } catch (error) {
    return dateString; // Return original string if parsing fails
  }
};

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
  const hasPermission = useHasPermission();

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
    cell: (row: AppliedLeave, index: number) => (
      <div>
        {(currentPage - 1) * rowsPerPage + index + 1}
      </div>
    ),
    sortable: false,
    width: "60px",
  },
  {
    name: "User Name",
    cell: (row: AppliedLeave) => (
      <div>
        {row?.user_details?.name || '-'}
      </div>
    ),
    sortable: true,
  },
  {
    name: "Leave Type",
    cell: (row: AppliedLeave) => (
      <div>
        {typeof row.leave_type === 'object' ? row.leave_type.name : row.leave_type || 'N/A'}
      </div>
    ),
    sortable: true,
  },
  {
    name: "Mode",
    cell: (row: AppliedLeave) => (
      <div>
        {row.leave_mode}
      </div>
    ),
    sortable: true,
  },
  {
    name: "Dates",
    cell: (row: AppliedLeave) => {
      const formatDates = (dates: string[]) => {
        if (!dates || dates.length === 0) return 'N/A';
        if (dates.length === 1) return formatDate(dates[0]);
        if (dates.length === 2) return `${formatDate(dates[0])} - ${formatDate(dates[1])}`;
        return `${formatDate(dates[0])} +${dates.length - 1} more`;
      };

      if (row.leave_mode === 'Multi-Days' && Array.isArray(row.dates) && row.dates.length > 0) {
        return <div>{formatDates(row.dates)}</div>;
      } else if (row.start_date && row.end_date && row.start_date !== row.end_date) {
        return <div>{formatDate(row.start_date)} - {formatDate(row.end_date)}</div>;
      } else if (row.start_date) {
        return <div>{formatDate(row.start_date)}</div>;
      } else {
        return <div>N/A</div>;
      }
    },
    sortable: true,
  },
  {
    name: "Days",
    cell: (row: AppliedLeave) => (
      <div>
        {row?.days_count}
      </div>
    ),
    sortable: true,
  },
  {
    name: <div className="truncate w-[100px]">Half Day</div>,
    cell: (row: AppliedLeave) => (
      <div>
        {row.half_day ? 'Yes' : 'No'}
      </div>
    ),
    sortable: true,
  },
  {
    name: "Status",
    cell: (row: AppliedLeave) => (
      <div>
        <StatusBadge status={row.status} />
      </div>
    ),
    sortable: true,
  },
  {
    name: "Actions",
    cell: (row: AppliedLeave) => (
      <div className="flex gap-3">
        {hasPermission('Edit leave') && (
          <Tooltip title="Approve Leave">
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
        )}
        {hasPermission('View leave details') && (
          <Tooltip title="View leave">
            <button
              onClick={() => handleOpenViewDrawer(row)}
              className="text-red-500"
            >
              <FaEye />
            </button>
          </Tooltip>
        )}
        {hasPermission('Delete leave') && (
          <Tooltip title="Delete leave">
            <button
              onClick={() => {
                setSelectedLeave(row);
                toggleDeleteTakenLeaveDrawer(true);
              }}
              className="text-danger"
            >
              <FaTrash />
            </button>
          </Tooltip>
        )}
      </div>
    ),
  }
];




  return (
    <div className="flex justify-center items-center ">
      <div className='overflow-x-scroll w-full '>

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
                  borderBottomColor: "#E2E8f0", 
                },
                backgroundColor: "transprant", 
                color: "#1C243F", 
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

