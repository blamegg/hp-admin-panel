import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogSchema, BlogFormInputs } from '@/schema/blogSchema';
import Input from '../common/Input';
import BlogEditor from './BlogEditor';
import FormError from '../common/FormError';
import AssetsManager from '../AssetsManager/AssetsManager';
import Button from '../common/Button';
import CustomMultiSelect from '../common/CustomMultiSelect';

interface BlogFormProps {
  initialValues: BlogFormInputs;
  onSubmit: (data: BlogFormInputs) => Promise<void>;
  onDraft?: () => Promise<void>;
  loading?: boolean;
  mode: 'create' | 'edit';
  blogId?: string | null;
  blog?: any;
  onClose: () => void;
  submitRef?: React.RefObject<HTMLButtonElement>;
  draftRef?: React.RefObject<HTMLButtonElement>;
  showAssetsManager?: boolean;
  setShowAssetsManager?: (open: boolean) => void;
  handleAssetSelect?: (asset: any) => void;
  selectedAsset?: any;
}

const BlogForm = forwardRef<any, BlogFormProps>(({
  initialValues,
  onSubmit,
  onDraft,
  loading = false,
  mode,
  blog,
  onClose,
  submitRef,
  draftRef,
  showAssetsManager,
  setShowAssetsManager,
  handleAssetSelect,
  selectedAsset,
}, ref) => {
  const { register, getValues, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<BlogFormInputs>({
    resolver: zodResolver(blogSchema),
    defaultValues: initialValues,
    mode: 'onChange',
  });

  useImperativeHandle(ref, () => ({
    getValues,
    setValue,
  }));

  // const categories = watch('categories');
  // const tags = watch('tags');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const coverPageValue = watch('coverPage');

  useEffect(() => {
    if (typeof coverPageValue === 'string' && coverPageValue) {
      let url = coverPageValue;
      if (!/^https?:\/\//.test(url) && !url.startsWith('blob:')) {
        url = `${process.env.NEXT_PUBLIC_BASE_URL}/${url.replace(/^\/+/,'')}`;
      }
      setFilePreview(url);
      setSelectedFile(null);
    } else {
      setFilePreview(null);
      setSelectedFile(null);
    }
  }, [coverPageValue]);

  useEffect(() => {
    if (mode === 'edit' && blog) {
      reset({
        title: blog.title || '',
        content: blog.content || '',
        coverPage: blog.coverPage,
        url: blog.url || '',
        categories: blog.categories || [],
        tags: blog.tags || [],
      });
      if (blog.coverPage && typeof blog.coverPage === 'string') {

        setFilePreview(`${process.env.NEXT_PUBLIC_BASE_URL}${blog.coverPage}`);
      }
    } else if (mode === 'create') {
      reset(initialValues);
    }
  }, [mode, blog, reset, initialValues]);

  // Remove local showAssetsManager and selectedAsset state

  console.log("file",filePreview) 
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-2 p-4 flex-1 overflow-y-auto'>
      {/* Hidden buttons for external triggers */}
        <div className='mb-2'>
          <Input
            label='Title*'
            placeholder='Enter blog title'
            type='text'
            register={register('title')}
            error={typeof errors?.title?.message === 'string' ? errors.title.message : undefined}
          />
        </div>


      <div className='mb-2 lg:grid lg:grid-cols-2 lg:gap-10'>
        <div>
          <CustomMultiSelect
            label='Categories*'
            value={watch('categories')}
            onChange={(selected) => setValue('categories', selected, { shouldValidate: true })}
            error={typeof errors?.categories?.message === 'string' ? errors.categories.message : undefined}
            placeholder='Add category'
          />
        </div>
        <div>
          <CustomMultiSelect
            label='Tags*'
            value={watch('tags')}
            onChange={(selected) => setValue('tags', selected, { shouldValidate: true })}
            error={typeof errors?.tags?.message === 'string' ? errors.tags.message : undefined}
            placeholder='Add tag'
          />
        </div>
      </div>
      <div className='mb-2 lg:grid lg:grid-cols-2 lg:gap-10'>
        <div>
          <Input
            label='URL'
            placeholder='Enter blog URL'
            type='text'
            register={register('url')}
            error={typeof errors?.url?.message === 'string' ? errors.url.message : undefined}
          />
        </div>
        <div className="mb-2">
          <label className='block text-xs font-medium text-black dark:text-white mb-1'>Cover page</label>
          <div className='flex gap-5 items-start'>
            <Button
              type="button"
              name='Select cover page'
              className="px-3 py-2 rounded bg-primary/70 text-white text-xs hover:bg-primary/90"
              onClick={() => setShowAssetsManager && setShowAssetsManager(true)}
            >
            </Button>
            {filePreview && (
              <img
                src={filePreview}
                alt="Preview"
                style={{ maxWidth: 120, maxHeight: 80, borderRadius: 4, border: '1px solid #eee' }}
              />
            )}
          </div>
        </div>
      </div>
      <div>
        <BlogEditor value={watch('content')} onChange={val => setValue('content', val, { shouldValidate: true })} />
        {errors.content && <FormError error={errors.content.message} />}
      </div>
    </form>
  );
});

export default BlogForm; 