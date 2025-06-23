import { z } from "zod"

export const leaveSchema = z.object({
  name: z.string().min(1, "Leave name is required"),
  description: z.string().optional(),
  half_day_allowed: z.boolean().optional(),
  paid:z.boolean().optional()
})

export type CreateLeaveFormInput = z.infer<typeof leaveSchema>;

export const leaveFormSchema = z.object({
  leave_type: z.string().min(1, "Leave type is required"),
  leave_mode: z.enum(["Half-Day", "Full-Day", "Day-Range", "Multi-Days"], { required_error: "Leave mode is required" }),
  start_date: z.any().refine((val) => val && typeof val === 'object' && val.isValid && val.isValid(), { message: "Start date is required" }),
  end_date: z.any().optional().refine((val) => !val || (typeof val === 'object' && val.isValid && val.isValid()), { message: "End date is invalid" }),
  description: z.string().optional(),
  dates: z.array(z.any()).optional(),
  half_day_session: z.string().optional(),
}).refine((data) => {
  if ((data.leave_mode === "Day-Range" || data.leave_mode === "Multi-Days") && !data.end_date) return false;
  return true;
}, {
  message: "End date is required for Day-Range or Multi-Days",
  path: ["end_date"],
}).refine((data) => {
  if (data.leave_mode === "Half-Day" && !data.half_day_session) return false;
  return true;
}, {
  message: "Session is required for Half-Day",
  path: ["half_day_session"],
});

export type LeaveFormInputs = z.infer<typeof leaveFormSchema>;