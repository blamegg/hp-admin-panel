"use client"
import React, { useEffect, useState } from 'react';
import Button from '../common/Button';
import CreateBlogDrawer from './CreateBlogDrawer';
import EditBlogDrawer from './EditBlogDrawer';
import DeleteBlogDrawer from './DeleteBlogDrawer';
import PreviewBlogDrawer from './PreviewBlog';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchBlogs } from '@/redux/slice/blogSlice';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { Tooltip } from '@mui/material';
import useDebounce from '@/hooks/useDebounce';

const Blog = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, loading, total, currentPage, limit } = useSelector((state: RootState) => state.blogs);
  const [isCreateBlogDrawerOpen, setIsCreateBlogDrawerOpen] = useState(false);
  const [isEditBlogDrawerOpen, setIsEditBlogDrawerOpen] = useState(false);
  const [isDeleteBlogDrawerOpen, setIsDeleteBlogDrawerOpen] = useState(false);
  const [isPreviewBlogDrawerOpen, setIsPreviewBlogDrawerOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchBlogs({ page, limit: rowsPerPage, search: debouncedSearchQuery }));
  }, [dispatch, page, rowsPerPage, debouncedSearchQuery]);

  const handlePageChange = (p: number) => setPage(p);
  const handleRowsPerPageChange = (n: number) => { setRowsPerPage(n); setPage(1); };

  const columns = [
    { name: 'Title', selector: (row: any) => row.title, sortable: true },
    { name: 'Status', selector: (row: any) => row.status, sortable: true },
    { name: 'Categories', cell: (row: any) => (row.categories || []).join(', '), sortable: false },
    { name: 'Tags', cell: (row: any) => (row.tags || []).join(', '), sortable: false },
    { name: 'Actions', cell: (row: any) => (
      <div className='flex gap-2'>
        <Tooltip title='Preview'>
          <button onClick={() => { setSelectedBlog(row); setIsPreviewBlogDrawerOpen(true); }} className='text-blue-500'><FaEye /></button>
        </Tooltip>
        <Tooltip title='Edit'>
          <button onClick={() => { setSelectedBlog(row); setIsEditBlogDrawerOpen(true); }} className='text-green-600'><FaEdit /></button>
        </Tooltip>
        <Tooltip title='Delete'>
          <button onClick={() => { setSelectedBlog(row); setIsDeleteBlogDrawerOpen(true); }} className='text-red-500'><FaTrash /></button>
        </Tooltip>
      </div>
    ), width: '140px' },
  ];

  return (
    <div className='p-2'>
      <div className='flex flex-col sm:flex-row justify-between items-center mb-4 gap-2'>
        <Button type='button' name='Create blog' onClick={() => setIsCreateBlogDrawerOpen(true)} />
        <input
          type='text'
          placeholder='Search blogs...'
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className='border rounded px-2 py-1 w-full sm:w-64'
        />
      </div>
      <DataTable
        columns={columns}
        data={blogs}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={total}
        paginationPerPage={rowsPerPage}
        paginationRowsPerPageOptions={[5, 10, 20, 50]}
        onChangeRowsPerPage={handleRowsPerPageChange}
        onChangePage={handlePageChange}
        highlightOnHover
        pointerOnHover
        responsive
        noHeader
      />
        <CreateBlogDrawer
            isCreateBlogDrawerOpen={isCreateBlogDrawerOpen}
        toggleDrawer={setIsCreateBlogDrawerOpen}
      />
      <EditBlogDrawer
        isEditBlogDrawerOpen={isEditBlogDrawerOpen}
        toggleDrawer={setIsEditBlogDrawerOpen}
        blog={selectedBlog}
      />
      <DeleteBlogDrawer
        isDeleteBlogDrawerOpen={isDeleteBlogDrawerOpen}
        toggleDrawer={setIsDeleteBlogDrawerOpen}
        blog={selectedBlog}
      />
      <PreviewBlogDrawer
        isPreviewBlogDrawerOpen={isPreviewBlogDrawerOpen}
        toggleDrawer={setIsPreviewBlogDrawerOpen}
        blog={selectedBlog}
        />
    </div>
  );
};

export default Blog;