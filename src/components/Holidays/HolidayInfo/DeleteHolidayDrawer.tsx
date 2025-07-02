import React from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@/components/common/Button';
import ModalHeader from '@/components/common/ModalHeader';
import { AiOutlineDelete } from 'react-icons/ai';
import { ImSpinner2 } from 'react-icons/im';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { deleteHoliday, fetchHolidays } from '@/redux/slice/holidaySlice';
import { toast } from 'sonner';

interface DeleteHolidayDrawerProps {
  open: boolean;
  onClose: () => void;
  holiday: any; // Should be typed
}

const DeleteHolidayDrawer: React.FC<DeleteHolidayDrawerProps> = ({
  open,
  onClose,
  holiday,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    if (!holiday?._id) return;
    setLoading(true);
    try {
      await dispatch(deleteHoliday(holiday._id)).unwrap();
      dispatch(fetchHolidays());
      toast.success('Holiday deleted successfully!');
      onClose();
    } catch (error: any) {
      console.log(error)
      toast.error(error?.message || 'Failed to delete holiday.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: '30%' } }}
    >
      <div role="presentation">
        <ModalHeader text="Delete Confirmation" toggleDrawer={onClose} />
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
              You are about to delete a Holiday
            </h2>
            <h3 className="mt-2 text-center text-[18px] font-semibold text-[#8D8D8D]">
              Are you sure you want to delete <strong className="text-black dark:text-white">{holiday?.title}</strong>?
            </h3>
            <div className='flex justify-end items-center gap-2 absolute bottom-0 h-[60px] w-full pr-8 border-t-2 border-gray'>
              <Button 
                type="button" 
                name="Close" 
                className="mr-4 bg-graydark"  
                onClick={onClose} 
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

export default DeleteHolidayDrawer; 