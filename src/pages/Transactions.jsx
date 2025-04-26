import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllTransactions } from "../services/transaction.service";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/transactionUtils";
import { useTheme } from "../context/ThemeContext";
import * as darkModeStyles from "../utils/darkModeStyles";

const Transactions = () => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`${darkMode ? "bg-gray-900" : "bg-gray-100"} min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className={darkModeStyles.getHeaderClass(darkMode)}>
          Transactions
        </h1>

        {/* Filters */}
        <div className={darkModeStyles.getFilterSectionClass(darkMode)}>
          <h2 className={darkModeStyles.getSectionHeaderClass(darkMode)}>
            Filters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={darkModeStyles.getFormLabelClass(darkMode)}>
                Status
              </label>
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className={darkModeStyles.getInputClass(darkMode)}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={darkModeStyles.getFormLabelClass(darkMode)}>
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateChange(e, "startDate")}
                className={darkModeStyles.getInputClass(darkMode)}
              />
            </div>
            <div>
              <label className={darkModeStyles.getFormLabelClass(darkMode)}>
                End Date
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateChange(e, "endDate")}
                className={darkModeStyles.getInputClass(darkMode)}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={resetFilters}
              className={darkModeStyles.getSecondaryButtonClass(darkMode)}
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className={darkModeStyles.getPrimaryButtonClass(darkMode)}
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div
            className={`${darkMode ? "bg-red-900 bg-opacity-20 border-red-700" : "bg-red-100 border-red-400"} border text-red-700 px-4 py-3 rounded relative mb-4`}
            role="alert"
          >
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Loading indicator or Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div
              className={`w-12 h-12 border-4 ${darkMode ? "border-gray-600 border-t-blue-500" : "border-gray-200 border-t-blue-600"} rounded-full animate-spin`}
            ></div>
          </div>
        ) : (
          <>
            {/* Transactions table */}
            <div className={darkModeStyles.getContentContainerClass(darkMode)}>
              <div className="overflow-x-auto">
                <table className={darkModeStyles.getTableClass(darkMode)}>
                  <thead
                    className={darkModeStyles.getTableHeaderClass(darkMode)}
                  >
                    <tr>
                      <th
                        className={darkModeStyles.getSortableHeaderClass(
                          darkMode,
                          sortConfig.field === "collect_id"
                        )}
                        onClick={() => handleSortChange("collect_id")}
                      >
                        <div className="flex items-center">
                          Transaction ID
                          {sortConfig.field === "collect_id" && (
                            <span className="ml-1">
                              {sortConfig.order === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        className={darkModeStyles.getSortableHeaderClass(
                          darkMode,
                          sortConfig.field === "school_id"
                        )}
                        onClick={() => handleSortChange("school_id")}
                      >
                        <div className="flex items-center">
                          School ID
                          {sortConfig.field === "school_id" && (
                            <span className="ml-1">
                              {sortConfig.order === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        className={darkModeStyles.getSortableHeaderClass(
                          darkMode,
                          sortConfig.field === "gateway"
                        )}
                        onClick={() => handleSortChange("gateway")}
                      >
                        <div className="flex items-center">
                          Gateway
                          {sortConfig.field === "gateway" && (
                            <span className="ml-1">
                              {sortConfig.order === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        className={darkModeStyles.getSortableHeaderClass(
                          darkMode,
                          sortConfig.field === "order_amount"
                        )}
                        onClick={() => handleSortChange("order_amount")}
                      >
                        <div className="flex items-center">
                          Order Amount
                          {sortConfig.field === "order_amount" && (
                            <span className="ml-1">
                              {sortConfig.order === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        className={darkModeStyles.getSortableHeaderClass(
                          darkMode,
                          sortConfig.field === "transaction_amount"
                        )}
                        onClick={() => handleSortChange("transaction_amount")}
                      >
                        <div className="flex items-center">
                          Transaction Amount
                          {sortConfig.field === "transaction_amount" && (
                            <span className="ml-1">
                              {sortConfig.order === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        className={darkModeStyles.getSortableHeaderClass(
                          darkMode,
                          sortConfig.field === "status"
                        )}
                        onClick={() => handleSortChange("status")}
                      >
                        <div className="flex items-center">
                          Status
                          {sortConfig.field === "status" && (
                            <span className="ml-1">
                              {sortConfig.order === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        className={darkModeStyles.getSortableHeaderClass(
                          darkMode,
                          sortConfig.field === "payment_time"
                        )}
                        onClick={() => handleSortChange("payment_time")}
                      >
                        <div className="flex items-center">
                          Payment Time
                          {sortConfig.field === "payment_time" && (
                            <span className="ml-1">
                              {sortConfig.order === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className={darkModeStyles.getTableBodyClass(darkMode)}>
                    {transactions.length > 0 ? (
                      transactions.map((transaction) => (
                        <tr
                          key={transaction.collect_id}
                          className={darkModeStyles.getTableRowClass(darkMode)}
                        >
                          <td
                            className={darkModeStyles.getTableCellClass(
                              darkMode
                            )}
                          >
                            {transaction.custom_order_id ||
                              transaction.collect_id ||
                              "N/A"}
                          </td>
                          <td
                            className={darkModeStyles.getTableCellClass(
                              darkMode
                            )}
                          >
                            {transaction.school_id || "N/A"}
                          </td>
                          <td
                            className={darkModeStyles.getTableCellClass(
                              darkMode
                            )}
                          >
                            {transaction.gateway || "N/A"}
                          </td>
                          <td
                            className={darkModeStyles.getTableCellClass(
                              darkMode
                            )}
                          >
                            ₹{transaction.order_amount?.toFixed(2) || "N/A"}
                          </td>
                          <td
                            className={darkModeStyles.getTableCellClass(
                              darkMode
                            )}
                          >
                            ₹
                            {transaction.transaction_amount?.toFixed(2) ||
                              "N/A"}
                          </td>
                          <td
                            className={darkModeStyles.getTableCellClass(
                              darkMode
                            )}
                          >
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${
                                  transaction.status === "success"
                                    ? "bg-green-100 text-green-800"
                                    : transaction.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                } ${darkMode ? "bg-opacity-20" : ""}`}
                            >
                              {transaction.status || "N/A"}
                            </span>
                          </td>
                          <td
                            className={darkModeStyles.getTableCellClass(
                              darkMode
                            )}
                          >
                            {formatDate(transaction.payment_time)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className={`px-6 py-4 text-center ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                        >
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {transactions.length > 0 && (
                <div className={darkModeStyles.getPaginationClass(darkMode)}>
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className={`${darkModeStyles.getSecondaryButtonClass(darkMode)} ${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === pagination.totalPages}
                      className={`${darkModeStyles.getSecondaryButtonClass(darkMode)} ml-3 ${page === pagination.totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p
                        className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Showing{" "}
                        <span className="font-medium">
                          {transactions.length > 0 ? (page - 1) * limit + 1 : 0}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(page * limit, pagination.total)}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">{pagination.total}</span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <nav
                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page === 1}
                          className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${darkMode ? "text-gray-300 ring-gray-700 hover:bg-gray-800" : "text-gray-400 ring-gray-300 hover:bg-gray-50"} ring-1 ring-inset ${page === 1 ? "opacity-50 cursor-not-allowed" : "focus:z-20 focus:outline-offset-0"}`}
                        >
                          <span className="sr-only">Previous</span>
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>

                        {/* Page numbers */}
                        {[...Array(pagination.totalPages)].map((_, idx) => {
                          const pageNumber = idx + 1;
                          // Only show a window of 5 pages centered around current page
                          if (
                            pageNumber === 1 ||
                            pageNumber === pagination.totalPages ||
                            (pageNumber >= page - 2 && pageNumber <= page + 2)
                          ) {
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                  page === pageNumber
                                    ? `z-10 ${darkMode ? "bg-blue-700" : "bg-blue-600"} text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`
                                    : `${darkMode ? "text-gray-300 ring-gray-700 hover:bg-gray-800" : "text-gray-900 ring-gray-300 hover:bg-gray-50"} ring-1 ring-inset focus:outline-offset-0`
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          }

                          // Show ellipsis
                          if (
                            (pageNumber === 2 && page > 4) ||
                            (pageNumber === pagination.totalPages - 1 &&
                              page < pagination.totalPages - 3)
                          ) {
                            return (
                              <span
                                key={`ellipsis-${pageNumber}`}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${darkMode ? "text-gray-300 ring-gray-700" : "text-gray-700 ring-gray-300"} ring-1 ring-inset`}
                              >
                                ...
                              </span>
                            );
                          }

                          return null;
                        })}

                        <button
                          onClick={() => handlePageChange(page + 1)}
                          disabled={page === pagination.totalPages}
                          className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${darkMode ? "text-gray-300 ring-gray-700 hover:bg-gray-800" : "text-gray-400 ring-gray-300 hover:bg-gray-50"} ring-1 ring-inset ${page === pagination.totalPages ? "opacity-50 cursor-not-allowed" : "focus:z-20 focus:outline-offset-0"}`}
                        >
                          <span className="sr-only">Next</span>
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Transactions;
