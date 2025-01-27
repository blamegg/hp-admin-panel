import { z } from "zod";

// infer type
export type UserFormInputs = z.infer<typeof userSchema>;
export type EditUserFormInputs = z.infer<typeof editUserSchema>;
export type ViewUserFormInputs = z.infer<typeof viewUserSchema>;

export const userSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  mobile: z.string().min(10, "Phone number must be at least 10 digits"),
});

export const editUserSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  mobile: z.string().min(10, "Phone number must be at least 10 digits"),
});
export const viewUserSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  mobile: z.string().min(10, "Phone number must be at least 10 digits"),
});
