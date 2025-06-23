import React, { useState } from "react";
import {
    Card,
    Typography,
    Grid,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    FormHelperText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leaveFormSchema, LeaveFormInputs } from "@/schema/leaveSchema";
import { toast } from "sonner";
import { applyLeaveFn } from "@/utility/queryFetcher";
import Button from "../common/Button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

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
    start_date: null,
    end_date: null,
    description: "",
    dates: [],
    half_day_session: "",
};

interface LeaveFormProps {
    onBack?: () => void;
}

const LeaveForm: React.FC<LeaveFormProps> = ({ onBack }) => {
    const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<LeaveFormInputs>({
        resolver: zodResolver(leaveFormSchema),
        defaultValues,
    });
    const leave_mode = watch("leave_mode");
    const [loading, setLoading] = useState(false);
    const leaveTypes = useSelector((state: RootState) => state.leaveTypes.leaveTypes);

    const onSubmit = async (data: LeaveFormInputs) => {
        setLoading(true);
        try {
            // Prepare payload for applyLeaveFn
            const payload = {
                leave_type: data.leave_type,
                leave_mode: data.leave_mode,
                start_date: data.start_date ? dayjs(data.start_date).format("YYYY-MM-DD") : null,
                end_date: data.end_date ? dayjs(data.end_date).format("YYYY-MM-DD") : null,
                description: data.description,
                dates: data.dates ? data.dates.map((d) => dayjs(d).format("YYYY-MM-DD")) : [],
                half_day_session: data.half_day_session,
            };

            const response = await applyLeaveFn(payload);
            console.log("resp", response);
            toast.success(response.message);
            onBack?.();
            reset();
        } catch (err: any) {
            toast.error(err?.message || "Failed to submit leave application");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card elevation={8} className="w-full max-w-2xl bg-white rounded-lg p-6">
            <Typography variant="h6" className="text-center font-semibold mb-7 text-gray-800 py-2">
                Apply for Leave
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="leave_type"
                            control={control}
                            render={({ field }) => (
                                <FormControl>
                                    <InputLabel>Leave Type</InputLabel>
                                    <Select  {...field} label="Leave Type" >
                                        {leaveTypes.map(type => (
                                            <MenuItem key={type._id} value={type._id}>{type.name}</MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>{typeof errors.leave_type?.message === 'string' ? errors.leave_type.message : ''}</FormHelperText>

                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Controller
                            
                            name="leave_mode"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.leave_mode}>
                                    <InputLabel>Leave Mode</InputLabel>
                                    <Select
                                        {...field}
                                        label="Leave Mode"
                                        style={{width:'300px'}}
                                    >
                                        {LEAVE_MODES.map((mode) => (
                                            <MenuItem key={mode.value} value={mode.value}>{mode.label}</MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>{typeof errors.leave_mode?.message === 'string' ? errors.leave_mode.message : ''}</FormHelperText>
                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="start_date"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    label="Start Date"
                                    value={field.value}
                                    onChange={field.onChange}
                                    slotProps={{ textField: { fullWidth: true, error: !!errors.start_date, helperText: typeof errors.start_date?.message === 'string' ? errors.start_date.message : '' } }}
                                />
                            )}
                        />
                    </Grid>
                    {(leave_mode === "Day-Range" || leave_mode === "Multi-Days") && (
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="end_date"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        label="End Date"
                                        value={field.value}
                                        onChange={field.onChange}
                                        slotProps={{ textField: { fullWidth: true, error: !!errors.end_date, helperText: typeof errors.end_date?.message === 'string' ? errors.end_date.message : '' } }}
                                    />
                                )}
                            />
                        </Grid>
                    )}
                    {leave_mode === "Half-Day" && (
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="half_day_session"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.half_day_session}>
                                        <InputLabel>Session</InputLabel>
                                        <Select
                                            {...field}
                                            label="Session"
                                        >
                                            {HALF_DAY_SESSIONS.map((session) => (
                                                <MenuItem key={session.value} value={session.value}>{session.label}</MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{typeof errors.half_day_session?.message === 'string' ? errors.half_day_session.message : ''}</FormHelperText>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Description"
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    helperText={typeof errors.description?.message === 'string' ? errors.description.message : ''}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
                <div className=" mt-4 w-full text-center flex justify-center items-center gap-4">

                    <Button type="button" name="Back to overview" className="bg-graydark" onClick={onBack} />
                    <Button
                        name={loading ? "Submitting..." : "Submit"}
                        type="submit"
                        className="bg-success font-medium "
                        disabled={loading}
                    />
                </div>
            </form>
        </Card>
    );
};

export default LeaveForm;