import { Drawer } from '@mui/material';
import React, { useEffect } from 'react';
import ModalHeader from '../../common/ModalHeader';
import Button from '../../common/Button';
import Input from '../../common/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Textarea from '../../common/Input/Textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type HolidayType = { id: number; name: string; description?: string };

const holidayTypeSchema = z.object({
  name: z.string().min(1, 'Holiday type name is required'),
  description: z.string().optional(),
});

type HolidayTypeFormInput = z.infer<typeof holidayTypeSchema>;

interface EditHolidayTypeProps {
  open: boolean;
  toggleDrawer: (open: boolean) => void;
  direction: string;
  selected: HolidayType | null;
  setSelected: (val: HolidayType | null) => void;
  fetchHolidayTypes: () => void;
}

const EditHolidayType = ({ open, toggleDrawer, direction, selected, setSelected, fetchHolidayTypes }: EditHolidayTypeProps) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<HolidayTypeFormInput>({
    resolver: zodResolver(holidayTypeSchema),
    mode: 'onSubmit',
    defaultValues: { name: '', description: '' },
  });

  useEffect(() => {
    if (selected) {
      setValue('name', selected.name || '');
      setValue('description', selected.description || '');
    }
  }, [selected, setValue]);

  const queryClient = useQueryClient();

  // TODO: Replace with your actual API call
  const editHolidayTypeMutation = useMutation({
    mutationFn: async (payload: { id: number } & HolidayTypeFormInput) => {
      // Simulate API call
      await new Promise(res => setTimeout(res, 500));
      return payload;
    },
    onSuccess: () => {
      reset();
      toast.success('Successfully updated holiday type');
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

  const handleEditHolidayType = (data: HolidayTypeFormInput) => {
    if (!selected) return;
    editHolidayTypeMutation.mutate({ id: selected.id, ...data });
  };

  const handleClose = () => {
    toggleDrawer(false);
    setSelected(null);
    reset();
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      anchor={direction === 'ltr' ? 'right' : 'left'}
      PaperProps={{ sx: { width: '30%' } }}
    >
      <ModalHeader text={'Edit Holiday Type'} toggleDrawer={toggleDrawer} />
      <form onSubmit={handleSubmit(handleEditHolidayType)}>
        <div className='px-4 mt-4'>
          <div>
            <Input
              type='text'
              label='Name'
              register={register('name')}
              error={errors.name?.message}
              placeholder='Edit holiday type'
            />
          </div>
          <div className='mt-3'>
            <Textarea
              label='Description'
              placeholder='Write Description'
              error={errors.description?.message}
              {...register('description')}
              rows={6}
            />
          </div>
        </div>
        <div className='flex justify-end items-center gap-2 absolute bottom-0 h-[60px] w-full pr-8 border-t-2 border-gray'>
          <Button type='button' name='Cancel' onClick={handleClose} className='bg-graydark' />
          <Button type='submit' name='Update Holiday Type' className='bg-success' loading={editHolidayTypeMutation.isLoading} />
        </div>
      </form>
    </Drawer>
  );
};

export default EditHolidayType; 