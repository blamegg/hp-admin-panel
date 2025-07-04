import { Drawer } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ModalHeader from '../common/ModalHeader'
import Button from '../common/Button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { createBlog } from '@/redux/slice/blog/blogSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogSchema, BlogFormInputs } from '@/schema/blogSchema';
import Input from '../common/Input';
import Select from '../common/Select';
import BlogEditor from './BlogEditor';
import { toast } from 'sonner';
import FormError from '../common/FormError';
import CustomFileSelector from '../common/CustomFileSelector';
import CustomMultiSelect from '../common/CustomMultiSelect';

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
    mode: 'onChange',
  });

  const [categoryInput, setCategoryInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const categories = watch('categories');
  const tags = watch('tags');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const coverPageFile = watch('coverPage');
  const [blogStatus, setBlogStatus] = useState<'draft' | 'published'>("draft")

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

  // Custom file input handler for preview and form value
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setValue('coverPage', [file]); // react-hook-form expects an array for file inputs
      const url = URL.createObjectURL(file);
      setFilePreview(url);
    } else {
      setSelectedFile(null);
      setValue('coverPage', []);
      setFilePreview(null);
    }
  };

  useEffect(() => {
    if (coverPageFile && coverPageFile.length > 0) {
      const file = coverPageFile[0];
      const url = URL.createObjectURL(file);
      setFilePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setFilePreview(null);
    }
  }, [coverPageFile]);

  const onSubmit = async (data: BlogFormInputs) => {

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', JSON.stringify(data.content));
    formData.append('status', blogStatus);
    formData.append('url', data.url || '');
    formData.append('slug', data.coverPageUrl || '');
    data.categories.forEach((cat, idx) => formData.append(`categories[${idx}]`, cat));
    data.tags.forEach((tag, idx) => formData.append(`tags[${idx}]`, tag));
    if (data.coverPage && data.coverPage[0]) formData.append('coverPage', data.coverPage[0]);

    await dispatch(createBlog(formData) as any);
    toast.success('Blog created successfully');
    reset();
    toggleDrawer(false);

  };

  return (
    <Drawer
      anchor='right'
      open={isCreateBlogDrawerOpen}
      onClose={() => toggleDrawer(false)}
      PaperProps={{ sx: { width: { xs: '100vw', sm: 400, md: 500 }, display: 'flex', flexDirection: 'column', height: '100%' } }}
    >
      <ModalHeader text='Create Blog' toggleDrawer={() => toggleDrawer(false)} />
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-2 p-4 flex-1 overflow-y-auto' id="blog-create-form">

        <Input
          label='Title'
          placeholder='Enter blog title'
          type='text'
          register={register('title')}
          error={typeof errors?.title?.message === 'string' ? errors.title.message : undefined}
        />
        <div className='mb-2'>
          <CustomMultiSelect
            label="Categories"
            value={categories}
            onChange={vals => setValue('categories', vals, { shouldValidate: true })}
            error={typeof errors?.categories?.message === 'string' ? errors.categories.message : undefined}
            placeholder="Add category"
          />
        </div>
        <div className='mb-2'>
          <CustomMultiSelect
            label="Tags"
            value={tags}
            onChange={vals => setValue('tags', vals, { shouldValidate: true })}
            error={typeof errors?.tags?.message === 'string' ? errors.tags.message : undefined}
            placeholder="Add tag"
          />
        </div>
        {/* Media Upload (Image or Video) */}
        <div className='mb-2'>
          <CustomFileSelector
            label="Cover Image or Video"
            accept="image/*,video/*"
            error={typeof errors?.coverPage?.message === 'string' ? errors.coverPage.message : undefined}
            onChange={e => setValue('coverPage', e.target.files)}
          />
        </div>


        <div className='mb-0 p-0'>
          <label className='block text-xs font-medium text-black dark:text-white mb-1'>Content</label>
          <div className="w-full rounded  focus-visible:outline-none dark:border-strokedar dark:focus-within:border-primary transition-all duration-200 bg-gray text-black dark:bg-meta-4 dark:text-white border-stroke">
            <BlogEditor
              value={watch('content')}
              onChange={v => setValue('content', v, { shouldValidate: true })}
              error={errors.content?.message}
            />
          </div>
          <FormError error={errors.content?.message} ></FormError>
        </div>
        {/* Cover page url */}
        <Input
          label='Cover page URL'
          placeholder='Cover page URL (optional)'
          type='text'
          register={register('url')}
          error={typeof errors?.coverPageUrl?.message === 'string' ? errors.coverPageUrl.message : undefined}
        />

        {/* External url */}
        <Input
          label='External URL'
          placeholder='Enter external URL (optional)'
          type='text'
          register={register('url')}
          error={typeof errors?.url?.message === 'string' ? errors.url.message : undefined}
        />


      </form>
      <div className="flex justify-end items-center gap-3 h-[70px] w-full pr-4 border-t-2 border-gray bg-white">
        <Button type="button" name="Close" onClick={() => { reset(); toggleDrawer(false); }} className="bg-graydark" />
        <Button type="submit" onClick={() => setBlogStatus('draft')} name={isSubmitting ? 'Drafting...' : 'Draft'} className="bg-primary/85" loading={isSubmitting} form="blog-create-form" />
        <Button
          type="submit"
          name={isSubmitting ? 'Publishing...' : 'Publish'}
          className="bg-success"
          loading={isSubmitting}
          onClick={() => setBlogStatus('published')}
          form="blog-create-form"
        />

      </div>
    </Drawer>
  )
}

export default CreateBlogDrawer