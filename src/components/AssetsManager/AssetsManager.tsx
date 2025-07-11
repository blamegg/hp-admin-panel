'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogTitle, IconButton, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Close as CloseIcon, Search as SearchIcon, Upload as UploadIcon, FolderOpen as FolderIcon } from '@mui/icons-material';
import { toast } from 'sonner';
import AssetGrid from './AssetGrid';
import UploadZone from './UploadZone';
import { Asset } from '../../types/asset';
import { RootState } from '@/redux/store';
import { fetchAssets, uploadAsset, setSearchParams } from '@/redux/slice/assetsSlice';
import CustomPagination from '../CustomPagination';

interface AssetsManagerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (asset: Asset) => void;
  selectedAsset?: Asset | null;
}

const AssetsManager: React.FC<AssetsManagerProps> = ({
  open,
  onClose,
  onSelect,
  selectedAsset
}) => {
  const dispatch = useDispatch();
  const { assets, loading, uploading, error, searchParams, totalCount } = useSelector((state: RootState) => state.assets);
  const [searchTerm, setSearchTerm] = useState('');
  const [fileType, setFileType] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [allLoaded, setAllLoaded] = useState(false);

  console.log("assets", assets)

  // Fetch assets when searchTerm, fileType, page, or limit changes
  useEffect(() => {
    if (open) {
      dispatch(fetchAssets({
        name: searchTerm,
        type: fileType,
        page,
        limit,
      }) as any);
    }
  }, [open, searchTerm, fileType, page, limit, dispatch]);

  // Reset to page 1 when searchTerm or fileType changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, fileType]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleFileUpload = async (files: FileList) => {
    try {
      await dispatch(uploadAsset(files) as any);
      toast.success(`${files.length} file(s) uploaded successfully`);
      // Fetch the latest assets after upload
      dispatch(fetchAssets(searchParams) as any);
    } catch (error) {
      toast.error('Failed to upload files');
    }
  };

  const handleLocalFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleAssetSelect = (asset: Asset) => {
    onSelect(asset);
    onClose();
  };

  // File type options for normal select
  const fileTypeOptions = [
    { label: 'All', value: '' },
    { label: 'Image', value: 'image' },
    { label: 'Video', value: 'video' },
    { label: 'Word', value: 'word' },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      // maxWidth="lg"
      // fullWidth
      sx={{
        zIndex: 1600 // must be higher than other modals
      }}
      PaperProps={{
        style: {
          borderRadius: '12px',
          maxHeight: '80vh',
        }
      }}
    >
      <DialogTitle className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Assets Manager</h2>
          <p className="text-sm text-gray-500 mt-1">Select or upload images for your blog</p>
        </div>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: "30px" }}>
        {/* Search and Upload Controls */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row  mt-2 mb-6">
          {/* Search Bar */}
          <div className="flex-1 relative flex gap-2">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-graydark/30 rounded-lg focus:ring-1 focus:ring-primary/30 focus:border-transparent outline-0"
            />
            {/* File Type Dropdown - use normal select */}
            <select
              value={fileType}
              onChange={e => setFileType(e.target.value)}
              className="rounded-lg border border-graydark/40 px-3 py-2 text-gray-700 focus:ring-1 focus:ring-primary/30 focus:border-transparent outline-0"
              style={{ minWidth: 100 }}
            >
              {fileTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Upload Button only (no drag and drop, no browse link) */}
          <div className="flex items-center ">
            <button
              type="button"
              onClick={handleLocalFileSelect}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-base font-medium shadow w-full md:w-auto"
              disabled={uploading}
            >
              <UploadIcon />
              {uploading ? 'Uploading...' : 'Upload file'}
            </button>
          </div>
        </div>
        {/* Hidden file input for local file selection */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Scrollable Assets Grid (no scroll handler) */}
        <div
          className="overflow-y-auto"
          style={{
            minHeight:"150px",
            maxHeight:"250px",
            paddingRight: "2px",
          }}
        >
          <AssetGrid
            assets={assets || []}
            onSelect={handleAssetSelect}
            selectedAsset={selectedAsset}
            isLoading={loading}
          />
          {/* No more assets message */}
          {allLoaded && assets.length > 0 && (
            <div className="text-center text-xs text-gray-400 py-2">No more assets to load.</div>
          )}
        </div>
        {/* Custom Pagination Controls */}
        <CustomPagination
          rowsPerPage={limit}
          rowCount={totalCount}
          currentPage={page}
          onChangePage={setPage}
          onChangeRowsPerPage={setLimit}
          rowsPerPageOptions={[4, 8, 40]}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AssetsManager; 