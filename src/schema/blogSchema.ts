import { z } from 'zod';

export const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  categories: z.array(z.string().min(1)).min(1, 'At least one category is required'),
  tags: z.array(z.string().min(1)).min(1, 'At least one tag is required'),
  coverPage: z.any().refine((file)=> file && file.length > 0, {message: "Cover page is required"}),
  coverPageUrl: z.string().optional()
});

export type BlogFormInputs = z.infer<typeof blogSchema>; 