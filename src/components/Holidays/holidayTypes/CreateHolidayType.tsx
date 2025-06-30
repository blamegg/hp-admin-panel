'use client'
import React, { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '../../common/Button';
import Input from '../../common/Input';
import ModalHeader from '../../common/ModalHeader';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { createHolidayType } from '@/redux/slice/holidayTypesSlice';
import { toast } from 'sonner';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { holidayTypeSchema, HolidayTypeFormInputs } from '@/schema/holidaySchema';
import Textarea from '@/components/common/Input/Textarea';
import FormError from '@/components/common/FormError';

interface CreateHolidayTypeProps {
  open: boolean;
  toggleDrawer: (open: boolean) => void;
}

const CreateHolidayType: React.FC<CreateHolidayTypeProps> = ({ open, toggleDrawer }) => {
  const { handleSubmit, formState: { errors, isSubmitting }, setValue, trigger, reset } = useForm<HolidayTypeFormInputs>({
    resolver: zodResolver(holidayTypeSchema),
    mode: 'onChange', // Validate on change
  });

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (open) {
      reset({ name: '', description: '' });
      setName('');
      setDescription('');
    }
  }, [open, reset]);

  const onSubmit: SubmitHandler<HolidayTypeFormInputs> = async (data) => {
    try {
      await dispatch(createHolidayType(data)).unwrap();
      toast.success('Holiday type created successfully!');
      toggleDrawer(false);
    } catch (error: any) {
      toast.error(error || 'Failed to create holiday type.');
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setValue('name', value, { shouldValidate: true });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);
    setValue('description', value);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => toggleDrawer(false)}
      PaperProps={{ sx: { width: '30%' } }}
    >
      <ModalHeader text="Create Holiday Type" toggleDrawer={() => toggleDrawer(false)} />
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div>
          <Input
            label="Holiday Type Name"
            value={name}
            onChange={handleNameChange}
            placeholder="e.g., Public Holiday"
            type="text"
          />
          <FormError error={errors.name?.message} />
        </div>
        <div>
          <Textarea
            label="Description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Enter a short description"
          />
        </div>
        <div className="flex justify-end gap-2 border-t-2 border-gray pt-4">
          <Button
            type="button"
            name="Cancel"
            onClick={() => toggleDrawer(false)}
            className="bg-graydark"
          />
          <Button
            type="submit"
            name={isSubmitting ? 'Creating...' : 'Create'}
            className="bg-success text-white min-w-[100px]"
            disabled={isSubmitting}
            loading={isSubmitting}
          />
        </div>
      </form>
    </Drawer>
  );
};

export default CreateHolidayType; 





