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
import { fetchBlogs,  } from '@/redux/slice/blog/blogSlice';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { Tooltip } from '@mui/material';
import useDebounce from '@/hooks/useDebounce';
import CustomPagination from '../CustomPagination';
import Input from '../common/Input';
import Select from '../common/Select';

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
];

const filterOptions = [
  { value: 'title', label: 'Title' },
  { value: 'author', label: 'Author' },
  { value: 'tag', label: 'Tag' },
  { value: 'category', label: 'Category' },
  { value: 'status', label: 'Status' },
];

const Blog = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, loading, total, currentPage, limit } = useSelector((state: RootState) => state.blogs);
  const [isCreateBlogDrawerOpen, setIsCreateBlogDrawerOpen] = useState(false);
  const [isEditBlogDrawerOpen, setIsEditBlogDrawerOpen] = useState(false);

  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [filterTitle, setFilterTitle] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategories, setFilterCategories] = useState('');
  const [filterTags, setFilterTags] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  const debouncedFilterTitle = useDebounce(filterTitle, 500);
  const debouncedFilterAuthor = useDebounce(filterAuthor, 500);
  const debouncedFilterStatus = useDebounce(filterStatus, 500);
  const debouncedFilterCategories = useDebounce(filterCategories, 500);
  const debouncedFilterTags = useDebounce(filterTags, 500);
  const debouncedMobileFilterValue = useDebounce(filterValue, 500);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const router = useRouter();

  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [deleteDrawerOpen, setDeleteDrawerOpen] = useState(false);
  const [deleteAction, setDeleteAction] = useState<'single' | 'selected' | 'all' | 'draft' | 'published'>('single');


  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile filter effect
  useEffect(() => {
    if (!isMobile) return;
    let filters: any = { page, limit: rowsPerPage };
    if (filterType && debouncedMobileFilterValue) {
      if (filterType === 'status') {
        filters.status = debouncedMobileFilterValue;
      } else if (filterType === 'category') {
        filters.category = [debouncedMobileFilterValue];
      } else if (filterType === 'tag') {
        filters.tag = [debouncedMobileFilterValue];
      } else {
        filters[filterType] = debouncedMobileFilterValue;
      }
    }
    dispatch(fetchBlogs(filters));
  }, [dispatch, page, rowsPerPage, filterType, debouncedMobileFilterValue, isMobile]);

  // Desktop filter effect
  useEffect(() => {
    if (isMobile) return;
    dispatch(fetchBlogs({
      page,
      limit: rowsPerPage,
      title: debouncedFilterTitle,
      author: debouncedFilterAuthor,
      status: debouncedFilterStatus,
      category: debouncedFilterCategories ? [debouncedFilterCategories] : [],
      tag: debouncedFilterTags ? [debouncedFilterTags] : [],
    }));
  }, [dispatch, page, rowsPerPage, debouncedFilterTitle, debouncedFilterAuthor, debouncedFilterStatus, debouncedFilterCategories, debouncedFilterTags, isMobile]);

  const handlePageChange = (p: number) => setPage(p);
  const handleRowsPerPageChange = (n: number) => { setRowsPerPage(n); setPage(1); };

  const handleDeleteSelected = () => {
    setDeleteAction('selected');
    setDeleteDrawerOpen(true);
  };
  const handleDeleteAll = () => {
    setSelectedRows(blogs);
    setDeleteAction('selected');
    setDeleteDrawerOpen(true);
  };
  const handleDeleteDrafted = () => {
    setDeleteAction('draft');
    setDeleteDrawerOpen(true);
  };
  const handleDeletePublished = () => {
    setDeleteAction('published');
    setDeleteDrawerOpen(true);
  };


  // Add select all toggle logic
  const allSelected = blogs.length > 0 && selectedRows.length === blogs.length;
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(blogs);
    }
  };

  // Add indeterminate logic
  const someSelected = selectedRows.length > 0 && selectedRows.length < blogs.length;

  const columns = [
    {
      name: (
        <input
          type="checkbox"
          checked={allSelected}
          ref={el => {
            if (el) el.indeterminate = someSelected;
          }}
          onChange={handleSelectAll}
        />
      ),
      cell: (row: any) => (
        <input
          type="checkbox"
          checked={selectedRows.some(r => r._id === row._id)}
          onChange={e => {
            if (e.target.checked) setSelectedRows([...selectedRows, row]);
            else setSelectedRows(selectedRows.filter(r => r._id !== row._id));
          }}
        />
      ),
      width: '45px',
    },
    { name: 'S No', selector: (row: any) => (currentPage - 1) * rowsPerPage + ((blogs.indexOf(row) ?? -1) + 1), sortable: true, width: "75px" },
    { name: 'Author', selector: (row: any) => row?.author?.name, sortable: true },
    { name: 'Title', selector: (row: any) => row.title || <span className='text-primary/70'>Not added</span>, sortable: true },
    { name: 'Status', selector: (row: any) => row.status || <span className='text-primary/70'>Not added</span>, sortable: true },
    { name: 'Categories', cell: (row: any) => (row.categories.slice(0,2) || []).join(', ') || <span className='text-primary/70'>Not added</span>, sortable: false },
    { name: 'Tags', cell: (row: any) => (row.tags.slice(0,2) || []).join(', ') || <span className='text-primary/70'>Not added</span>, sortable: false },
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
            <button onClick={() => { setSelectedBlog(row); setDeleteAction('single'); setDeleteDrawerOpen(true); }} className='text-red-500'><FaTrash /></button>
          </Tooltip>
        </div>
      ), width: '140px'
    },
  ];

  // Add this handler to clear selection on drawer close
  const handleDeleteDrawerClose = () => {
    setDeleteDrawerOpen(false);
    setSelectedRows([]);
  };

  return (
    <div className='p-2'>

      {/* Filter Bar */}
      {isMobile ? (
        <div className="flex flex-wrap gap-2 mb-4 items-end">
          <div>
            <Select
              label="Search by"
              options={filterOptions}
              value={filterType}
              onChange={e => {
                setFilterType(e.target.value);
                setFilterValue('');
              }}
            />
          </div>
          {filterType && (
            <div>
              {filterType === 'status' ? (
                <Select
                  label="Search by Status"
                  options={statusOptions}
                  value={filterValue}
                  onChange={e => setFilterValue(e.target.value)}
                />
              ) : (
                <Input
                  label={`Search by ${filterOptions.find(opt => opt.value === filterType)?.label || ''}`}
                  type="text"
                  placeholder={`Search by ${filterOptions.find(opt => opt.value === filterType)?.label?.toLowerCase()}`}
                  value={filterValue}
                  onChange={e => setFilterValue(e.target.value)}
                />
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 items-end gap-2 mb-2">
          <div>
            <Input
              label="Title"
              type="text"
              placeholder="Filter by title"
              value={filterTitle}
              onChange={e => setFilterTitle(e.target.value)}
            />
          </div>
          <div>
            <Input
              label="Author"
              type="text"
              placeholder="Filter by author"
              value={filterAuthor}
              onChange={e => setFilterAuthor(e.target.value)}
            />
          </div>
          <div>
            <Select
              label="Status"
              options={statusOptions}
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            />
          </div>
          <div>
            <Input
              label="Category"
              type="text"
              placeholder="Filter by category"
              value={filterCategories}
              onChange={e => setFilterCategories(e.target.value)}
            />
          </div>
          <div>
            <Input
              label="Tag"
              type="text"
              placeholder="Filter by tag"
              value={filterTags}
              onChange={e => setFilterTags(e.target.value)}
            />
          </div>
        </div>
      )}
      <div className='flex justify-start items-center gap-2 mb-2'>
        <div>
          <Button type='button' name='Create blog' className='min-w-[130px]' onClick={() => setIsCreateBlogDrawerOpen(true)} />
        </div>
        <Button type="button" name="Delete drafted" className="bg-danger/80" onClick={handleDeleteDrafted} />
        <Button type="button" name="Delete published" className="bg-danger/80" onClick={handleDeletePublished} />
        {/* Only show Delete Selected if more than one but not all blogs are selected */}
        {selectedRows.length > 0 && selectedRows.length < blogs.length && (
          <Button type="button" name="Delete selected" className="bg-danger/80" onClick={handleDeleteSelected} />
        )}
        {/* Only show Delete All if all blogs are selected */}
        {selectedRows.length > 0 && selectedRows.length === blogs.length && (
          <Button type="button" name="Delete all" className="bg-danger/80" onClick={handleDeleteAll} />
        )}
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
        rowCount={total}
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
        isDeleteBlogDrawerOpen={deleteDrawerOpen}
        toggleDrawer={handleDeleteDrawerClose}
        blog={deleteAction === 'single' ? selectedBlog : undefined}
        action={deleteAction}
        selectedBlogs={deleteAction === 'selected' ? selectedRows : []}
      />
    </div>
  );
};

export default Blog;