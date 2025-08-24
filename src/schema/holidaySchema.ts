import { z } from "zod";

export const holidayTypeSchema = z.object({
  name: z.string().min(1, "Holiday type name is required"),
  description: z.string().optional(),
});

export type HolidayTypeFormInputs = z.infer<typeof holidayTypeSchema>;