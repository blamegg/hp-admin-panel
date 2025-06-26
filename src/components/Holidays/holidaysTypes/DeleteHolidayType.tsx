import { Drawer } from '@mui/material';
import React from 'react';
import ModalHeader from '../../common/ModalHeader';
import Button from '../../common/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type HolidayType = { id: number; name: string; description?: string };

interface DeleteHolidayTypeProps {
  open: boolean;
  toggleDrawer: (open: boolean) => void;
  selected: HolidayType | null;
  setSelected: (val: HolidayType | null) => void;
  fetchHolidayTypes: () => void;
}

const DeleteHolidayType = ({ open, toggleDrawer, selected, setSelected, fetchHolidayTypes }: DeleteHolidayTypeProps) => {
  const queryClient = useQueryClient();

  // TODO: Replace with your actual API call
  const deleteHolidayTypeMutation = useMutation({
    mutationFn: async (id: number) => {
      // Simulate API call
      await new Promise(res => setTimeout(res, 500));
      return id;
    },
    onSuccess: () => {
      toast.success('Successfully deleted holiday type');
      queryClient.invalidateQueries(['holidayTypes']);
      fetchHolidayTypes();
      toggleDrawer(false);
      setSelected(null);
    },
    onError: (error: any) => {
      let errorMessage = error?.response?.data?.message;
      if (typeof errorMessage !== 'string') {
        errorMessage = 'unknown error';
      }
      toast.error(errorMessage);
    },
  });

  const handleDelete = () => {
    if (!selected) return;
    deleteHolidayTypeMutation.mutate(selected.id);
  };

  const handleClose = () => {
    toggleDrawer(false);
    setSelected(null);
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      anchor={'right'}
      PaperProps={{ sx: { width: '30%' } }}
    >
      <ModalHeader text={'Delete Holiday Type'} toggleDrawer={toggleDrawer} />
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-danger">Are you sure you want to delete this holiday type?</h2>
        {selected && (
          <p className="mb-6">{selected.name}</p>
        )}
        <div className="flex gap-4">
          <Button type="button" name="Cancel" className="bg-graydark" onClick={handleClose} />
          <Button type="button" name={deleteHolidayTypeMutation.isLoading ? "Deleting..." : "Delete"} className="bg-danger" onClick={handleDelete} disabled={deleteHolidayTypeMutation.isLoading} />
        </div>
      </div>
    </Drawer>
  );
};

export default DeleteHolidayType; 