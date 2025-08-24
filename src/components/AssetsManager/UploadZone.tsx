'use client';

import React, { useState, useRef, DragEvent } from 'react';

interface UploadZoneProps {
  onUpload: (files: FileList) => void;
  uploading?: boolean;
  children: React.ReactNode;
  accept?: string;
  maxSize?: number; // in MB
}

const UploadZone: React.FC<UploadZoneProps> = ({
  onUpload,
  uploading = false,
  children,
  accept = 'image/*',
  maxSize = 10
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: FileList): FileList | null => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      // Check file type
      if (accept !== '*/*' && !file.type.match(accept.replace('*', '.*'))) {
        errors.push(`${file.name} is not a valid file type`);
        return;
      }

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        errors.push(`${file.name} is too large (max ${maxSize}MB)`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      setDragError(errors.join(', '));
      setTimeout(() => setDragError(null), 3000);
      return null;
    }

    return validFiles as unknown as FileList;
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
    setDragError(null);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const validFiles = validateFiles(files);
    if (validFiles && !uploading) {
      onUpload(validFiles);
    }
  };

  const handleClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && !uploading) {
      const validFiles = validateFiles(files);
      if (validFiles) {
        onUpload(validFiles);
      }
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  return (
    <div
      className={`relative ${uploading ? 'pointer-events-none opacity-50' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Drag overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg z-10 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📁</div>
            <p className="text-primary font-medium">Drop files here to upload</p>
          </div>
        </div>
      )}

      {/* Error message */}
      {dragError && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-sm p-2 rounded-t-lg z-20">
          {dragError}
        </div>
      )}

      {/* Uploading overlay */}
      {uploading && (
        <div className="absolute inset-0 bg-white/80 rounded-lg z-10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        </div>
      )}

      {/* Children with click handler */}
      <div onClick={handleClick} className="cursor-pointer">
        {children}
      </div>
    </div>
  );
};

export default UploadZone; 