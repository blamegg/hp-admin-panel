import { Drawer } from '@mui/material'
import React from 'react'
import ModalHeader from '../../common/ModalHeader'
import Button from '../../common/Button';
import { Form, useForm } from 'react-hook-form';
import Input from '../../common/Input';
import { useState, useEffect } from 'react';
import { updateLeaveTypeFn } from '@/utility/queryFetcher';
import { toast } from 'sonner';
import CheckboxFour from '../../Checkboxes/CheckboxFour';
import Textarea from '../../common/Input/Textarea';
import { Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface EditLeaveTypeInterface {
  open: boolean;
  toggleDrawer: (open: boolean) => void;
  direction: string;
  selected: any;
  setSelected: React.Dispatch<any>;
  fetchLeaveTypes: () => void;
}

const EditLeaveTypes = ({ open, toggleDrawer, direction, selected, setSelected, fetchLeaveTypes }: EditLeaveTypeInterface) => {
  const { register, handleSubmit, reset, formState: { errors }, control } = useForm({ defaultValues: selected });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (selected) {
      reset(selected);
    }
  }, [selected, reset]);

  const updateLeaveTypeMutation = useMutation({
    mutationFn: (data: any) => updateLeaveTypeFn(data, selected._id),
    onSuccess: (data, variables) => {
      toast.success(`Leave ${variables.name} updated successfully.`);
      fetchLeaveTypes();
      handleClose();
    },
    onError: (error: any) => {
      let errorMessage = error?.response?.data?.message || error?.message || 'Failed to update leave';
      toast.error(errorMessage);
    }
  });

  const onSubmit = (data: any) => {
    if (!selected) return;
    updateLeaveTypeMutation.mutate(data);
  };

  const handleClose = () => {
    toggleDrawer(false);
    setSelected(null);
    reset();
  };

  return (
    <Drawer open={open} onClose={handleClose}
      anchor={direction === 'ltr' ? 'right' : 'left'}
      PaperProps={{
        sx: {
          width: "30%"
        }
      }}
    >
      <ModalHeader text="Edit Leave" toggleDrawer={toggleDrawer} />
      <form onSubmit={handleSubmit(onSubmit)} >
        <div className='px-4 mt-4'>
          <div>
            <Input
              type="text"
              label='Name'
              register={register('name')}
              error={typeof errors.name?.message === 'string' ? errors.name.message : undefined}
              placeholder='Create leave' />
          </div>
          <div className='mt-3'>
            <Input
              type="number"
              label='Total days allowed'
              register={register('total_days_allowed', { valueAsNumber: true })}
              error={typeof errors.total_days_allowed?.message === 'string' ? errors.total_days_allowed.message : undefined}
              placeholder='Enter number of days'
            />
          </div>
          <div className='mt-3 flex justify-start gap-4 items-center'>

            <div className=''>
              <Controller
                name="paid"
                control={control}
                render={({ field }) => (
                  <CheckboxFour
                    label="Paid"
                    id="paid"
                    checked={field.value}
                    onChange={() => field.onChange(!field.value)}
                  />
                )}
              />
            </div>
            <div className=''>
              <Controller
                name="monthly"
                control={control}
                render={({ field }) => (
                  <CheckboxFour
                    label="Monthly"
                    id="monthly"
                    checked={field.value}
                    onChange={() => field.onChange(!field.value)}
                  />
                )}
              />
            </div>
            <div className=''>
              <Controller
                name="half_day_allowed"
                control={control}
                render={({ field }) => (
                  <CheckboxFour
                    label="Half day"
                    id="half-day"
                    checked={field.value}
                    onChange={() => field.onChange(!field.value)}
                  />
                )}
              />
            </div>
          </div>

          <div className='mt-3'>
            <Textarea
              label="Description"
              placeholder="Write Description"
              error={typeof errors.description?.message === 'string' ? errors.description.message : undefined}
              {...register('description')}
              rows={6}
            />
          </div>
        </div>
        <div className="flex justify-end items-center gap-2 absolute bottom-0 h-[60px] w-full pr-8 border-t-2 border-gray">
          <Button name='Close' type='button' className='bg-graydark' onClick={handleClose} />
          <Button name={updateLeaveTypeMutation.isPending ? 'Updating...' : 'Update'} type='submit' className='bg-success' disabled={updateLeaveTypeMutation.isPending} />
        </div>
      </form>
    </Drawer>
  )
}

export default EditLeaveTypes;