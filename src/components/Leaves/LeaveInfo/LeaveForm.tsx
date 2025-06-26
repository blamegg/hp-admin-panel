import React, { useState } from "react";
import { Drawer } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leaveFormSchema, LeaveFormInputs } from "@/schema/leaveSchema";
import { toast } from "sonner";
import { applyLeaveFn } from "@/utility/queryFetcher";
import Button from "../../common/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Textarea from "../../common/Input/Textarea";
import Select from "../../common/Select";
import Input from "../../common/Input";
import ModalHeader from "@/components/common/ModalHeader";
import { fetchTakenLeaves } from "@/redux/slice/takenLeaveSclice";
import { FaPlus, FaTrash } from 'react-icons/fa';

const LEAVE_MODES = [
    { value: "Half-Day", label: "Half-Day" },
    { value: "Full-Day", label: "Full-Day" },
    { value: "Day-Range", label: "Day-Range" },
    { value: "Multi-Days", label: "Multi-Days" },
];

const HALF_DAY_SESSIONS = [
    { value: "Morning", label: "Morning" },
    { value: "Afternoon", label: "Afternoon" },
];

const defaultValues: LeaveFormInputs = {
    leave_type: "",
    leave_mode: "Full-Day",
    start_date: "",
    end_date: "",
    description: "",
    dates: [],
    half_day_session: "",
};

interface LeaveFormProps {
    isLeaveFormShowing: boolean;
    toggleDrawer: (value: boolean) => void;
}

const LeaveForm: React.FC<LeaveFormProps> = ({ isLeaveFormShowing, toggleDrawer }) => {
    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<LeaveFormInputs>({
        resolver: zodResolver(leaveFormSchema),
        defaultValues,
    });
    const leave_mode = watch("leave_mode");
    const [loading, setLoading] = useState(false);
    const leaveTypes = useSelector((state: RootState) => state.leaveTypes.leaveTypes);
    const dispatch = useDispatch<AppDispatch>();
    const dates = watch('dates');

    React.useEffect(() => {
        if (leave_mode === "Multi-Days" && (!dates || dates.length === 0)) {
            setValue("dates", [""]);
        }
    }, [leave_mode, dates, setValue]);


    // Add a new date input
    const handleAddDate = () => {
        const currentDates = watch('dates');
        if (!currentDates || currentDates.length === 0) {
            setValue('dates', ['']);
        } else {
            setValue('dates', [...currentDates, '']);
        }
    };

    // Remove a date input
    const handleRemoveDate = (idx: number) => {
        setValue('dates', dates.filter((_: any, i: number) => i !== idx));
    };
    // Update a specific date
    const handleDateChange = (idx: number, value: string) => {
        const newDates = [...dates];
        newDates[idx] = value;
        setValue('dates', newDates);
    };

    const onSubmit = async (data: LeaveFormInputs) => {
        console.log("clicked")
        console.log(data)
        setLoading(true);
        try {
            const payload = { ...data};
            const response = await applyLeaveFn(payload);
            toast.success(response.message);
            dispatch(fetchTakenLeaves());
            reset();
            toggleDrawer(false);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to submit leave application");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center">
            <Drawer anchor="right" open={isLeaveFormShowing} onClose={() => toggleDrawer(false)}>
                <ModalHeader text="Apply for Leave" toggleDrawer={() => toggleDrawer(false)} />
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6  mt-6">
                    <div className="flex flex-wrap gap-4 px-4">
                        <div className="md:flex items-center justify-between gap-10 w-full ">
                            <div className="w-full">
                                <Select
                                    label="Leave Type"
                                    options={leaveTypes.map(type => ({ value: type._id, label: type.name }))}
                                    register={register("leave_type")}
                                    error={errors.leave_type?.message}
                                />
                            </div>
                            <div className="w-full mt-2 md:mt-0">
                                <Select
                                    label="Leave Mode"
                                    options={LEAVE_MODES}
                                    register={register("leave_mode")}
                                    error={errors.leave_mode?.message}
                                />
                            </div>
                        </div>
                        {/* Date selection logic */}
                        {leave_mode === "Multi-Days" ? (
                            <div className="w-full">
                                <label className="block font-medium text-gray-700 mb-1">Select Dates</label>
                                <div className="flex flex-col gap-2">
                                    {(dates && dates.length > 0 ? dates : ['']).map((date: string, idx: number) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <input
                                                type="date"
                                                value={date}
                                                onChange={e => handleDateChange(idx, e.target.value)}
                                                className="border border-blue-200 rounded px-2 py-1"
                                                required
                                            />
                                            {dates.length > 1 && (
                                                <button type="button" onClick={() => handleRemoveDate(idx)} className="text-danger"><FaTrash /></button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={handleAddDate} className="flex items-center gap-1 text-blue-600 mt-2"><FaPlus /> Add Date</button>
                                </div>
                                {errors.dates?.message && <p className="text-danger text-xs mt-1">{errors.dates.message as string}</p>}
                            </div>
                        ) : (
                            <div className={`md:flex items-center justify-between gap-10  ${leave_mode === "Full-Day" ? 'md:w-1/2 md:pr-4.5 w-full' : 'w-full'} `}>
                                <div className="w-full">
                                    <Input
                                        label="Start Date"
                                        type="date"
                                        register={register("start_date")}
                                        error={errors.start_date?.message}
                                        placeholder="Select start date"
                                        aria-invalid={!!errors.start_date}
                                    />
                                </div>
                                {(leave_mode === "Day-Range") && (
                                    <div className="w-full transition-all duration-200 mt-2 md:mt-0">
                                        <Input
                                            label="End Date"
                                            type="date"
                                            register={register("end_date")}
                                            error={errors.end_date?.message}
                                            placeholder="Select end date"
                                            aria-invalid={!!errors.end_date}
                                        />
                                    </div>
                                )}
                                {leave_mode === "Half-Day" && (
                                    <div className="w-full transition-all duration-200 mt-2 md:mt-0">
                                        <Select
                                            label="Session"
                                            options={HALF_DAY_SESSIONS}
                                            register={register("half_day_session")}
                                            error={errors.half_day_session?.message}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="w-full">
                            <Textarea
                                label="Description"
                                value={watch("description")}
                                onChange={e => setValue("description", e.target.value)}
                                error={errors.description?.message}
                                placeholder="Describe your leave reason (optional)"
                                rows={3}
                                aria-invalid={!!errors.description}
                            />
                        </div>
                    </div>
                    <div className='flex justify-end items-center gap-2 absolute bottom-0 h-[60px] w-full pr-8 border-t-2 border-gray'>
                        <Button type="button" name="Cancel" className="bg-graydark" onClick={() => toggleDrawer(false)} />
                        <Button
                            name={loading ? "Submitting..." : "Submit"}
                            type="submit"
                            className="bg-success font-medium min-w-[120px]"
                            disabled={loading}
                            loading={loading}
                        />
                    </div>
                </form>
            </Drawer>
        </div>
    );
};

export default LeaveForm;