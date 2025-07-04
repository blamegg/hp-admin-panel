import React, { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@/components/common/Button';
import Select from '@/components/common/Select';
import Input from '@/components/common/Input';
import ModalHeader from '@/components/common/ModalHeader';
import Textarea from '@/components/common/Input/Textarea';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { toast } from 'sonner';
import { getHolidayByIdFn, updateHolidayFn } from '@/utility/queryFetcher';
import MultipleDatePicker from '@/components/FormElements/DatePicker/MultipleDatePicker';
import { fetchHolidays } from '@/redux/slice/holiday/holidaySlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { updateHoliday } from '@/redux/slice/holidaySlice'; // To be implemented

interface HolidayTypesListData {
    _id: string;
    name: string;
}

interface EditHolidayDrawerProps {
    open: boolean;
    onClose: () => void;
    holiday: any; // Should be typed to HolidayEvent or Holiday
    holidayTypes: HolidayTypesListData[];
}

const EditHolidayDrawer: React.FC<EditHolidayDrawerProps> = ({ open, onClose, holiday, holidayTypes }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [holidayType, setHolidayType] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dates, setDates] = useState<string[]>([]);
    const queryClient = useQueryClient();


    const updateHolidayMutation = useMutation({
        mutationFn: updateHolidayFn,
        onSuccess: () => {
            toast.success('Holiday updated successfully!');
            dispatch(fetchHolidays())
            queryClient.invalidateQueries(['holidays']);
            onClose();
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to update holiday.');
        }
    });

    useEffect(() => {
        const fetchAndSetHoliday = async () => {
            if (open && holiday && holiday._id) {
                try {
                    const { data: latestHoliday } = await getHolidayByIdFn(holiday._id);
                    console.log(latestHoliday, " Latest HOliday")
                    setHolidayType(latestHoliday.holiday_type?._id || latestHoliday.holiday_type || '');
                    setTitle(latestHoliday.title || '');
                    setDescription(latestHoliday.description || '');
                    setDates(latestHoliday.dates ? latestHoliday.dates.map((d: string) => d.split('T')[0]) : []);
                } catch (err) {
                    // fallback to passed holiday if fetch fails
                    setHolidayType(holiday.holiday_type?._id || holiday.holiday_type || '');
                    setTitle(holiday.title || '');
                    setDescription(holiday.description || '');
                    setDates(holiday.dates ? holiday.dates.map((d: string) => d.split('T')[0]) : []);
                }
            }
        };
        fetchAndSetHoliday();
    }, [open, holiday]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!holiday?._id) return;
        if (!title || !holidayType || dates.length === 0) {
            toast.error('Please fill all required fields.');
            return;
        }
        const payload = { _id: holiday._id, title, description, dates, holiday_type: holidayType, }
        updateHolidayMutation.mutate(payload);
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { width: '30%' } }}
        >
            <ModalHeader text="Edit Holiday" toggleDrawer={onClose} />
            <form id="edit-holiday-form" onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                    <Input
                        label="Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Enter holiday title"
                        type="text"
                    />
                </div>
                <div>
                    <Select
                        label="Holiday Type"
                        options={Array.isArray(holidayTypes) ? holidayTypes.map((type) => ({ value: type._id, label: type.name })) : []}
                        value={holidayType}
                        onChange={e => setHolidayType(e.target.value)}
                    />
                </div>
                <div>
                    <MultipleDatePicker
                        label="Dates"
                        selectedDates={dates.map(date => new Date(date))}
                        onChange={selected => setDates(selected.map(d => d.toISOString().split('T')[0]))}
                    />
                </div>
                <div>
                    <Textarea
                        label="Description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Enter a short description"
                    />
                </div>
            </form>
            <div className="flex justify-end items-center gap-3 absolute bottom-0 h-[70px] w-full pr-2 border-t-2 border-gray">
                <Button
                    type="button"
                    name="Cancel"
                    className="bg-graydark"
                    onClick={onClose}
                />
                <Button
                    type="submit"
                    form="edit-holiday-form"
                    name={updateHolidayMutation.isLoading ? 'Updating...' : 'Update'}
                    className="bg-primary text-white min-w-[100px]"
                    disabled={updateHolidayMutation.isLoading}
                    loading={updateHolidayMutation.isLoading}
                />
            </div>
        </Drawer>
    );
};

export default EditHolidayDrawer; 