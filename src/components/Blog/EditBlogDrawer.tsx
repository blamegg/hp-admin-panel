import { Drawer } from '@mui/material';
import React, { useState, useRef } from 'react';
import ModalHeader from '../common/ModalHeader';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { createBlog, updateBlog } from '@/redux/slice/blog/blogSlice';
import { BlogFormInputs } from '@/schema/blogSchema';
import BlogForm from './BlogForm';
import Button from '../common/Button';
import AssetsManager from '../AssetsManager/AssetsManager';
import { toast } from 'sonner';

interface EditBlogDrawerProps {
  isEditBlogDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  blog: any;
}


const defaultValues: BlogFormInputs = {
  title: '',
  content: '',
  url: '',
  coverPage: [],
  categories: [],
  tags: [],
};

const EditBlogDrawer = ({ isEditBlogDrawerOpen, toggleDrawer, blog }: EditBlogDrawerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const [showAssetsManager, setShowAssetsManager] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const blogFormRef = useRef<any>(null);

  const handleSubmit = async (data: BlogFormInputs) => {
    setLoading(true);
    let coverPageUrl = '';
    if (Array.isArray(data.coverPage)) {
      coverPageUrl = data.coverPage[0] || '';
    } else if (typeof data.coverPage === 'string') {
      coverPageUrl = data.coverPage;
    }
    if (coverPageUrl === '') coverPageUrl = '';
    const payload = { ...data, coverPage: coverPageUrl };
    if (blog && blog._id) {
      const response = await dispatch(updateBlog({ id: blog._id, payload }) as any);
      toast.success(response.payload?.message || 'Blog updated successfully');
    }
    setLoading(false);
    toggleDrawer(false);
  };

  const handleDraft = async () => {
    setLoading(true);
    try {
      if (blogFormRef.current) {
        const values = blogFormRef.current.getValues();
        let coverPageUrl = '';
        if (Array.isArray(values.coverPage)) {
          coverPageUrl = values.coverPage[0] || '';
        } else if (typeof values.coverPage === 'string') {
          coverPageUrl = values.coverPage;
        }
        if (coverPageUrl === '') coverPageUrl = '';
        const payload = { ...values, coverPage: coverPageUrl, status: 'draft' };
        if (blog && blog._id) {
          const response = await dispatch(createBlog({ blogId: blog._id, ...payload }) as any);
          toast.success(response.payload?.message);
        }
      }
    } catch (err) {
      console.error('Failed to save draft:', err);
    }
    setLoading(false);
    // toggleDrawer(false);
  };

  const handleSubmitClick = () => {
    // Directly submit via form
    if (blogFormRef.current) {
      blogFormRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  const handleDraftClick = () => {
    handleDraft();
  };

  const handleAssetSelect = (asset: any) => {
    setSelectedAsset(asset);
    setShowAssetsManager(false);
    if (blogFormRef.current && asset && asset.url) {
      blogFormRef.current.setValue('coverPage', asset.url);
    }
  };

  return (
    <Drawer
      anchor='right'
      open={isEditBlogDrawerOpen}
      onClose={() => toggleDrawer(false)}
      PaperProps={{ sx: { width: { xs: '100vw', sm: 400, md: 500, lg: 800 }, display: 'flex', flexDirection: 'column', height: '100%' } }}
    >
      <ModalHeader text='Edit Blog' toggleDrawer={() => toggleDrawer(false)} />
      <BlogForm
        ref={blogFormRef}
        initialValues={defaultValues}
        onSubmit={handleSubmit}
        onDraft={handleDraft}
        loading={loading}
        mode='edit'
        blogId={blog?._id}
        blog={blog}
        onClose={() => toggleDrawer(false)}
        showAssetsManager={showAssetsManager}
        setShowAssetsManager={setShowAssetsManager}
        handleAssetSelect={handleAssetSelect}
        selectedAsset={selectedAsset}
      />
      <AssetsManager
        open={showAssetsManager}
        onClose={() => setShowAssetsManager(false)}
        onSelect={handleAssetSelect}
        selectedAsset={selectedAsset}
      />
      <div className="flex justify-end items-center gap-2 p-4 border-t-2 border-gray">
        <Button 
          type="button" 
          name="Cancel" 
          className="bg-graydark text-white" 
          onClick={() => toggleDrawer(false)} 
        />
        <Button 
          type="button" 
          name="Save Draft" 
          className="bg-primary text-white" 
          onClick={handleDraftClick} 
          disabled={loading} 
        />
        <Button 
          type="button" 
          name="Update Blog" 
          className="bg-success text-white" 
          onClick={handleSubmitClick} 
          disabled={loading} 
        />
      </div>
    </Drawer>
  );
};

export default EditBlogDrawer;