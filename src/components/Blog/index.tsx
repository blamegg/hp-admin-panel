"use client"
import React, { useEffect, useState } from 'react';
import Button from '../common/Button';
import CreateBlogDrawer from './CreateBlogDrawer';
import EditBlogDrawer from './EditBlogDrawer';
import DeleteBlogDrawer from './DeleteBlogDrawer';
import { useRouter } from 'next/navigation';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchBlogs } from '@/redux/slice/blog/blogSlice';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { Tooltip } from '@mui/material';
import useDebounce from '@/hooks/useDebounce';
import CustomPagination from '../CustomPagination';
import Input from '../common/Input';

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
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchBlogs({ page, limit: rowsPerPage, search: debouncedSearchQuery }));
  }, [dispatch, page, rowsPerPage, debouncedSearchQuery]);

  const handlePageChange = (p: number) => setPage(p);
  const handleRowsPerPageChange = (n: number) => { setRowsPerPage(n); setPage(1); };

  console.log("Blogs", blogs)
  const columns = [
    { name: 'Title', selector: (row: any) => row.title, sortable: true },
    { name: 'Status', selector: (row: any) => row.status, sortable: true },
    { name: 'Categories', cell: (row: any) => (row.categories || []).join(', '), sortable: false },
    { name: 'Tags', cell: (row: any) => (row.tags || []).join(', '), sortable: false },
    {
      name: 'Actions', cell: (row: any) => (
        <div className='flex gap-2'>
          <Tooltip title='Preview'>
            <button onClick={() => router.push(`/blog/preview/${row._id}`)} className='text-blue-500'><FaEye /></button>
          </Tooltip>
          <Tooltip title='Edit'>
            <button onClick={() => { setSelectedBlog(row); setIsEditBlogDrawerOpen(true); }} className='text-green-600'><FaEdit /></button>
          </Tooltip>
          <Tooltip title='Delete'>
            <button onClick={() => { setSelectedBlog(row); setIsDeleteBlogDrawerOpen(true); }} className='text-red-500'><FaTrash /></button>
          </Tooltip>
        </div>
      ), width: '140px'
    },
  ];

  return (
    <div className='p-2'>
      <div className='flex flex-col sm:flex-row justify-start h-[30px] md:w-[400px]  items-center mb-4 gap-2'>
        <Input
          label=''
          type='text'
          placeholder='Search blogs...'
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className='border border-danger rounded px-2 py-1 w-full sm:w-64'
        />
        <Button type='button' name='Create blog' className='min-w-[130px]' onClick={() => setIsCreateBlogDrawerOpen(true)} />
      </div>
      <DataTable
        columns={columns}
        data={blogs}
        progressPending={loading}
        onChangeRowsPerPage={handleRowsPerPageChange}
        onChangePage={handlePageChange}
        highlightOnHover
        pointerOnHover
        responsive
        noHeader
        customStyles={{
          header: {
            style: {
              fontSize: "12px",
              minHeight: "30px",
              backgroundColor: "#F9FAFB", // Light mode header background
              color: "#1C243F", // Light mode header text
            },
          },
          headRow: {
            style: {
              fontSize: "12px",
              minHeight: "30px",
              backgroundColor: "#F9FAFB", // Light mode header row background
              borderBottomWidth: "1px",
              borderBottomColor: "#E2E8F0", // stroke
            },
          },
          headCells: {
            style: {
              fontWeight: 700,
              color: "#1C243F", // Light mode header cells text
              backgroundColor: "#F9FAFB", // Light mode header cells background
            },
          },
          cells: {
            style: {
              fontSize: "11px",
              fontWeight: 500,
              wordBreak: "break-word",
              overflowWrap: "break-word",
              height: "27px",
              color: "#1C243F", // Light mode cell text
              backgroundColor: "transparent", // Allow row background to show through
            },
          },
          rows: {
            style: {
              fontSize: "11px",
              minHeight: "27px",
              "&:not(:last-of-type)": {
                borderBottomStyle: "solid",
                borderBottomWidth: "1px",
                borderBottomColor: "#E2E8f0",
              },
              backgroundColor: "transprant",
              color: "#1C243F",
            },
            highlightOnHoverStyle: {
              backgroundColor: "#e4e7f7",
              color: "white",
              cursor: "pointer",
            },
          },
        }}
      />
      <CustomPagination
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        rowCount={limit}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleRowsPerPageChange}
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
    </div>
  );
};

export default Blog;