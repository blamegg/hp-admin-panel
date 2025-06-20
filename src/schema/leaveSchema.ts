import { z } from "zod"

export const leaveSchema = z.object({
  name: z.string().min(1, "Leave name is required"),
  description: z.string().optional(),
  half_day_allowed: z.boolean().optional(),
  paid:z.boolean().optional()
})

export type CreateLeaveFormInput = z.infer<typeof leaveSchema>;