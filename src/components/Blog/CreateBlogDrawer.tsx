import { Drawer } from '@mui/material'
import React, { useState, useRef } from 'react'
import ModalHeader from '../common/ModalHeader'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { createBlog } from '@/redux/slice/blog/blogSlice';
import { BlogFormInputs } from '@/schema/blogSchema';
import BlogForm from './BlogForm';
import Button from '../common/Button';
import AssetsManager from '../AssetsManager/AssetsManager';
import { createBlogFn } from '@/utility/queryFetcher';
import { toast } from 'sonner';

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
  const [blogId, setBlogId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const submitRef = useRef<HTMLButtonElement>(null);
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
    if (blogId) {
      payload.blogId = blogId;
    }
    const result = await dispatch(createBlog(payload) as any);
    if (result.payload && result.payload.data && result.payload.data._id) {
      setBlogId(result.payload.data._id);
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
        console.log("payload", payload)
       const response =  await dispatch(createBlog(payload) as any);
       toast.success(response.payload.message)
      }
    } catch (err:any) {
      // Optionally handle error
      toast.error(err.response.data.message)
      console.error('Failed to save draft:', err);
    }
    setLoading(false);
    // toggleDrawer(false);
  };

  const handleSubmitClick = () => {
    console.log("clicked")
    submitRef.current?.click();
  };
  
  const handleDraftClick = () => {
    console.log("clicked");
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
      open={isCreateBlogDrawerOpen}
      onClose={() => toggleDrawer(false)}
      PaperProps={{ sx: { width: { xs: '100vw', sm: 400, md: 500, lg: 800 }, display: 'flex', flexDirection: 'column', height: '100%' } }}
    >
      <ModalHeader text='Create Blog' toggleDrawer={() => toggleDrawer(false)} />
      <BlogForm
        ref={blogFormRef}
        initialValues={defaultValues}
        onSubmit={handleSubmit}
        onDraft={handleDraft}
        loading={loading}
        mode='create'
        blogId={blogId}
        onClose={() => toggleDrawer(false)}
        submitRef={submitRef}
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
      <div className="flex justify-end items-center gap-2 h-[60px] w-[100%] pr-8 border-t-2 border-gray">
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
          name="Create Blog" 
          className="bg-success text-white" 
          onClick={handleSubmitClick} 
          disabled={loading} 
        />
      
      </div>
    </Drawer>
  );
};

export default CreateBlogDrawer;