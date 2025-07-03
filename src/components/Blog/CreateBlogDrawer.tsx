import { Drawer } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ModalHeader from '../common/ModalHeader'
import Button from '../common/Button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { createBlog } from '@/redux/slice/blogSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogSchema, BlogFormInputs } from '@/schema/blogSchema';
import Input from '../common/Input';
import Select from '../common/Select';
import BlogEditor from './BlogEditor';
import { toast } from 'sonner';

interface CreateBlogProps {
  isCreateBlogDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
}

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
];

const categoriesList = [
  { value: 'Tech', label: 'Tech' },
  { value: 'News', label: 'News' },
  { value: 'Tutorial', label: 'Tutorial' },
  { value: 'Opinion', label: 'Opinion' },
  { value: 'Review', label: 'Review' },
  { value: 'Other', label: 'Other' },
];
const tagsList = [
  { value: 'React', label: 'React' },
  { value: 'Next.js', label: 'Next.js' },
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'UI', label: 'UI' },
  { value: 'Backend', label: 'Backend' },
  { value: 'Frontend', label: 'Frontend' },
  { value: 'API', label: 'API' },
  { value: 'Blog', label: 'Blog' },
];

const defaultValues: BlogFormInputs = {
  title: '',
  content: '',
  url: '',
  categories: [],
  tags: [],
};

const CreateBlogDrawer = ({ isCreateBlogDrawerOpen, toggleDrawer }: CreateBlogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { register, getValues, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<BlogFormInputs>({
    resolver: zodResolver(blogSchema),
    defaultValues,
  });

  const [categoryInput, setCategoryInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const categories = watch('categories');
  const tags = watch('tags');

  const handleAddCategory = () => {
    const value = categoryInput.trim();
    if (!value) return;
    if (categories.includes(value)) return;
    setValue('categories', [...categories, value], { shouldValidate: true });
    setCategoryInput('');
  };
  const handleRemoveCategory = (cat: string) => {
    setValue('categories', categories.filter((c: string) => c !== cat), { shouldValidate: true });
  };
  const handleAddTag = () => {
    const value = tagInput.trim();
    if (!value) return;
    if (tags.includes(value)) return;
    setValue('tags', [...tags, value], { shouldValidate: true });
    setTagInput('');
  };
  const handleRemoveTag = (tag: string) => {
    setValue('tags', tags.filter((t: string) => t !== tag), { shouldValidate: true });
  };

  const onSubmit = async (data: BlogFormInputs) => {
    console.log('CreateBlog data (onSubmit):', data);
    try {
      const resultAction = await dispatch(createBlog(data) as any);
      // Check for error
      if (createBlog.rejected.match(resultAction)) {
        toast.error(resultAction.payload || 'Failed to create blog');
        console.error('CreateBlog error:', resultAction.payload);
      } else {
        toast.success('Blog created successfully');
        reset();
        toggleDrawer(false);
      }
    } catch (err) {
      toast.error('Unexpected error creating blog');
      console.error('Unexpected error:', err);
    }
  };

  return (
    <Drawer
      anchor='right'
      open={isCreateBlogDrawerOpen}
      onClose={() => toggleDrawer(false)}
      PaperProps={{ sx: { width: { xs: '100vw', sm: 400, md: 500 }, display: 'flex', flexDirection: 'column', height: '100%' } }}
    >
      <ModalHeader text='Create Blog' toggleDrawer={() => toggleDrawer(false)} />
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-1 p-4 flex-1 overflow-y-auto' id="blog-create-form">

        <Input
          label='Title'
          placeholder='Enter blog title'
          type='text'
          register={register('title')}
          error={errors.title?.message}
        />
        <div className='mb-2'>
          <div className='flex items-end gap-3 w-full'>
            <div className='w-full'>
              <Input
                label='Categories'
                placeholder='Add category'
                type='text'
                value={categoryInput}
                onChange={e => setCategoryInput(e.target.value)}
                className='flex-1'
              />
            </div>
            <Button type='button' name='Add' onClick={handleAddCategory} className='bg-primary/85' />
          </div>
          <div className=''>
            <div className=' my-1  mb-1'>
              {categories.length > 1 && (
                <div className='text-xs flex flex-wrap gap-2'>
                  <span >Selected ({categories.length})</span>
                  <span className='text-danger underline cursor-pointer' onClick={() => setValue('categories', [], { shouldValidate: true })} >delete all</span>
                </div>
              )}
            </div>
            <div className='flex flex-wrap gap-2 '>
              {categories.map((cat: string) => (
                <span key={cat} className='flex items-center bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium'>
                  {cat}
                  <button type='button' className='ml-1 text-red-500 hover:text-red-700' onClick={() => handleRemoveCategory(cat)}>&times;</button>
                </span>
              ))}
            </div>
          </div>
          {errors.categories?.message && <p className='text-danger text-xs '>{errors.categories.message as string}</p>}
        </div>
        <div className=''>
          <div className='flex items-end gap-3 w-full'>
            <div className='w-full'>
              <Input
                label='Tags'
                placeholder='Add tag'
                type='text'
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                className='flex-1'
              />
            </div>
            {/* <div>

            </div> */}
            <Button type='button' name='Add' className='bg-primary/85' onClick={handleAddTag} />
          </div>
          <div className='my-1 '>
            {tags.length > 1 && (
              <div className='text-xs flex flex-wrap gap-2'>
                <span>Selected ({tags.length})</span>
                <span className=' text-danger underline cursor-pointer' onClick={() => setValue('tags', [], { shouldValidate: true })} >delete all</span>
              </div>
            )}
          </div>
          <div className='flex flex-wrap gap-2 '>
            {tags.map((tag: string) => (
              <span key={tag} className='flex items-center bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium'>
                {tag}
                <button type='button' className='ml-1 text-red-500 hover:text-red-700' onClick={() => handleRemoveTag(tag)}>&times;</button>
              </span>
            ))}
          </div>

          {errors.tags?.message && <p className='text-danger text-xs mt-1'>{errors.tags.message as string}</p>}
        </div>

        <div className='mb-0 p-0'>
          <label className='block text-xs font-medium text-black dark:text-white'>Content</label>
          <div className="w-full rounded  focus-visible:outline-none dark:border-strokedar dark:focus-within:border-primary transition-all duration-200 bg-gray text-black dark:bg-meta-4 dark:text-white border-stroke">
            <BlogEditor
              value={watch('content')}
              onChange={v => setValue('content', v, { shouldValidate: true })}
              error={errors.content?.message}
            />
          </div>
        </div>

        <Input
          label='External URL'
          placeholder='Enter external URL (optional)'
          type='text'
          register={register('url')}
          error={errors.url?.message}
        />
      </form>
      <div className="flex justify-end items-center gap-3 h-[70px] w-full pr-4 border-t-2 border-gray bg-white">
        <Button type="button" name="Close" onClick={() => { reset(); toggleDrawer(false); }} className="bg-graydark" />
        <Button type="submit" name={isSubmitting ? 'Drafting...' : 'Draft'} className="bg-primary/85" loading={isSubmitting} form="blog-create-form" />
        <Button type="button" name={isSubmitting ? 'Publishing...' : 'Publish'} className="bg-success" loading={isSubmitting}
          onClick={() => {
            const data = getValues();
            console.log('Publish blog data (button):', data);
          }}
        />
      </div>
    </Drawer>
  )
}

export default CreateBlogDrawer