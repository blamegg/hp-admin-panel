import React, { useState } from "react";
import { Card, Typography, Grid } from "@mui/material";
import { FaCalendarAlt, FaCheck, FaClipboardList, FaHeartbeat } from "react-icons/fa";
import LeaveForm from "./LeaveForm";
import Button from "../common/Button";

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
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return (
      <LeaveForm onBack={() => setShowForm(false)} />
    );
  }

  return (
    <div className="flex justify-center items-center py-10">
      <Card elevation={10} className="w-full bg-white rounded-lg p-6">
        <Typography variant="h6" className="text-center font-semibold mb-6 text-gray-800 py-6">
          Leave Balance Overview
        </Typography>
        <Grid container spacing={3}>
          {/* Total Leaves */}
          <Grid item xs={12} md={6}>
            <Card className="bg-blue-100 rounded-lg p-4 shadow-md hover:shadow-lg transition-all h-full">
              <div className="flex items-center h-full">
                <FaClipboardList size={30} className="text-blue-600 mr-4" />
                <div className="flex flex-col justify-center">
                  <Typography className="font-semibold text-blue-800 text-lg">Total Leaves</Typography>
                  <Typography className="text-blue-900 font-bold">{leaveRecord.totalLeaves} Days</Typography>
                </div>
              </div>
            </Card>
          </Grid>
          {/* Leaves Taken */}
          <Grid item xs={12} md={6}>
            <Card className="bg-green-100 rounded-lg p-4 shadow-md hover:shadow-lg transition-all h-full">
              <div className="flex items-center h-full">
                <FaCheck size={30} className="text-green-600 mr-4" />
                <div className="flex flex-col justify-center">
                  <Typography className="font-semibold text-green-800 text-lg">Leaves Taken</Typography>
                  <Typography className="text-green-900 font-bold">{leaveRecord.leavesTaken} Days</Typography>
                </div>
              </div>
            </Card>
          </Grid>
          {/* Sick Leaves */}
          <Grid item xs={12} md={6}>
            <Card className="bg-red-100 rounded-lg p-4 shadow-md hover:shadow-lg transition-all h-full">
              <div className="flex items-center h-full">
                <FaHeartbeat size={30} className="text-red-600 mr-4" />
                <div className="flex flex-col justify-center">
                  <Typography className="font-semibold text-red-800 text-lg">Sick Leaves</Typography>
                  <Typography className="text-red-900 font-bold">{leaveRecord.sickLeaves} Days</Typography>
                </div>
              </div>
            </Card>
          </Grid>
          {/* Remaining Leaves */}
          <Grid item xs={12} md={6}>
            <Card className="bg-gray-100 rounded-lg p-4 shadow-md hover:shadow-lg transition-all h-full">
              <div className="flex items-center h-full">
                <FaCalendarAlt size={30} className="text-gray-600 mr-4" />
                <div className="flex flex-col justify-center">
                  <Typography className="font-semibold text-gray-800 text-lg">Remaining Leaves</Typography>
                  <Typography className="text-gray-900 font-bold">{leaveRecord.remainingLeaves} Days</Typography>
                </div>
              </div>
            </Card>
          </Grid>
        </Grid>
        {/* Action Button */}
        <div className="mt-6 flex justify-center items-center">
          <Button
           type="button"
            name="Apply for Leave"
            className="shadow-lg bg-primary  py-2 text-md"
            onClick={() => setShowForm(true)}
           />
        </div>
      </Card>
    </div>
  );
};

export default LeaveInfo;
