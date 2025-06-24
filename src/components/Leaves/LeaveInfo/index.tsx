'use client'
import React, { useEffect, useState } from "react";
import { Card, Typography, Grid, Tooltip } from "@mui/material";
import { FaCalendarAlt, FaCheck, FaClipboardList, FaHeartbeat, FaRegQuestionCircle } from "react-icons/fa";
import LeaveForm from "./LeaveForm";
import Button from "../../common/Button";
import TakenLeaves from "./TakenLeaves";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { fetchTakenLeaves } from "@/redux/slice/takenLeaveSclice";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBasis, setSearchBasis] = useState("leave_type");

  const dispatch = useDispatch<AppDispatch>();

  const { appliedLeaves, loading: leaveDataLoading } = useSelector((state: RootState) => state.appliedLeaves);

  const toggleLeaveFormDrawer = (value: boolean) => {
    setIsLeaveFormShowing(value);
  }

  console.log(appliedLeaves)
  useEffect(() => {
    const searchParams = {
      search: searchQuery,
      search_by: searchBasis,
    };
    dispatch(fetchTakenLeaves(searchParams));
  }, [dispatch, searchQuery, searchBasis]);

  return (
    <div className="">
      <div className="grid grid-cols-4 gap-6 w-full mb-6">
        {/* Total Leaves */}
          <div className="flex items-center  bg-white rounded-sm px-2 py-2">
            <FaClipboardList size={25} className="text-blue-600 mr-2" />
            <div className="flex flex-col justify-center">
              <p className=" text-blue-800 font-semibold text-xs">Total Leaves</p>
              <p className="text-blue-900 font-semibold text-xs">{leaveRecord.totalLeaves} Days</p>
            </div>
        </div>
        {/* Leaves Taken */}
        <div className="flex items-center h-full bg-white rounded-sm px-2 py-2">
          <FaCheck size={25} className="text-green-600 mr-2" />
          <div className="flex flex-col justify-center">
            <p className="text-green-800 font-semibold text-xs">Leaves Taken</p>
            <p className="text-green-900 font-semibold text-xs">{leaveRecord.leavesTaken} Days</p>
          </div>
        </div>
        {/* Sick Leaves */}
        <div className="flex items-center h-full bg-white rounded-sm px-2 py-2">
          <FaHeartbeat size={25} className="text-red-600 mr-2" />
          <div className="flex flex-col justify-center">
            <p className=" text-red-800 font-semibold text-xs">Sick Leaves</p>
            <p className="text-red-900 font-semibold text-xs">{leaveRecord.sickLeaves} Days</p>
          </div>
        </div>
        {/* Remaining Leaves */}
        <div className="flex items-center h-full bg-white rounded-sm px-2 py-2">
          <FaCalendarAlt size={25} className="text-gray-600 mr-2" />
          <div className="flex flex-col justify-center">
            <p className=" text-gray-800 font-semibold text-xs">Remaining Leaves</p>
            <p className="text-gray-900 font-semibold text-xs">{leaveRecord.remainingLeaves} Days</p>
          </div>
        </div>
      </div>
      <div className=" grid grid-cols-2 md:flex items-center gap-4 mb-6">
        <>
          <select
            // value={searchBasis}
            // onChange={(e) => setSearchBasis(e.target.value)}
            className="rounded bg-[#eff4fb] border  py-2 px-2 text-[12px] text-black outline-none dark:bg-boxdark dark:text-bodydark"

          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="mobile">Mobile</option>
          </select>
          <input
            type="text"
            // placeholder={`Search by ${searchBasis}...`}
            // value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
            // onKeyPress={(e) => {
            //   if (e.key === 'Enter') {
            //     setCurrentPage(1);
            //     queryClient.invalidateQueries({ queryKey: ["users"] });
            //   }
            // }}
            className="rounded bg-[#eff4fb] border  p-1 text-[12px] text-black outline-none dark:bg-boxdark dark:text-bodydark"
          />
        </>

        <Button
          name="Apply Leave"
          type="button"
          onClick={() => toggleLeaveFormDrawer(true)}
          className="w-full md:w-auto bg-primary"
        />

       
      </div>
      <TakenLeaves leaves={appliedLeaves} loading={leaveDataLoading} />
      <LeaveForm isLeaveFormShowing={isLeaveFormShowing} toggleLeaveFormDrawer={toggleLeaveFormDrawer} />

    </div>
  );
};

export default LeaveInfo;
