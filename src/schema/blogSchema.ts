import { z } from 'zod';

export const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  categories: z.array(z.string().min(1)).min(1, 'At least one category is required'),
  tags: z.array(z.string().min(1)).min(1, 'At least one tag is required'),
});

export type BlogFormInputs = z.infer<typeof blogSchema>; 