import { Drawer } from '@mui/material'
import React, { useState } from 'react'
import ModalHeader from '../common/ModalHeader'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { createBlog } from '@/redux/slice/blog/blogSlice';
import { BlogFormInputs } from '@/schema/blogSchema';
import BlogForm from './BlogForm';

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
    // You can use getValues from BlogForm if you want to save draft from inside BlogForm
    setLoading(false);
    toggleDrawer(false);
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
        initialValues={defaultValues}
        onSubmit={handleSubmit}
        onDraft={handleDraft}
        loading={loading}
        mode='create'
        blogId={blogId}
        onClose={() => toggleDrawer(false)}
      />
    </Drawer>
  );
};

export default CreateBlogDrawer;