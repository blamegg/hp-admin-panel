import React from "react";

interface CustomPaginationProps {
  rowsPerPage: number;
  rowCount: number;
  currentPage: number;
  onChangePage: (page: number) => void;
  onChangeRowsPerPage: (rowsPerPage: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  rowsPerPage,
  rowCount,
  onChangePage,
  currentPage,
  onChangeRowsPerPage,
}) => {
  const pages = Math.ceil(rowCount / rowsPerPage);
  const startEntry = (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, rowCount);

  const handlePageChange = (page: number) => {
    onChangePage(page);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pages - 1, startPage + maxVisiblePages - 1);

    if (endPage === pages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    if (startPage > 0) {
      items.push(
        <button
          key={0}
          className={`rounded-md border px-3 py-0 ${
            currentPage === 1 ? "bg-gray-300" : "hover:bg-gray-200"
          }`}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>,
      );
      if (startPage > 1) {
        items.push(
          <span key="ellipsis-start" className="px-2">
            ...
          </span>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <button
          key={i}
          className={`rounded-md border px-3 py-0 ${
            i + 1 === currentPage
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200"
          }`}
          onClick={() => handlePageChange(i + 1)}
        >
          {i + 1}
        </button>,
      );
    }

    if (endPage < pages - 1) {
      if (endPage < pages - 2) {
        items.push(
          <span key="ellipsis-end" className="px-3">
            ...
          </span>,
        );
      }
      items.push(
        <button
          key={pages}
          className="hover:bg-gray-200 rounded-md border px-2 py-0"
          onClick={() => handlePageChange(pages)}
        >
          {pages}
        </button>,
      );
    }

    return items;
  };

  return (
    <div className="my-4 flex flex-col items-center justify-between text-[12px] font-medium md:flex-row">
      <div className="text-gray-600 mb-2 text-[12px] font-medium md:mb-0 ">
        {`Showing ${startEntry} to ${endEntry} of ${rowCount} entries`}
      </div>
      <div className="flex space-x-2">
        <button
          className={`rounded-md border px-2 py-0 ${
            currentPage === 1 ? "bg-gray-300" : "hover:bg-gray-200"
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <i className="icon icon-prev-arrow"></i> Prev
        </button>

        {renderPaginationItems()}

        <button
          className={`rounded-md border px-2 py-0 ${
            currentPage === pages ? "bg-gray-300" : "hover:bg-gray-200"
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pages}
        >
          Next <i className="icon icon-next-arrow"></i>
        </button>
      </div>
    </div>
  );
};

export default CustomPagination;
