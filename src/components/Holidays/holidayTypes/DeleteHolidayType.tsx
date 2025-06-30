'use client'
import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '../../common/Button';
import ModalHeader from '../../common/ModalHeader';
import { HolidayType } from '@/redux/slice/holidayTypesSlice';
import { AiOutlineDelete } from 'react-icons/ai';
import { ImSpinner2 } from 'react-icons/im';

interface DeleteHolidayTypeProps {
  open: boolean;
  toggleDrawer: (open: boolean) => void;
  selectedHolidayType: HolidayType | null;
  handleDelete: () => void;
  loading?: boolean;
}

const DeleteHolidayType: React.FC<DeleteHolidayTypeProps> = ({
  open,
  toggleDrawer,
  selectedHolidayType,
  handleDelete,
  loading
}) => {

  const handleClose = () => {
    toggleDrawer(false);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: "30%",
        },
      }}
    >
      <div role="presentation">
        <ModalHeader text="Delete Confirmation" toggleDrawer={handleClose} />

        <div className="relative flex flex-col items-center justify-center px-7 pb-7 h-[calc(100vh-60px)]">
          {loading && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-75">
              <ImSpinner2 className="animate-spin text-5xl text-red-500" />
              <h3 className="mt-3 text-lg font-semibold text-red-500">
                Deleting...
              </h3>
            </div>
          )}
          <>
            <div className="rounded-full border-[3px] border-black bg-[#FCFCFC] p-2">
              <AiOutlineDelete className="text-red-600 text-[50px]" />
            </div>
            <h2 className="mt-2 text-xl font-semibold text-center">
              You are about to delete a Holiday Type
            </h2>
            <h3 className="mt-2 text-center text-[18px] font-semibold text-[#8D8D8D]">
              Are you sure you want to delete <strong className="text-black dark:text-white">{selectedHolidayType?.name}</strong>?
            </h3>
            
            <div className='flex justify-end items-center gap-2 absolute bottom-0 h-[60px] w-full pr-8 border-t-2 border-gray'>
              <Button 
                type="button" 
                name="Close" 
                className="mr-4 bg-graydark"  
                onClick={handleClose} 
                disabled={loading}
              />
              <Button
                type="button"
                name="Confirm"
                onClick={handleDelete}
                className="bg-danger"
                disabled={loading}
              />
            </div>
          </>
        </div>
      </div>
    </Drawer>
  );
};

export default DeleteHolidayType; 