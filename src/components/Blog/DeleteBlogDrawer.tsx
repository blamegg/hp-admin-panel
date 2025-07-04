import { Drawer } from '@mui/material';
import React, { useState } from 'react';
import ModalHeader from '../common/ModalHeader';
import Button from '../common/Button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { deleteBlog } from '@/redux/slice/blog/blogSlice';

interface DeleteBlogDrawerProps {
  isDeleteBlogDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  blog: any;
}

const DeleteBlogDrawer = ({ isDeleteBlogDrawerOpen, toggleDrawer, blog }: DeleteBlogDrawerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await dispatch(deleteBlog(blog._id) as any);
      toggleDrawer(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      anchor='right'
      open={isDeleteBlogDrawerOpen}
      onClose={() => toggleDrawer(false)}
      PaperProps={{ sx: { width: { xs: '100vw', sm: 350, md: 400 } } }}
    >
      <ModalHeader text='Delete Blog' toggleDrawer={() => toggleDrawer(false)} />
      <div className='flex flex-col gap-4 p-4'>
        <div>Are you sure you want to delete the blog <b>{blog?.title}</b>?</div>
        <div className='flex gap-2 justify-end'>
          <Button type='button' name='Cancel' onClick={() => toggleDrawer(false)} className='bg-gray-500' />
          <Button type='button' name={loading ? 'Deleting...' : 'Delete'} className='bg-danger' onClick={handleDelete} disabled={loading} />
        </div>
      </div>
    </Drawer>
  );
};

export default DeleteBlogDrawer;