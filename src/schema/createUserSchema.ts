import { z } from "zod";

export const userSchema = z.object({
  // firstName: z.string().min(1, "First name is required"),
  // lastName: z.string().min(1, "Last name is required"),
  name: z.string().min(1, "Full name is required"),
  // username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  mobile: z.string().min(10, "Phone number must be at least 10 digits"),
  // direction: z.enum(["ltr", "rtl"], {
  //   errorMap: () => ({ message: "Please select a direction" }),
  // }),
  // notifications: z.enum(["email", "sms", "push", "none"], {
  //   errorMap: () => ({ message: "Please select a notification preference" }),
  // }),
  // fontSize: z.enum(["small", "medium", "large"], {
  //   errorMap: () => ({ message: "Please select a font size" }),
  // }),
  // theme: z.enum(["light", "dark"], {
  //   errorMap: () => ({ message: "Please select a theme" }),
  // }),
  // customMessage: z.string().optional(),
  // companyName: z.string().min(1, "Company name is required"),
  // companyEmail: z.string().email("Invalid company email"),
  // companyPhone: z
  //   .string()
  //   .min(10, "Company phone number must be at least 10 digits"),
  // companyAddress: z.string().min(1, "Company address is required"),
  // companyWebsite: z.string().min(1, "Company website is required"),
  // companyDescription: z.string().min(1, "Company description is required"),
});

export type UserFormInputs = z.infer<typeof userSchema>;
