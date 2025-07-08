import { Drawer } from '@mui/material';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import ModalHeader from '../common/ModalHeader';
import Button from '../common/Button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { updateBlog, createBlog, fetchBlogs } from '@/redux/slice/blog/blogSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogSchema, BlogFormInputs } from '@/schema/blogSchema';
import Input from '../common/Input';
import BlogEditor from './BlogEditor';
import { toast } from 'sonner';
import FormError from '../common/FormError';
import CustomFileSelector from '../common/CustomFileSelector';
import CustomMultiSelect from '../common/CustomMultiSelect';
import { buildBlogFormData, addToList, removeFromList, handleFileInput } from '@/utility/helper';

interface EditBlogDrawerProps {
  isEditBlogDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  blog: any;
}


const defaultValues: BlogFormInputs = {
  title: '',
  content: '',
  url: '',
  categories: [],
  tags: [],
};

const EditBlogDrawer = ({ isEditBlogDrawerOpen, toggleDrawer, blog }: EditBlogDrawerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { register, getValues, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting, isDirty } } = useForm<BlogFormInputs>({
    resolver: zodResolver(blogSchema),
    defaultValues,
    mode: 'onChange',
  });

  const categories = watch('categories');
  const tags = watch('tags');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const coverPageFile = watch('coverPage');
  const [blogStatus, setBlogStatus] = useState<'draft' | 'published'>("draft")

  // --- Auto-save states ---
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');
  const timeDelay = 5000;

  // Watch form data for changes
  const title = watch('title');
  const content = watch('content');
  const url = watch('url');
  const coverPageUrl = watch('coverPageUrl');


  // Custom file input handler for preview and form value
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileInput(
      e,
      setSelectedFile,
      (name: any, value: any, options?: any) => setValue(name as any, value, options),
      setFilePreview
    );
    setHasUnsavedChanges(true);

     setTimeout(() => {
      autoSave(true); // pass true to force save
    setHasUnsavedChanges(false);

    }, timeDelay);
  };

  useEffect(() => {
    if (coverPageFile && coverPageFile.length > 0) {
      const file = coverPageFile[0];
      // Only create object URL if it's actually a File object
      if (file instanceof File) {
        const url = URL.createObjectURL(file);
        console.log("image/video", url)
        setFilePreview(url);
        setSelectedFile(file); // Set selectedFile when a new file is selected
        return () => URL.revokeObjectURL(url);
      } else if (typeof file === 'string') {
        // If it's a string (URL), use it directly

        setFilePreview(`${process.env.NEXT_PUBLIC_BASE_URL}/${file}`);
        setSelectedFile(null); // Ensure selectedFile is null for URL
      }
    } else {
      setFilePreview(null);
      setSelectedFile(null);
    }
  }, [coverPageFile]);

  useEffect(() => {
    if (blog) {
      reset({
        title: blog.title || '',
        content: blog.content || '',
        coverPage: blog.coverPage ? [blog.coverPage] : [],
        url: blog.url || '',
        categories: blog.categories || [],
        tags: blog.tags || [],
        coverPageUrl: blog.coverPageUrl || ""
      });
      setBlogStatus(blog.status || 'draft');
      setSelectedFile(null); // Ensure selectedFile is null when loading existing blog
      // Set file preview if coverPage is a URL string
      if (blog.coverPage && typeof blog.coverPage === 'string') {
        setFilePreview(`${process.env.NEXT_PUBLIC_BASE_URL}${blog.coverPage}`);
      }
    }
  }, [blog, reset]);

  // --- Auto-save function ---
  const autoSave = useCallback(async (isDraftAction = false) => {
    const currentData = getValues();
    if (!currentData.title && !currentData.content && currentData.categories.length === 0 && currentData.tags.length === 0) {
      return;
    }
    const currentDataHash = JSON.stringify({
      title: currentData.title,
      content: currentData.content,
      url: currentData.url,
      coverPageUrl: currentData.coverPageUrl,
      categories: currentData.categories,
      tags: currentData.tags
    });
    if (!isDraftAction && currentDataHash === lastSavedDataRef.current) {
      return;
    }
    setIsAutoSaving(true);
    setHasUnsavedChanges(false);
    try {
      currentData.blogId = blog._id;
      console.log(currentData)
      // Use buildBlogFormData for auto-save and draft
      const formData = buildBlogFormData(currentData, blogStatus);
      await dispatch(createBlog(formData) as any);
      toast.success('Draft saved successfully');
      dispatch(fetchBlogs({}));
      lastSavedDataRef.current = currentDataHash;
      setLastSaved(new Date());
    } catch (error) {
      setHasUnsavedChanges(true);
      if (isDraftAction) {
        toast.error('Failed to save draft');
      }
    } finally {
      setIsAutoSaving(false);
    }
  }, [dispatch, getValues, blog?._id, blogStatus]);

  // --- Set up auto-save on form changes ---
  useEffect(() => {
    if (!isDirty) return; // Only auto-save if the form is dirty
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSave();
    }, timeDelay);
    setHasUnsavedChanges(true);
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [title, content, url, coverPageUrl, categories, tags, coverPageFile, autoSave, isDirty]);

  // --- Cleanup on drawer close ---
  useEffect(() => {
    if (!isEditBlogDrawerOpen) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      setIsAutoSaving(false);
      setLastSaved(null);
      setHasUnsavedChanges(false);
      lastSavedDataRef.current = '';
      reset();
    }
  }, [isEditBlogDrawerOpen, reset]);

  // --- Save Draft and Publish handlers ---
  const handleDraftClick = async () => {
    await autoSave(true);
  };
  const handlePublishClick = async () => {
    setBlogStatus('published');
  };

  const onSubmit = async (data: BlogFormInputs) => {
    const formData = buildBlogFormData(data, blogStatus);

    await dispatch(updateBlog({ id: blog._id, payload: formData }) as any);
    toast.success('Blog updated successfully');
    reset();
    toggleDrawer(false);
  };

  return (
    <Drawer
      anchor='right'
      open={isEditBlogDrawerOpen}
      onClose={() => toggleDrawer(false)}
      PaperProps={{ sx: { width: { xs: '100vw', sm: 400, md: 500, lg: 800 }, display: 'flex', flexDirection: 'column', height: '100%' } }}
    >
      <ModalHeader text='Edit Blog' toggleDrawer={() => toggleDrawer(false)} />
      {/* Auto-save status indicator */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {isAutoSaving && (
              <div className="flex items-center gap-1 text-blue-600">
                <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            )}
            {!isAutoSaving && lastSaved && (
              <div className="flex items-center gap-1 text-green-600">
                <span>✓</span>
                <span>Saved {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
            {hasUnsavedChanges && !isAutoSaving && (
              <div className="flex items-center gap-1 text-orange-600">
                <span>●</span>
                <span>Unsaved changes</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-2 p-4 flex-1 overflow-y-auto' id="blog-edit-form">
        <Input
          label='Title'
          placeholder='Enter blog title'
          type='text'
          register={register('title')}
          error={typeof errors?.title?.message === 'string' ? errors.title.message : undefined}
        />
        {/* Media Upload (Image or Video) */}
        <div className='mb-2'>
          <CustomFileSelector
            label="Cover page"
            accept="image/*,video/*"
            error={typeof errors?.coverPage?.message === 'string' ? errors.coverPage.message : undefined}
            onChange={handleFileChange}
          />
          {filePreview && (
            <div style={{ marginTop: 8 }}>
              {filePreview.startsWith('blob:') && selectedFile ? (
                selectedFile.type.startsWith('image/') ? (
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
                ) : null
              ) : (
                (() => {
                  let url = filePreview;
                  if (!/^https?:\/\//.test(url) && !url.startsWith('blob:')) {
                    url = `${process.env.NEXT_PUBLIC_BASE_URL}${url}`;
                  }
                  if (url.match(/\.(mp4|webm|ogg)$/i)) {
                    return (
                      <video
                        src={url}
                        controls
                        style={{ maxWidth: 120, maxHeight: 80, borderRadius: 4, border: '1px solid #eee' }}
                      />
                    );
                  }
                  return (
                    <img
                      src={url}
                      alt="Preview"
                      style={{ maxWidth: 120, maxHeight: 80, borderRadius: 4, border: '1px solid #eee' }}
                    />
                  );
                })()
              )}
            </div>
          )}
        </div>
        <div className='mb-2 lg:grid lg:grid-cols-2 lg:gap-10'>
          <div>
            <Input
              label='Cover page URL'
              placeholder='Cover page URL (optional)'
              type='text'
              register={register('coverPageUrl')}
              error={typeof errors?.coverPageUrl?.message === 'string' ? errors.coverPageUrl.message : undefined}
            />
          </div>
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
            label="Categories"
            value={categories}
            onChange={vals => setValue('categories', vals, { shouldValidate: true })}
            error={typeof errors?.categories?.message === 'string' ? errors.categories.message : undefined}
            placeholder="Add category"
          />
          <CustomMultiSelect
            label="Tags"
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
              onChange={v => setValue('content', v, { shouldValidate: true })}
              error={errors.content?.message}
            />
          </div>
          <FormError error={errors.content?.message} ></FormError>
        </div>
      </form>
      <div className="flex justify-end items-center gap-3 h-[70px] w-full pr-4 border-t-2 border-gray bg-white">
        <Button type="button" name="Close" onClick={() => { reset(); toggleDrawer(false); }} className="bg-graydark" />
        <Button
          type="button"
          onClick={handleDraftClick}
          name={isAutoSaving ? 'Saving...' : 'Save Draft'}
          className="bg-primary/85"
          loading={isAutoSaving}
        />
        <Button
          type="submit"
          name={isSubmitting ? 'Publishing...' : 'Publish'}
          className="bg-success"
          loading={isSubmitting}
          onClick={handlePublishClick}
          form="blog-edit-form"
        />
      </div>
    </Drawer>
  );
};

export default EditBlogDrawer;