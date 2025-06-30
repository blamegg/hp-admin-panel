'use client'
import React from 'react';
import Drawer from '@mui/material/Drawer';
import ModalHeader from '../../common/ModalHeader';
import { HolidayType } from '@/redux/slice/holidayTypesSlice';
import Button from '../../common/Button';
import DetailItem from '../../common/DetailItem';

interface ViewHolidayTypeProps {
  open: boolean;
  toggleDrawer: (open: boolean) => void;
  selected: HolidayType | null;
}

const ViewHolidayTypeDrawer: React.FC<ViewHolidayTypeProps> = ({ open, toggleDrawer, selected }) => {
  
  const handleClose = () => {
    toggleDrawer(false);
  };

  if (!selected) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { width: '30%' } }}
    >
      <ModalHeader text="Holiday Type Details" toggleDrawer={handleClose} />
      <div className="p-6 space-y-4">
        <DetailItem label="Holiday Type Name" value={selected.name} />
        <DetailItem label="Description" value={selected.description || 'N/A'} />
      </div>
      <div className="flex justify-end items-center gap-3 absolute bottom-0 h-[70px] w-full pr-2 border-t-2 border-gray">
        <Button
          type="button"
          name="Close"
          onClick={handleClose}
          className="bg-graydark"
        />
      </div>
    </Drawer>
  );
};

export default ViewHolidayTypeDrawer; 