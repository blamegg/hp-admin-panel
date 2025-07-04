'use client'
import ModalHeader from '@/components/common/ModalHeader'
import { AppliedLeave, fetchTakenLeaves } from '@/redux/slice/leaves/leaveSclice';
import { Drawer } from '@mui/material'
import React, { useState } from 'react'
import Button from '../../common/Button';
import { deleteLeaveFn } from '@/utility/queryFetcher';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { AiOutlineDelete } from 'react-icons/ai';
import { ImSpinner2 } from 'react-icons/im';

interface DeleteTakenLeaveProps {
  toggleDrawer: (open: boolean) => void;
  isDeleteTakenLeaveDrawerShowing: boolean;
  selectedLeave: AppliedLeave | null;
}

const DeleteTakenLeaveDrawer = ({ toggleDrawer, isDeleteTakenLeaveDrawerShowing, selectedLeave }: DeleteTakenLeaveProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!selectedLeave) return;
    setLoading(true);
    try {
      await deleteLeaveFn(selectedLeave._id);
      toast.success('Leave deleted successfully');
      // @ts-ignore
      dispatch(fetchTakenLeaves());
      toggleDrawer(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete leave');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    toggleDrawer(false);
  };

  return (
    <Drawer 
        anchor='right' 
        open={isDeleteTakenLeaveDrawerShowing} 
        onClose={handleClose}
        PaperProps={{ sx: { width: "30%" } }}
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
                    You are about to delete a Leave Application
                </h2>
                <h3 className="mt-2 text-center text-[18px] font-semibold text-[#8D8D8D]">
                    Are you sure you want to delete this leave for <strong className="text-black dark:text-white">{selectedLeave?.user_details?.name || 'this user'}</strong>?
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
  )
}

export default DeleteTakenLeaveDrawer

