'use client'
import React from 'react';
import { Button } from '@mui/material';
import Link from 'next/link';

const PermissionDenied: React.FC<{ message?: string }> = ({ message }) => {


  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-6 bg-[#f9fafb] rounded-lg border border-[#e2e8f0] shadow-md">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-16 h-16 text-red mb-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h2 className="text-xl font-bold text-red ">Permission Denied</h2>
      <Link href="/dashboard" className='mb-1'>
        <Button
          type="submit"
          variant="contained"
          className="!mt-6 mb-10 box-border w-full cursor-pointer rounded-lg !border-primary !bg-primary text-white transition hover:bg-opacity-90"
        >
          Back to Home
        </Button>
      </Link>
      <p className="text-base text-gray-700 text-center max-w-md">
        {message || 'You do not have access to view this page or perform any action.'}
      </p>
    </div>
  );
};

export default PermissionDenied; 