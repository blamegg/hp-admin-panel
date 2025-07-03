import { Drawer } from '@mui/material';
import React, { useEffect } from 'react';
import ModalHeader from '../common/ModalHeader';
import Button from '../common/Button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { updateBlog } from '@/redux/slice/blogSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogSchema, BlogFormInputs } from '@/schema/blogSchema';
import Input from '../common/Input';
import Select from '../common/Select';
import Textarea from '../common/Input/Textarea';
import MultiSelect from '../FormElements/MultiSelect';

interface EditBlogDrawerProps {
  isEditBlogDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  blog: any;
}

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
];

const categoriesList = [
    { value: 'Tech', text: 'Tech', selected: false },
    { value: 'News', text: 'News', selected: false },
    { value: 'Tutorial', text: 'Tutorial', selected: false },
    { value: 'Opinion', text: 'Opinion', selected: false },
    { value: 'Review', text: 'Review', selected: false },
    { value: 'Other', text: 'Other', selected: false },
];
const tagsList = [
    { value: 'React', text: 'React', selected: false },
    { value: 'Next.js', text: 'Next.js', selected: false },
    { value: 'JavaScript', text: 'JavaScript', selected: false },
    { value: 'TypeScript', text: 'TypeScript', selected: false },
    { value: 'UI', text: 'UI', selected: false },
    { value: 'Backend', text: 'Backend', selected: false },
    { value: 'Frontend', text: 'Frontend', selected: false },
    { value: 'API', text: 'API', selected: false },
    { value: 'Blog', text: 'Blog', selected: false },
];

const EditBlogDrawer = ({ isEditBlogDrawerOpen, toggleDrawer, blog }: EditBlogDrawerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BlogFormInputs>({
    resolver: zodResolver(blogSchema),
  });

  useEffect(() => {
    if (blog) {
      reset({
        title: blog.title || '',
        content: blog.content || '',
        coverPage: blog.coverPage || '',
        url: blog.url || '',
        status: blog.status || 'draft',
        categories: blog.categories || [],
        tags: blog.tags || [],
      });
    }
  }, [blog, reset]);

  const onSubmit = async (data: BlogFormInputs) => {
    const categories = (document.getElementById('edit-categories-multiselect') as HTMLSelectElement)?.selectedOptions;
    const tags = (document.getElementById('edit-tags-multiselect') as HTMLSelectElement)?.selectedOptions;
    const categoryValues = categories ? Array.from(categories).map(el => el.value) : [];
    const tagValues = tags ? Array.from(tags).map(el => el.value) : [];
    
    await dispatch(updateBlog({ id: blog._id, payload: { ...data, categories: categoryValues, tags: tagValues } }) as any);
    toggleDrawer(false);
  };

  return (
    <Drawer
      anchor='right'
      open={isEditBlogDrawerOpen}
      onClose={() => toggleDrawer(false)}
      PaperProps={{ sx: { width: { xs: '100vw', sm: 400, md: 500 } } }}
    >
      <ModalHeader text='Edit Blog' toggleDrawer={() => toggleDrawer(false)} />
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 p-4'>
        <Input
          label='Title'
          placeholder='Enter blog title'
          type='text'
          register={register('title')}
          error={errors.title?.message}
        />
        <Textarea
          label='Content'
          placeholder='Enter blog content'
          {...register('content')}
          error={errors.content?.message}
        />
        <Input
          label='Cover Page (URL)'
          placeholder='Enter cover image URL'
          type='text'
          register={register('coverPage')}
          error={errors.coverPage?.message}
        />
        <Input
          label='External URL'
          placeholder='Enter external URL (optional)'
          type='text'
          register={register('url')}
          error={errors.url?.message}
        />
        <Select
          label='Status'
          options={statusOptions}
          register={register('status')}
          error={errors.status?.message}
        />
        
        <select id="edit-categories-multiselect" multiple className="hidden" defaultValue={blog?.categories}>
          {categoriesList.map(opt => <option key={opt.value} value={opt.value}>{opt.text}</option>)}
        </select>
        <MultiSelect id="edit-categories-multiselect" />

        <select id="edit-tags-multiselect" multiple className="hidden" defaultValue={blog?.tags}>
          {tagsList.map(opt => <option key={opt.value} value={opt.value}>{opt.text}</option>)}
        </select>
        <MultiSelect id="edit-tags-multiselect" />

        <div className='flex gap-2 justify-end'>
          <Button type='button' name='Close' onClick={() => toggleDrawer(false)} className='bg-gray-500' />
          <Button type='submit' name={isSubmitting ? 'Updating...' : 'Update'} className='bg-success' loading={isSubmitting} />
        </div>
      </form>
    </Drawer>
  );
};

export default EditBlogDrawer;