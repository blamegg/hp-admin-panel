import React from 'react';
import Drawer from '@mui/material/Drawer';
import ModalHeader from '@/components/common/ModalHeader';
import Button from '@/components/common/Button';
import DetailItem from '@/components/common/DetailItem';

interface HolidayDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  holiday: any; // Should be typed
}

const HolidayDetailsDrawer: React.FC<HolidayDetailsDrawerProps> = ({ open, onClose, holiday }) => {
  if (!holiday) return null;
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: '30%' } }}
    >
      <ModalHeader text="Holiday Details" toggleDrawer={onClose} />
      <div className="p-6 space-y-4 pb-24">
        <DetailItem label='Type' value={holiday.type || holiday.holiday_type?.name || holiday.holiday_type}/>
        <DetailItem label='Title' value={holiday.title}/>
        <DetailItem label='Dates' value={holiday.dates ? holiday.dates.join(', ') : (holiday.start ? holiday.start.toLocaleDateString() : '')}/>
        {holiday.description && (
        <DetailItem label='Description' value={holiday.description}/>
        )}
      </div>
      <div className="flex justify-end items-center gap-2 absolute bottom-0 h-[60px] w-full pr-8 border-t-2 border-gray">
        <Button
          type="button"
          name="Close"
          className="bg-graydark"
          onClick={onClose}
        />
      </div>
    </Drawer>
  );
};

export default HolidayDetailsDrawer; 