"use client";

import React, { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { AssetsManager } from "../AssetsManager";
import { Asset } from "@/types/asset";

const toolbarOptions = [
  [{ 'header': [1, 2, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  ['link', 'image'], // Keep image option for custom handler
  ['clean']
];

interface BlogEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Global variable to store Quill instance
let globalQuillInstance: any = null;

export default function BlogEditor({ value, onChange, error }: BlogEditorProps) {
  const [showAssetsManager, setShowAssetsManager] = useState(false);

  // Custom image handler
  const imageHandler = useCallback(() => {
    setShowAssetsManager(true);
  }, []);

  // Handle asset selection
  const handleAssetSelect = useCallback((asset: Asset) => {
    let url = asset.url;
    if (!/^https?:\/\//.test(url) && !url.startsWith('blob:')) {
      url = `${process.env.NEXT_PUBLIC_BASE_URL}/${url.replace(/^\/+/, '')}`;
    }
    if (globalQuillInstance) {
      const range = globalQuillInstance.getSelection();
      if (range) {
        // Insert the image at the current cursor position
        globalQuillInstance.insertEmbed(range.index, 'image', url);
        // Move cursor after the image
        globalQuillInstance.setSelection(range.index + 1);
      } else {
        // If no selection, insert at the end
        const length = globalQuillInstance.getLength();
        globalQuillInstance.insertEmbed(length - 1, 'image', url);
        globalQuillInstance.setSelection(length);
      }
    }
  }, []);

  // Store Quill instance when component mounts
  useEffect(() => {
    const interval = setInterval(() => {
      const quillElement = document.querySelector('.ql-editor');
      if (quillElement && quillElement.parentElement) {
        const quill = (quillElement.parentElement as any).__quill;
        if (quill) {
          globalQuillInstance = quill;
          clearInterval(interval);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Custom modules with image handler
  const modules = {
    toolbar: {
      container: toolbarOptions,
      handlers: {
        image: imageHandler
      }
    }
  };

  return (
    <>
      <div className={`border rounded ${error ? 'border-danger' : 'border-stroke'}`}>
        <ReactQuill
          value={value}
          onChange={onChange}
          theme="snow"
          modules={modules}
        />
      </div>

      {/* Assets Manager Modal */}
      <AssetsManager
        open={showAssetsManager}
        onClose={() => setShowAssetsManager(false)}
        onSelect={handleAssetSelect}
      />
    </>
  );
} 