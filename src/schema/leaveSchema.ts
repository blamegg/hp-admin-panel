import { z } from "zod"

export const leaveSchema = z.object({
  name: z.string().min(1, "Leave name is required"),
  description: z.string().optional(),
  half_day_allowed: z.boolean().optional(),
  paid:z.boolean().optional()
})


// export const leaveFormSchema = z.object({
//   leave_type: z.string().min(1, "Leave type is required"),
//   leave_mode: z.enum(["Half-Day", "Full-Day", "Day-Range", "Multi-Days"], {
//     required_error: "Leave mode is required",
//   }),
//   start_date: z.string().min(1, "Start date is required"),
//   end_date: z.string().optional(),
//   description: z.string().optional(),
//   dates: z.array(z.string().min(1, "Date is required")).optional(),
//   half_day_session: z.string().optional(),
// })
// .refine((data) => {
//   if (data.leave_mode === "Day-Range" && !data.end_date) return false;
//   return true;
// }, {
//   message: "End date is required for Day-Range",
//   path: ["end_date"],
// })
// .refine((data) => {
//   if (data.leave_mode === "Half-Day" && !data.half_day_session) return false;
//   return true;
// }, {
//   message: "Session is required for Half-Day",
//   path: ["half_day_session"],
// })
// .refine((data) => {
//   if (data.leave_mode === "Multi-Days" && (!data.dates || data.dates.length === 0)) return false;
//   return true;
// }, {
//   message: "At least one date is required for Multi-Days",
//   path: ["dates"],
// });


export const leaveFormSchema = z.object({
  leave_type: z.string().min(1, "Leave type is required"),
  leave_mode: z.enum(["Half-Day", "Full-Day", "Day-Range", "Multi-Days"]).or(z.literal("")).default(""),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  description: z.string().optional(),
  dates: z.array(z.string().min(1, "Date is required")).default([]),
  half_day_session: z.string().optional(),
})
.refine((data) => {
  // Require leave_mode to be selected
  return data.leave_mode !== "";
}, {
  message: "Leave mode is required",
  path: ["leave_mode"],
})
.refine((data) => {
  // For Multi-Days, dates array is required
  if (data.leave_mode === "Multi-Days") {
    return data.dates.length > 0;
  }
  return true;
}, {
  message: "At least one date is required for Multi-Days",
  path: ["dates"],
})
.refine((data) => {
  // For other modes, start_date is required
  if (data.leave_mode !== "Multi-Days" && data.leave_mode !== "") {
    return !!data.start_date;
  }
  return true;
}, {
  message: "Start date is required for this leave mode",
  path: ["start_date"],
})
.refine((data) => {
  // For Multi-Days, validate that dates array has valid dates
  if (data.leave_mode === "Multi-Days") {
    return data.dates.every(date => date && date.trim() !== "");
  }
  return true;
}, {
  message: "All dates must be selected for Multi-Days",
  path: ["dates"],
})
.refine((data) => {
  return data.leave_mode !== "Day-Range" || !!data.end_date;
}, {
  message: "End date is required for Day-Range",
  path: ["end_date"],
})
.refine((data) => {
  return data.leave_mode !== "Half-Day" || !!data.half_day_session;
}, {
  message: "Session is required for Half-Day",
  path: ["half_day_session"],
});


export type LeaveFormInputs = z.infer<typeof leaveFormSchema>;
export type CreateLeaveFormInput = z.infer<typeof leaveSchema>;
