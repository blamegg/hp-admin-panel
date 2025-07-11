import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogSchema, BlogFormInputs } from '@/schema/blogSchema';
import Input from '../common/Input';
import BlogEditor from './BlogEditor';
import FormError from '../common/FormError';
import AssetsManager from '../AssetsManager/AssetsManager';
import Button from '../common/Button';

interface BlogFormProps {
  initialValues: BlogFormInputs;
  onSubmit: (data: BlogFormInputs) => Promise<void>;
  onDraft?: () => Promise<void>;
  loading?: boolean;
  mode: 'create' | 'edit';
  blogId?: string | null;
  blog?: any;
  onClose: () => void;
}

const BlogForm: React.FC<BlogFormProps> = ({
  initialValues,
  onSubmit,
  onDraft,
  loading = false,
  mode,
  blog,
  onClose,
}) => {
  const { register, getValues, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<BlogFormInputs>({
    resolver: zodResolver(blogSchema),
    defaultValues: initialValues,
    mode: 'onChange',
  });

  // const categories = watch('categories');
  // const tags = watch('tags');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const coverPageFile = watch('coverPage');
  const [showAssetsManager, setShowAssetsManager] = useState(false);

  useEffect(() => {
    if (coverPageFile && coverPageFile.length > 0) {
      const file = coverPageFile[0];
      if (file instanceof File) {
        setFilePreview(null);
        setValue('coverPage', [], { shouldValidate: true });
      } else if (typeof file === 'string') {
        let url = file;
        if (!/^https?:\/\//.test(url) && !url.startsWith('blob:')) {
          url = `${process.env.NEXT_PUBLIC_BASE_URL}/${url.replace(/^\/+/, '')}`;
        }
        setFilePreview(url);
        setSelectedFile(null);
        setValue('coverPage', [file], { shouldValidate: true });
      }
    } else {
      setFilePreview(null);
      setSelectedFile(null);
    }
  }, [coverPageFile, setValue]);

  useEffect(() => {
    if (mode === 'edit' && blog) {
      reset({
        title: blog.title || '',
        content: blog.content || '',
        coverPage: blog.coverPage ? [blog.coverPage] : [],
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

  const handleAssetSelect = (asset: any) => {
    setValue('coverPage', [asset.url], { shouldValidate: true });
    let url = asset.url;
    if (!/^https?:\/\//.test(url) && !url.startsWith('blob:')) {
      url = `${process.env.NEXT_PUBLIC_BASE_URL}${url}`;
    }
    setFilePreview(url);
    setSelectedFile(null);
    setShowAssetsManager(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-2 p-4 flex-1 overflow-y-auto'>
      <div className='mb-2 lg:grid lg:grid-cols-2 lg:gap-10'>
        <div>
          <Input
            label='Title*'
            placeholder='Enter blog title'
            type='text'
            register={register('title')}
            error={typeof errors?.title?.message === 'string' ? errors.title.message : undefined}
          />
        </div>
        <div className='mb-2'>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-2 rounded bg-primary text-white text-xs hover:bg-primary/90"
              onClick={() => setShowAssetsManager(true)}
            >
              Select from Assets
            </button>
          </div>
          <AssetsManager
            open={showAssetsManager}
            onClose={() => setShowAssetsManager(false)}
            onSelect={handleAssetSelect}
          />
          <div style={{ marginTop: 8 }}>
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
      {/* Add more fields as needed (categories, tags, etc.) */}
      <div className="flex gap-2 mt-4">
        {onDraft && (
          <Button type="button" name="Save Draft" className="bg-gray-200 text-black" onClick={onDraft} disabled={isSubmitting || loading} />
        )}
        <Button type="submit" name={mode === 'edit' ? 'Update Blog' : 'Create Blog'} className="bg-primary text-white" disabled={isSubmitting || loading} />
        <Button type="button" name="Cancel" className="bg-gray-100 text-black" onClick={onClose} />
      </div>
    </form>
  );
};

export default BlogForm; 