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

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page when rows per page changes
  };

  return (
    <div className="pagination-container">
      <select onChange={handleRowsPerPageChange} value={rowsPerPage}>
        {[5, 10, 20].map((size) => (
          <option key={size} value={size}>
            {size} rows per page
          </option>
        ))}
      </select>
      <button
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span>{`Page ${currentPage} of ${totalPages}`}</span>
      <button
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default CustomPagination;
