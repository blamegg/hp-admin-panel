import React, { useState } from "react";
import { Card, Typography, Grid, Button, TextField, Dialog, DialogContent, IconButton } from "@mui/material";
import { FaIdCard, FaGraduationCap, FaFilePdf, FaAddressCard, FaUserCircle, FaPhone, FaEye, FaTimes, FaDownload } from "react-icons/fa";

import { StaticImageData } from "next/image";
import { AadharCard, Pancard } from "@/assets";

interface EmployeeDetails {
  name: string;
  aadhaarCard: StaticImageData;
  marksheet: string;
  cv: string;
  panCard: StaticImageData;
  graduation: string;
  postGraduation: string;
  address: string;
  phoneNumber: string;
}

const initialEmployeeData: EmployeeDetails = {
  name: "John Doe",
  phoneNumber: "+1-234-567-890",
  panCard: Pancard,
  aadhaarCard: AadharCard,
  marksheet: "images/demopd.pdf",
  cv: "images/demopd.pdf",
  graduation: "B.Tech in Computer Science",
  postGraduation: "M.Tech in Software Engineering",
  address: "1234 Elm Street, Some City, Some State, 123456",
};

const EmployeeDetailsCard: React.FC = () => {
  const [employeeData, setEmployeeData] = useState<EmployeeDetails>(initialEmployeeData);
  const [isEditing, setIsEditing] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const handleInputChange = (field: keyof EmployeeDetails, value: string) => {
    setEmployeeData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  const openPreview = (src: string) => {
    setPreviewSrc(src);
  };

  return (
    <div className="flex justify-center items-center py-10">
      <Card elevation={10} className="w-full max-w-3xl bg-white rounded-lg shadow-xl p-6">
        <Typography variant="h6" className="text-center font-semibold mb-6 text-gray-800">
          Employee Details
        </Typography>

        <Grid container spacing={3}>
          {Object.entries(employeeData).map(([key, value]) => (
            <Grid item xs={12} sm={6} key={key}>
              <div className="relative bg-gray-100 rounded-lg p-4 shadow-md flex items-center">
                <div className="flex items-center w-full">
                  {key === "name" && <FaUserCircle size={20} className="text-indigo-600 mr-4" />}
                  {key === "aadhaarCard" && <FaIdCard size={20} className="text-blue-600 mr-4" />}
                  {key === "marksheet" && <FaFilePdf size={20} className="text-green-600 mr-4" />}
                  {key === "cv" && <FaFilePdf size={20} className="text-yellow-600 mr-4" />}
                  {key === "panCard" && <FaIdCard size={20} className="text-red-600 mr-4" />}
                  {key === "graduation" && <FaGraduationCap size={20} className="text-teal-600 mr-4" />}
                  {key === "postGraduation" && <FaGraduationCap size={20} className="text-purple-600 mr-4" />}
                  {key === "address" && <FaAddressCard size={20} className="text-gray-600 mr-4" />}
                  {key === "phoneNumber" && <FaPhone size={20} className="text-pink-600 mr-4" />}

                  <div className="flex flex-col justify-center w-full">
                    <Typography className="font-semibold text-gray-800 capitalize" style={{ fontSize: "14px" }}>
                      {key.replace(/([A-Z])/g, " $1")}
                    </Typography>
                    {isEditing ? (
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={value}
                        onChange={(e) => handleInputChange(key as keyof EmployeeDetails, e.target.value)}
                      />
                    ) : key === "marksheet" || key === "cv" || key === "aadhaarCard" || key === "panCard" ? (
                      <button
                        className="text-blue-600 flex items-center space-x-2"
                        onClick={() => openPreview(typeof value === "string" ? value : value.src)}
                      >
                        <FaEye size={16} />
                        <span>View {key.replace(/([A-Z])/g, " $1")}</span>
                      </button>
                    ) : (
                      <Typography className="text-gray-900 font-bold text-base">{value}</Typography>
                    )}
                  </div>      
                </div>
              </div>
            </Grid>
          ))}
        </Grid>

        <div className="mt-6 text-center">
          <Button
            variant="contained"
            color={isEditing ? "success" : "primary"}
            size="large"
            onClick={toggleEditMode}
            className="w-full md:w-1/2 text-sm font-medium shadow-lg transform hover:scale-105 transition-transform"
          >
            {isEditing ? "Save Changes" : "Edit Details"}
          </Button>
        </div>
      </Card>

      {/* Dialog for Image/PDF Preview */}
      <Dialog open={!!previewSrc} onClose={() => setPreviewSrc(null)} >
        <DialogContent className="relative">
          {/* Close Button */}
          <IconButton
            className="absolute -top-2 right-4 bg-gray-200 hover:bg-gray-300 rounded-full"
            onClick={() => setPreviewSrc(null)}
          >
            <FaTimes size={18} />
          </IconButton>

          {previewSrc?.endsWith(".pdf") ? (
            <iframe src={previewSrc} title="Document Preview" className="w-[500px] h-[350px]" />
          ) : (
            <div className="relative">
              <img src={previewSrc || undefined} alt="Preview" className="w-[500px] h-[350px] rounded-lg" />

              <div className="absolute -top-10 right-3 bg-white p-2 rounded-full shadow-md">
                <a href={previewSrc || undefined} download className="flex items-center text-blue-600">
                  <FaDownload size={10} />
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeDetailsCard;
