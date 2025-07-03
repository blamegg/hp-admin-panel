"use client";

import React from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

interface BlogEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function BlogEditor({ value, onChange, error }: BlogEditorProps) {
  return (
    <div className={`border rounded ${error ? 'border-danger' : 'border-stroke'}`}>
      <ReactQuill
        value={value}
        onChange={onChange}
        theme="snow"
      />
    </div>
  );
} 