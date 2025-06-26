import { z } from "zod"

export const leaveSchema = z.object({
  name: z.string().min(1, "Leave name is required"),
  description: z.string().optional(),
  half_day_allowed: z.boolean().optional(),
  paid:z.boolean().optional()
})


export const leaveFormSchema = z.object({
  leave_type: z.string().min(1, "Leave type is required"),
  leave_mode: z.enum(["Half-Day", "Full-Day", "Day-Range", "Multi-Days"], {
    required_error: "Leave mode is required",
  }),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  description: z.string().optional(),
  dates: z.array(z.string().min(1, "Date is required")).optional(),
  half_day_session: z.string().optional(),
})
.refine((data) => {
  if (data.leave_mode === "Day-Range" && !data.end_date) return false;
  return true;
}, {
  message: "End date is required for Day-Range",
  path: ["end_date"],
})
.refine((data) => {
  if (data.leave_mode === "Half-Day" && !data.half_day_session) return false;
  return true;
}, {
  message: "Session is required for Half-Day",
  path: ["half_day_session"],
})
.refine((data) => {
  if (data.leave_mode === "Multi-Days" && (!data.dates || data.dates.length === 0)) return false;
  return true;
}, {
  message: "At least one date is required for Multi-Days",
  path: ["dates"],
});


export type LeaveFormInputs = z.infer<typeof leaveFormSchema>;
export type CreateLeaveFormInput = z.infer<typeof leaveSchema>;
