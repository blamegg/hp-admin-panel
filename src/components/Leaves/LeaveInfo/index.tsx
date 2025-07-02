'use client'
import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaCheck, FaClipboardList, FaHeartbeat } from "react-icons/fa";
import LeaveForm from "./LeaveForm";
import Button from "../../common/Button";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { fetchTakenLeaves, fetchLeavesSummary } from "@/redux/slice/takenLeaveSclice";
import { fetchLeaveType } from "@/redux/slice/leaveTypesSlice";
import Select from "../../common/Select";
import Input from "../../common/Input";
import CustomPagination from "@/components/CustomPagination";
import { useHasPermission } from "@/hooks/useUserPermissions";
import { toSentenceCase } from '@/utility/helper';
import TakenLeaves from "./TakenLeaves";
import useDebounce from '@/hooks/useDebounce';
import PermissionDenied from "@/components/common/PermissionDenied";


interface LeaveRecord {
  totalLeaves: number;
  leavesTaken: number;
  sickLeaves: number;
  remainingLeaves: number;
}

const leaveRecord: LeaveRecord = {
  totalLeaves: 30,
  leavesTaken: 10,
  sickLeaves: 3, // Added sick leaves data
  remainingLeaves: 17,
};

const LeaveInfo: React.FC = () => {
  const [isLeaveFormShowing, setIsLeaveFormShowing] = useState(false);
  const [status, setStatus] = useState("");
  const [leaveTypeId, setLeaveTypeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedStatus = useDebounce(status, 500);
  const debouncedLeaveTypeId = useDebounce(leaveTypeId, 500);
  const debouncedStartDate = useDebounce(startDate, 500);
  const debouncedEndDate = useDebounce(endDate, 500);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const dispatch = useDispatch<AppDispatch>();

  const leaveState = useSelector((state: RootState) => state.appliedLeaves);
  const { leaveTypes } = useSelector((state: RootState) => state.leaveTypes);
  const summary = useSelector((state: RootState) => state.appliedLeaves.summary);


  const hasPermission = useHasPermission();

  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
  ];


  const leaveTypeOptions = Array.isArray(leaveTypes)
    ? leaveTypes.map(type => ({
      value: String(type._id),
      label: String(type.name)
    }))
    : [];

  const toggleLeaveFormDrawer = (value: boolean) => {
    setIsLeaveFormShowing(value);
  }

  useEffect(() => {
    dispatch(fetchLeaveType());
    dispatch(fetchLeavesSummary());
  }, [dispatch]);

  
  console.log('Leaves Summary:', summary);

  useEffect(() => {
    const searchParams: {
      status?: string;
      leave_type?: string;
      start_date?: string;
      end_date?: string;
      page?: number;
      limit?: number;
      name?: string;
    } = {
      page: currentPage,
      limit: rowsPerPage,
    };

    if (debouncedStatus) searchParams.status = debouncedStatus;
    if (debouncedLeaveTypeId) searchParams.leave_type = debouncedLeaveTypeId;
    if (debouncedStartDate) searchParams.start_date = debouncedStartDate;
    if (debouncedEndDate) searchParams.end_date = debouncedEndDate;
    if (debouncedSearchQuery) searchParams.name = debouncedSearchQuery;

    dispatch(fetchTakenLeaves(searchParams));
  }, [dispatch, debouncedStatus, debouncedLeaveTypeId, debouncedStartDate, debouncedEndDate, debouncedSearchQuery, currentPage, rowsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newLimit: number) => {
    setRowsPerPage(newLimit);
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  return (
    <div className="w-[350px] md:w-full pb-0  md:pb-0">

      {/* Filter */}
      {hasPermission("View leaves list") ? (
        <>
          <div className="grid lg:grid-cols-4 grid-cols-2 gap-x-4 gap-y-2 w-full mb-2">
            {/* Total Leaves */}
            <div className="flex items-center  bg-white rounded-sm px-2 py-1">
              <FaClipboardList size={25} className="text-blue-600 mr-2" />
              <div className="flex flex-col justify-center">
                <p className=" text-blue-800 font-semibold text-xs">Total Leaves</p>
                <p className="text-blue-900 font-semibold text-xs">{leaveRecord.totalLeaves} Days</p>
              </div>
            </div>
            {/* Leaves Taken */}
            <div className="flex items-center h-full bg-white rounded-sm px-2 py-1">
              <FaCheck size={25} className="text-green-600 mr-2" />
              <div className="flex flex-col justify-center">
                <p className="text-green-800 font-semibold text-xs">Leaves Taken</p>
                <p className="text-green-900 font-semibold text-xs">{leaveRecord.leavesTaken} Days</p>
              </div>
            </div>
            {/* Sick Leaves */}
            <div className="flex items-center h-full bg-white rounded-sm px-2 py-1">
              <FaHeartbeat size={25} className="text-red-600 mr-2" />
              <div className="flex flex-col justify-center">
                <p className=" text-red-800 font-semibold text-xs">Sick Leaves</p>
                <p className="text-red-900 font-semibold text-xs">{leaveRecord.sickLeaves} Days</p>
              </div>
            </div>
            {/* Remaining Leaves */}
            <div className="flex items-center h-full bg-white rounded-sm px-2 py-1">
              <FaCalendarAlt size={25} className="text-gray-600 mr-2" />
              <div className="flex flex-col justify-center">
                <p className=" text-gray-800 font-semibold text-xs">Remaining Leaves</p>
                <p className="text-gray-900 font-semibold text-xs">{leaveRecord.remainingLeaves} Days</p>
              </div>
            </div>
          </div>
          <>
            <div className="grid items-center gap-x-4 gap-y-2 grid-cols-2  md:flex   w-full mb-4">
              <div className="w-full">
                <Input
                  label="Search by name"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name"
                />
              </div>
              <div className="w-full">
                <Select
                  label="Status"
                  options={statusOptions}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                />
              </div>
              <div className="w-full">
                <Select
                  label="Leave type"
                  options={leaveTypeOptions}
                  value={leaveTypeId}
                  onChange={(e) => setLeaveTypeId(e.target.value)}
                />
              </div>
              <div className="w-full">
                <Input
                  label="Start date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Start Date"
                />
              </div>

              <div className="w-full">
                <Input
                  label="End date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="End Date"
                />
              </div>
              {hasPermission(toSentenceCase('Create leave')) && (
                <div className="self-end w-full">
                  <Button
                    name="Apply Leave"
                    type="button"
                    onClick={() => toggleLeaveFormDrawer(true)}
                    className=" bg-primary"
                  />
                </div>
              )}
            </div>

            <div className="max-w-full overflow-x-auto mb-0">
              <TakenLeaves
                leaves={leaveState.appliedLeaves}
                loading={leaveState.loading}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
              />
            </div>
            <div className="mb-8 md:mb-auto">
              <CustomPagination
                rowsPerPage={leaveState?.pagination?.limit || 10}
                currentPage={leaveState?.pagination?.currentPage || 1}
                rowCount={leaveState?.pagination?.total || 0}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handleRowsPerPageChange}
              />
            </div>
          </>
          <LeaveForm isLeaveFormShowing={isLeaveFormShowing} toggleDrawer={toggleLeaveFormDrawer} />
        </>
      ) :
        (
          <PermissionDenied />
        )
      }
    </div>
  );
};

export default LeaveInfo;


