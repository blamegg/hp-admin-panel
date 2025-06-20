import { Drawer } from '@mui/material';
import React, { useState } from 'react'
import ModalHeader from '../common/ModalHeader'
import Button from '../common/Button';
import Input from '../common/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateLeaveFormInput, leaveSchema } from '@/schema/leaveSchema';
import { createLeaveFn } from '@/utility/queryFetcher';
import { toast } from 'sonner';
import CheckboxFour from '../Checkboxes/CheckboxFour';
import Textarea from '../common/Input/Textarea';
import { Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateLeaveInferFace {
    open: boolean;
    toggleDrawer: (open: boolean) => void;
    direction: string;
    fetchLeaves: () => void;
}

const CreateLeave = ({ open, toggleDrawer, direction, fetchLeaves }: CreateLeaveInferFace) => {

    const { register, handleSubmit, reset, formState: { errors }, control } = useForm({
        resolver: zodResolver(leaveSchema),
        mode: "onSubmit",
        defaultValues: { name: "", paid: false, half_day_allowed: false, description: "" }
    })
    const handleClose = () => {
        toggleDrawer(false);
        reset();
    }

    const queryClient = useQueryClient();

    const createLeaveMutation = useMutation({
        mutationFn: (payload: CreateLeaveFormInput) => createLeaveFn(payload),
        onSuccess: () => {
            reset();
            toast.success("Successfully created leave");
            queryClient.refetchQueries({ queryKey: ["users"] });
            fetchLeaves();
            toggleDrawer(false);
        },
        onError: (error: any) => {
            let errorMessage = error?.response?.data?.message;
            if (typeof errorMessage !== 'string') {
                errorMessage = "unknown error"
            }
            toast.error(errorMessage)
        }
    })

    const handleCreateLeave = (data: CreateLeaveFormInput) => {
        console.log(data);
        createLeaveMutation.mutate({ ...data });
    }

    const [paid, setPaid] = useState(false);
    const [halfDayAllowed, setHalfDayAllowed] = useState(false);

    return (
        <Drawer
            open={open} onClose={handleClose} anchor={direction === 'ltr' ? 'right' : 'left'}
            PaperProps={{
                sx: {
                    width: "30%"
                }
            }}
        >
            <ModalHeader text={"Create Leave"} toggleDrawer={toggleDrawer} />
            <form onSubmit={handleSubmit(handleCreateLeave)} >
                <div className='px-4 mt-4'>
                    <div>
                        <Input
                            type="text"
                            label='Name'
                            register={register('name')}
                            error={errors.name?.message}
                            placeholder='Create leave' />
                    </div>
                    <div className='mt-3'>
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
                    <div className='mt-3'>
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
                    <div className='mt-3'>
                        <Textarea
                            label="Description"
                            placeholder="Write Description"
                            error={errors.description?.message}
                            {...register('description')}
                            rows={6}
                        />
                    </div>
                </div>
                <div className='flex justify-end items-center gap-2 absolute bottom-0 h-[60px] w-full pr-8 border-t-2 border-gray'>
                    <Button type="button" name="Cancel" onClick={handleClose} className="bg-graydark" />
                    <Button type="submit" name=" Create Leave" className="bg-success"></Button>
                </div>
            </form>
        </Drawer >
    )
}

export default CreateLeave