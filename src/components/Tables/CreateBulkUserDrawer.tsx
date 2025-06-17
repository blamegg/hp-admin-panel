"use client";
import { Drawer } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usercover } from "@/assets";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBulkUserFn, createUserFn, } from "@/utility/queryFetcher";
import { UserDrawerProps } from "@/types/CreateUser";
import { UserFormInputs, userSchema } from "@/schema/createUserSchema";
import { toast } from "sonner";
import Image from "next/image";
import Button from "@/components/common/Button";
import Basic from "./UserTab/Basic";
import Company from "./UserTab/Company";
import Personalization from "./UserTab/Personalization";
import ModalHeader from "../common/ModalHeader";
import Input from "../common/Input";


const CreateBulkUserDrawer = ({
  direction,
  isDrawerOpen,
  toggleDrawer,
}: UserDrawerProps) => {
  const [profile, setProfile] = useState<string>("/images/user/user-06.png");
  const [selectedTab, setSelectedTab] = useState<string>("Basic");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<any>(null);
  const queryClient = useQueryClient();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResults(null); // Clear previous results when new file is selected
    }
  };

  const handleSubmit = async (event: React.FormEvent | React.MouseEvent)=>{
    event.preventDefault();
    
    if (!selectedFile) {
      toast.error("Please select a CSV file first");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await createBulkUserFn(formData);
      
      // Store results to display in UI
      if (response.success) {
        setUploadResults(response);
        toast.success("Bulk import completed!");
      } else {
        toast.error("Bulk import failed");
      }
      
      // Refresh the users table by invalidating and refetching the query
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.refetchQueries({ queryKey: ["users"] });
      
    } catch (error: any) {
      console.error("Upload error:", error);
      const errorMessage = error?.response?.data?.message || "Error while uploading file";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }

  const handleClose = () => {
    toggleDrawer(false);
    setSelectedFile(null);
    setUploadResults(null);
  }

  return (
    <Drawer
      anchor={direction === "ltr" ? "right" : "left"}
      open={isDrawerOpen}
      disableEnforceFocus
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: "30%",
        },
      }}
    >
      <div role="presentation">
        <ModalHeader text={"Create Bulk Users"} toggleDrawer={handleClose} />
        <form onSubmit={handleSubmit} className="mt-4 p-3">
          {!uploadResults ? (
            <>
              <div
                id="FileUpload"
                className="p-3 relative mb-5.5 mt-5 block  cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5"
              >
                <input
                  type="file"
                  accept=".csv"
                  className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                        fill="#3C50E0"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                        fill="#3C50E0"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                        fill="#3C50E0"
                      />
                    </svg>
                  </span>
                  <p>
                    <span className="text-primary">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="mt-1.5">CSV</p>
                  <p>(max, 800 X 800px)</p>
                </div>
              </div>
              
              {/* Display selected file name */}
              {selectedFile && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 dark:text-green-400">📄</span>
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Selected File: {selectedFile.name}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Size: {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                      {isUploading && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          ⏳ Uploading...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Upload Results Display */
            <div className="space-y-2 w-full px-4 mt-5 h-[490px] overflow-auto">
              <div className="text-center">
                <div className="mx-auto w-16 h-16  bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                  Bulk Upload Completed
                </h3>
              </div>

              {uploadResults.results && (
                <div className="space-y-4">
                  {/* Summary Statistics */}
                  <div className="bg-gray-50 dark:bg-meta-4 p-4 rounded-lg">
                    <h4 className="font-medium text-black dark:text-white mb-3">Summary</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {uploadResults.results.total}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Total Records</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {uploadResults.results.successful.length}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Successful</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                          {uploadResults.results.failed.length}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Failed</p>
                      </div>
                    </div>
                  </div>

                  {/* Successful Users */}
                  {uploadResults.results.successful.length > 0 && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-3">
                        ✅ Successfully Created Users ({uploadResults.results.successful.length})
                      </h4>
                      <div className="space-y-2">
                        {uploadResults.results.successful.map((user: any, index: number) => (
                          <div key={index} className="flex items-center space-x-2">
                            <span className="text-green-600">•</span>
                            <span className="text-sm text-green-700 dark:text-green-300">
                              {user.name} ({user.email})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Failed Records */}
                  {uploadResults.results.failed.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                      <h4 className="font-medium text-red-800 dark:text-red-200 mb-3">
                        ❌ Failed to Create ({uploadResults.results.failed.length})
                      </h4>
                      <div className="space-y-2">
                        {uploadResults.results.failed.map((failure: any, index: number) => (
                          <div key={index} className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-red-600">•</span>
                              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                                {failure.data.name} ({failure.data.email})
                              </span>
                            </div>
                            <div className="ml-4">
                              <span className="text-xs text-red-600 dark:text-red-400">
                                {failure.errors.join(', ')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </form>
        <div className='flex justify-end items-center gap-2 absolute bottom-0 h-[60px] w-full pr-8 border-t-2 border-gray'>
          <Button type="button" name="Close" className="bg-graydark" onClick={handleClose} />
          {!uploadResults && (
            <Button 
              name={isUploading ? "Uploading..." : "Submit"} 
              type="button" 
              loading={isUploading}
              onClick={handleSubmit}
              className="bg-success"
            />
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default CreateBulkUserDrawer;

