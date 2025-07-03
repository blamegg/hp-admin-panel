import { Drawer, Chip, Box } from '@mui/material';
import React from 'react';
import ModalHeader from '../common/ModalHeader';

interface PreviewBlogDrawerProps {
  isPreviewBlogDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  blog: any;
}

const PreviewBlogDrawer = ({ isPreviewBlogDrawerOpen, toggleDrawer, blog }: PreviewBlogDrawerProps) => {
  return (
    <Drawer
      anchor='right'
      open={isPreviewBlogDrawerOpen}
      onClose={() => toggleDrawer(false)}
      PaperProps={{ sx: { width: { xs: '100vw', sm: 400, md: 500 } } }}
    >
      <ModalHeader text='Preview Blog' toggleDrawer={() => toggleDrawer(false)} />
      <div className='flex flex-col gap-4 p-4'>
        <h2 className='text-xl font-bold'>{blog?.title}</h2>
        <div><b>Status:</b> {blog?.status}</div>
        <div><b>Categories:</b> <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>{(blog?.categories || []).map((cat: string) => <Chip key={cat} label={cat} />)}</Box></div>
        <div><b>Tags:</b> <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>{(blog?.tags || []).map((tag: string) => <Chip key={tag} label={tag} />)}</Box></div>
        {blog?.coverPage && <div><b>Cover Page:</b> <img src={blog.coverPage} alt='cover' className='max-w-full max-h-40 rounded' /></div>}
        {blog?.url && <div><b>External URL:</b> <a href={blog.url} target='_blank' rel='noopener noreferrer' className='text-blue-600 underline'>{blog.url}</a></div>}
        <div><b>Content:</b></div>
        <div className='bg-gray-50 p-2 rounded border border-gray-200 whitespace-pre-line'>{blog?.content}</div>
      </div>
    </Drawer>
  );
};

export default PreviewBlogDrawer;