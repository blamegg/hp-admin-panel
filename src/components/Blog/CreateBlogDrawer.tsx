import { Drawer } from '@mui/material'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import ModalHeader from '../common/ModalHeader'
import Button from '../common/Button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { createBlog, updateBlog, fetchBlogs } from '@/redux/slice/blog/blogSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogSchema, BlogFormInputs } from '@/schema/blogSchema';
import Input from '../common/Input';
import BlogEditor from './BlogEditor';
import { toast } from 'sonner';
import FormError from '../common/FormError';
import CustomFileSelector from '../common/CustomFileSelector';
import CustomMultiSelect from '../common/CustomMultiSelect';
import { buildBlogFormData, addToList, removeFromList, handleFileInput, buildBlogPayload } from '@/utility/helper';
import { categoriesList, tagsList } from '@/utility/blogFields';

interface CreateBlogProps {
  isCreateBlogDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
}



const defaultValues: BlogFormInputs = {
  title: '',
  content: '',
  url: '',
  categories: [],
  tags: [],
  coverPage: [],
};

const CreateBlogDrawer = ({ isCreateBlogDrawerOpen, toggleDrawer }: CreateBlogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { register, getValues, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<BlogFormInputs>({
    resolver: zodResolver(blogSchema),
    defaultValues,
    mode: 'onChange',
  });

  const categories = watch('categories');
  const tags = watch('tags');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const coverPageFile = watch('coverPage');
  const [blogStatus, setBlogStatus] = useState<'draft' | 'published'>("draft");
  const [blogId, setBlogId] = useState<string | null>(null);

  // Custom file input handler for preview and form value
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileInput(
      e,
      setSelectedFile,
      (name: any, value: any, options?: any) => setValue(name as any, value, options),
      setFilePreview
    );
  };

  useEffect(() => {
    if (!isCreateBlogDrawerOpen) {
      reset();
      setBlogId(null);
      setFilePreview(null);
      setSelectedFile(null);
    }
  }, [isCreateBlogDrawerOpen, reset]);

  useEffect(() => {
    if (coverPageFile && coverPageFile.length > 0) {
      const file = coverPageFile[0];
      if (file instanceof File) {
        const url = URL.createObjectURL(file);
        setFilePreview(url);
        return () => URL.revokeObjectURL(url);
      } else if (typeof file === 'string') {
        setFilePreview(file);
      }
    } else {
      setFilePreview(null);
    }
  }, [coverPageFile]);

  const onSubmit = async (data: BlogFormInputs) => {
  
    // For publishing, always use updateBlog
    if (blogStatus === 'published') {
      if (!blogId) {
        toast.error('Cannot publish without saving draft first');
        return;
      }
      const payload = buildBlogPayload(data, blogStatus);
      await dispatch(updateBlog({ id: blogId, payload }) as any);
      toast.success('Blog published successfully');
    } else {
      // For draft, use createBlog
      if (blogId) {
        data.blogId = blogId;
      }
      const payload = buildBlogPayload(data, blogStatus);
      console.log("payload", payload)
      const result = await dispatch(createBlog(payload) as any);
      console.log("create response", result);
      toast.success('Blog created successfully');
      if (result.payload && result.payload.data && result.payload.data._id) {
        setBlogId(result.payload.data._id);
      }
    }
    
    reset();
    toggleDrawer(false);
  };

  // Save draft function - always uses createBlog
  const saveDraft = async () => {
    const currentData = getValues();
    if (!currentData.title && !currentData.content && currentData.categories.length === 0 && currentData.tags.length === 0) {
      return;
    }
    
    // Include blogId if it exists (for subsequent saves)
    if (blogId) {
      currentData.blogId = blogId;
    }
    
    const payload = buildBlogPayload(currentData, 'draft');
    const result = await dispatch(createBlog(payload) as any);
    
    if (result.payload && result.payload.data && result.payload.data._id) {
      setBlogId(result.payload.data._id);
      toast.success(blogId ? 'Draft updated successfully' : 'Draft created successfully');
    } else {
      toast.success('Draft saved successfully');
    }
    
    dispatch(fetchBlogs({}));
  };

  const handleDraftClick = async () => {
    await saveDraft();
  };

  const handlePublishClick = async () => {
    setBlogStatus('published');
    await handleSubmit(onSubmit)();
  };

  return (
    <Drawer
      anchor='right'
      open={isCreateBlogDrawerOpen}
      onClose={() => toggleDrawer(false)}
      PaperProps={{ sx: { width: { xs: '100vw', sm: 400, md: 500, lg: 800 }, display: 'flex', flexDirection: 'column', height: '100%' } }}
    >
      <ModalHeader text='Create Blog' toggleDrawer={() => toggleDrawer(false)} />

      {/* Auto-save status indicator */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {isSubmitting && (
              <div className="flex items-center gap-1 text-blue-600">
                <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Publishing...</span>
              </div>
            )}
            {!isSubmitting && blogId && (
              <div className="flex items-center gap-1 text-green-600">
                <span>✓ Draft saved</span>
              </div>
            )}
            {!isSubmitting && !blogId && (
              <div className="flex items-center gap-1 text-gray-500">
                <span>New draft</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-2 p-4 flex-1 overflow-y-auto' id="blog-create-form">

        <div className='mb-2 lg:grid lg:grid-cols-2 lg:gap-10'>
          {/* Title */}
          <div>
            <Input
              label='Title*'
              placeholder='Enter blog title'
              type='text'
              register={register('title')}
              error={typeof errors?.title?.message === 'string' ? errors.title.message : undefined}
            />
          </div>
          {/* Media Upload (Image or Video) */}
          <div className='mb-2'>
            <CustomFileSelector
              label="Cover page*"
              accept="image/*,video/*"
              error={typeof errors?.coverPage?.message === 'string' ? errors.coverPage.message : undefined}
              onChange={handleFileChange}
            />
            {filePreview && selectedFile && (
              <div style={{ marginTop: 8 }}>
                {selectedFile.type.startsWith('image/') ? (
                  <img
                    src={filePreview}
                    alt="Preview"
                    style={{ maxWidth: 120, maxHeight: 80, borderRadius: 4, border: '1px solid #eee' }}
                  />
                ) : selectedFile.type.startsWith('video/') ? (
                  <video
                    src={filePreview}
                    controls
                    style={{ maxWidth: 120, maxHeight: 80, borderRadius: 4, border: '1px solid #eee' }}
                  />
                ) : null}
              </div>
            )}
          </div>
        </div>

        <div className='mb-2 lg:grid lg:grid-cols-2 lg:gap-10'>

          {/* External url */}
          <div>
            <Input
              label='External URL'
              placeholder='Enter external URL (optional)'
              type='text'
              register={register('url')}
              error={typeof errors?.url?.message === 'string' ? errors.url.message : undefined}
            />
          </div>
        </div>

        <div className='mb-2 lg:grid lg:grid-cols-2 lg:gap-10'>
          <CustomMultiSelect
            label="Categories*"
            value={categories}
            onChange={vals => setValue('categories', vals, { shouldValidate: true })}
            error={typeof errors?.categories?.message === 'string' ? errors.categories.message : undefined}
            placeholder="Add category"
          />
          <CustomMultiSelect
            label="Tags*"
            value={tags}
            onChange={vals => setValue('tags', vals, { shouldValidate: true })}
            error={typeof errors?.tags?.message === 'string' ? errors.tags.message : undefined}
            placeholder="Add tag"
          />
        </div>

        <div className='mb-0 p-0'>
          <label className='block text-xs font-medium text-black dark:text-white mb-1'>Content</label>
          <div className="w-full rounded  focus-visible:outline-none dark:border-strokedar dark:focus-within:border-primary transition-all duration-200 bg-gray text-black dark:bg-meta-4 dark:text-white border-stroke">
            <BlogEditor
              value={watch('content')}
              onChange={v => setValue('content', v, { shouldValidate: true, shouldDirty: true })}
              error={errors.content?.message}
            />
          </div>
          <FormError error={errors.content?.message} />
        </div>




      </form>
      <div className="flex justify-end items-center gap-3 h-[70px] w-full pr-4 border-t-2 border-gray bg-white">
        <Button type="button" name="Close" onClick={() => { reset(); toggleDrawer(false); }} className="bg-graydark" />
        <Button
          type="button"
          onClick={handleDraftClick}
          name={isSubmitting ? 'Saving...' : 'Save Draft'}
          className="bg-primary/85"
          loading={isSubmitting}
        />
        <Button
          type="submit"
          name={isSubmitting ? 'Publishing...' : 'Publish'}
          className="bg-success"
          loading={isSubmitting}
          onClick={handlePublishClick}
          form="blog-create-form"
        />
      </div>
    </Drawer>
  )
}

export default CreateBlogDrawer