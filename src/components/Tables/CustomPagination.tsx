// CustomPagination.tsx
"use client";
import React from "react";

interface CustomPaginationProps {
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  totalRows: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  rowsPerPage,
  setRowsPerPage,
  totalRows,
  currentPage,
  setCurrentPage,
}) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="pagination-container flex items-center justify-between p-4">
      <button
        className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-700"
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span>{`Page ${currentPage} of ${totalPages}`}</span>
      <button
        className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-700"
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default CustomPagination;
