import { Drawer } from '@mui/material';
import React, { useState } from 'react';
import ModalHeader from '../common/ModalHeader';
import Button from '../common/Button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { deleteBlog, deleteBlogsBulk, deleteBlogsByStatus, fetchBlogs } from '@/redux/slice/blog/blogSlice';
import { toast } from 'sonner';
import { AiOutlineDelete } from 'react-icons/ai';
import { ImSpinner2 } from 'react-icons/im';

interface DeleteBlogDrawerProps {
  isDeleteBlogDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  blog?: any;
  action: 'single' | 'selected' | 'all' | 'draft' | 'published';
  selectedBlogs?: any[];
}

const DeleteBlogDrawer = ({ isDeleteBlogDrawerOpen, toggleDrawer, blog, action, selectedBlogs = [] }: DeleteBlogDrawerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

 const handleDelete = async () => {
  setLoading(true);
  try {
    let response;
    if (action === 'single' && blog) {
      response = await dispatch(deleteBlog(blog._id) as any);
    } else if (action === 'selected' && selectedBlogs.length > 0) {
      const blogTobeDelete = selectedBlogs.map(blog => blog._id);
      response = await dispatch(deleteBlogsBulk(blogTobeDelete) as any);
    } else if (action === 'draft') {
      response = await dispatch(deleteBlogsByStatus('draft') as any);
    } else if (action === 'published') {
      response = await dispatch(deleteBlogsByStatus('published') as any);
    }

    if (response?.payload?.message) {
      toast.success(response.payload.message);
    }
    dispatch(fetchBlogs({}));
    toggleDrawer(false);
  } catch (error: any) {
    console.log(error);
    toast.error(error?.response?.data?.message);
  } finally {
    setLoading(false);
  }
};

  const getConfirmText = () => {
    if (action === 'single') {
      return <>Are you sure you want to delete the blog <b className='text-black'>{blog?.title}</b>?</>;
    } else if (action === 'selected') {
      return <>Are you sure you want to delete <b className='text-black'>{selectedBlogs.length}</b> selected blogs?</>;
    } else if (action === 'all') {
      return <>Are you sure you want to delete <b className='text-black'>ALL</b> blogs? This cannot be undone.</>;
    } else if (action === 'draft') {
      return <>Are you sure you want to delete <b className='text-black'>all drafted</b> blogs?</>;
    } else if (action === 'published') {
      return <>Are you sure you want to delete <b className='text-black'>all published</b> blogs?</>;
    }
    return null;
  };

  return (
    <Drawer
      anchor='right'
      open={isDeleteBlogDrawerOpen}
      onClose={() => toggleDrawer(false)}
      PaperProps={{ sx: { width: { xs: '100vw', sm: 350, md: 400 } } }}
    >
      <ModalHeader text='Delete Blog' toggleDrawer={() => toggleDrawer(false)} />
      <div className='relative flex flex-col items-center justify-center px-7 pb-7 h-[calc(100vh-60px)]'>
        {loading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-75">
            <ImSpinner2 className="animate-spin text-5xl text-red-500" />
            <h3 className="mt-3 text-lg font-semibold text-red-500">
              Deleting...
            </h3>
          </div>
        )}
        <div className="rounded-full border-[3px] border-black bg-[#FCFCFC] p-2 mt-8">
          <AiOutlineDelete className="text-red-600 text-[50px]" />
        </div>
        <h2 className="mt-2 text-xl font-semibold text-center">
          Delete Confirmation
        </h2>
        <h3 className="mt-2 text-center text-[18px] font-semibold text-[#8D8D8D]">
          {getConfirmText()}
        </h3>
        <div className='flex justify-end items-center gap-2 absolute bottom-0 h-[60px] w-full pr-8 border-t-2 border-gray'>
          <Button
            type="button"
            name="Close"
            className="mr-4 bg-graydark"
            onClick={() => toggleDrawer(false)}
            disabled={loading}
          />
          <Button
            type="button"
            name={loading ? 'Deleting...' : 'Confirm'}
            onClick={handleDelete}
            className="bg-danger"
            disabled={loading}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default DeleteBlogDrawer;