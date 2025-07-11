import { Drawer } from '@mui/material';
import React, { useState } from 'react';
import ModalHeader from '../common/ModalHeader';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { updateBlog } from '@/redux/slice/blog/blogSlice';
import { BlogFormInputs } from '@/schema/blogSchema';
import BlogForm from './BlogForm';

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
      await dispatch(updateBlog({ id: blog._id, payload }) as any);
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
      open={isEditBlogDrawerOpen}
      onClose={() => toggleDrawer(false)}
      PaperProps={{ sx: { width: { xs: '100vw', sm: 400, md: 500, lg: 800 }, display: 'flex', flexDirection: 'column', height: '100%' } }}
    >
      <ModalHeader text='Edit Blog' toggleDrawer={() => toggleDrawer(false)} />
      <BlogForm
        initialValues={defaultValues}
        onSubmit={handleSubmit}
        onDraft={handleDraft}
        loading={loading}
        mode='edit'
        blogId={blog?._id}
        blog={blog}
        onClose={() => toggleDrawer(false)}
      />
    </Drawer>
  );
};

export default EditBlogDrawer;