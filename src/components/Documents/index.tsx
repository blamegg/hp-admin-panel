import React, { useState } from "react";
import { Card, Typography, Grid, Button, TextField } from "@mui/material";
import {
  FaIdCard,
  FaGraduationCap,
  FaFilePdf,
  FaAddressCard,
  FaUserCircle,
  FaPhone,
} from "react-icons/fa";

interface EmployeeDetails {
  name: string;
  aadhaarCard: string;
  marksheet: string;
  cv: string;
  panCard: string;
  graduation: string;
  postGraduation: string;
  address: string;
  phoneNumber: string;
}

const initialEmployeeData: EmployeeDetails = {
  name: "John Doe",
  phoneNumber: "+1-234-567-890",
  panCard: "XXXX-XXXX-XXXX",
  aadhaarCard: "XXXX-XXXX-XXXX",
  marksheet: "link-to-marksheet.pdf",
  cv: "link-to-cv.pdf",
  graduation: "B.Tech in Computer Science",
  postGraduation: "M.Tech in Software Engineering",
  address: "1234 Elm Street, Some City, Some State, 123456",
};

const EmployeeDetailsCard: React.FC = () => {
  const [employeeData, setEmployeeData] = useState<EmployeeDetails>(initialEmployeeData);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: keyof EmployeeDetails, value: string) => {
    setEmployeeData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="flex justify-center items-center py-10">
      <Card elevation={10} className="w-full max-w-3xl bg-white rounded-lg shadow-xl p-6">
        <Typography variant="h6" className="text-center font-semibold mb-6 text-gray-800">
          Employee Details
        </Typography>

        <Grid container spacing={3}>
          {/* Dynamic Fields */}
          {Object.entries(employeeData).map(([key, value]) => (
            <Grid item xs={12} sm={6} key={key}>
              <Card
                className="bg-gray-100 rounded-lg p-4 shadow-md hover:shadow-lg transition-all"
                style={{ height: "80px", display: "flex", alignItems: "center" }}
              >
                <div className="flex items-center w-full">
                  {/* Dynamic Icon */}
                  {key === "name" && <FaUserCircle size={20}className="text-indigo-600 mr-4 " />}
                  {key === "aadhaarCard" && <FaIdCard size={20}className="text-blue-600 mr-4" />}
                  {key === "marksheet" && <FaFilePdf size={20} className="text-green-600 mr-4" />}
                  {key === "cv" && <FaFilePdf size={20} className="text-yellow-600 mr-4" />}
                  {key === "panCard" && <FaIdCard size={20} className="text-red-600 mr-4" />}
                  {key === "graduation" && (
                    <FaGraduationCap size={20} className="text-teal-600 mr-4" />
                  )}
                  {key === "postGraduation" && (
                    <FaGraduationCap size={20} className="text-purple-600 mr-4" />
                  )}
                  {key === "address" && (
                    <FaAddressCard size={20} className="text-gray-600 mr-4" />
                  )}
                  {key === "phoneNumber" && (
                    <FaPhone size={20} className="text-pink-600 mr-4" />
                  )}

                  <div className="flex flex-col justify-center w-full">
                    <Typography
                      className="font-semibold text-gray-800 capitalize"
                      style={{ fontSize: "14px" }} 

                    >
                      {key.replace(/([A-Z])/g, " $1")}
                    </Typography>
                    {isEditing ? (
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={value}
                        onChange={(e) =>
                          handleInputChange(key as keyof EmployeeDetails, e.target.value)
                        }
                      />
                    ) : key === "marksheet" || key === "cv" ? (
                      <Typography variant="h6" className="text-gray-900 font-bold">
                        <a
                          href={value}
                          className="text-blue-600 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View {key === "marksheet" ? "Marksheet" : "CV"}
                        </a>
                      </Typography>
                    ) : (
                      <Typography className="text-gray-900 font-bold text-base">
                        {value} 
                      </Typography>
                    )}
                  </div>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Action Buttons */}
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
    </div>
  );
};

export default EmployeeDetailsCard;
