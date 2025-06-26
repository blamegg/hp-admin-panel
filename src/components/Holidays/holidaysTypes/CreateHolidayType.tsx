import { Drawer } from '@mui/material';
import React from 'react';
import ModalHeader from '../../common/ModalHeader';
import Button from '../../common/Button';
import Input from '../../common/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Textarea from '../../common/Input/Textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const holidayTypeSchema = z.object({
  name: z.string().min(1, 'Holiday type name is required'),
  description: z.string().optional(),
});

type HolidayTypeFormInput = z.infer<typeof holidayTypeSchema>;

interface CreateHolidayTypeProps {
  open: boolean;
  toggleDrawer: (open: boolean) => void;
  direction: string;
  fetchHolidayTypes: () => void;
}

const CreateHolidayType = ({ open, toggleDrawer, direction, fetchHolidayTypes }: CreateHolidayTypeProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<HolidayTypeFormInput>({
    resolver: zodResolver(holidayTypeSchema),
    mode: 'onSubmit',
    defaultValues: { name: '', description: '' },
  });

  const queryClient = useQueryClient();

  // TODO: Replace with your actual API call
  const createHolidayTypeMutation = useMutation({
    mutationFn: async (payload: HolidayTypeFormInput) => {
      // Simulate API call
      await new Promise(res => setTimeout(res, 500));
      return payload;
    },
    onSuccess: () => {
      reset();
      toast.success('Successfully created holiday type');
      queryClient.invalidateQueries(['holidayTypes']);
      fetchHolidayTypes();
      toggleDrawer(false);
    },
    onError: (error: any) => {
      let errorMessage = error?.response?.data?.message;
      if (typeof errorMessage !== 'string') {
        errorMessage = 'unknown error';
      }
      toast.error(errorMessage);
    },
  });

  const handleCreateHolidayType = (data: HolidayTypeFormInput) => {
    createHolidayTypeMutation.mutate({ ...data });
  };

  const handleClose = () => {
    toggleDrawer(false);
    reset();
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      anchor={direction === 'ltr' ? 'right' : 'left'}
      PaperProps={{ sx: { width: '30%' } }}
    >
      <ModalHeader text={'Create Holiday Type'} toggleDrawer={toggleDrawer} />
      <form onSubmit={handleSubmit(handleCreateHolidayType)}>
        <div className='px-4 mt-4'>
          <div>
            <Input
              type='text'
              label='Name'
              register={register('name')}
              error={errors.name?.message}
              placeholder='Create holiday type'
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
          <Button type='submit' name='Create Holiday Type' className='bg-success' loading={createHolidayTypeMutation.isLoading} />
        </div>
      </form>
    </Drawer>
  );
};

export default CreateHolidayType; 