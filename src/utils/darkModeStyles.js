export const getContentContainerClass = (darkMode) =>
  `${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} shadow rounded-lg p-4 sm:p-6 transition-colors duration-300`;

export const getHeaderClass = (darkMode) =>
  `text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-4 sm:mb-0 transition-colors duration-300`;

export const getSectionHeaderClass = (darkMode) =>
  `text-lg font-medium ${darkMode ? "text-gray-200" : "text-gray-700"} mb-4 transition-colors duration-300`;

export const getFilterSectionClass = (darkMode) =>
  `${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"} p-4 rounded-lg mb-6 shadow transition-colors duration-300`;

export const getFilterContainerClass = (darkMode) =>
  `${darkMode ? "bg-gray-700" : "bg-gray-50"} p-4 rounded-lg mb-6 transition-colors duration-300`;

export const getFormLabelClass = (darkMode) =>
  `block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1 transition-colors duration-300`;

export const getLabelClass = (darkMode) =>
  `block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1 transition-colors duration-300`;

export const getInputClass = (darkMode) =>
  `w-full rounded-md ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-300`;

export const getSelectClass = (darkMode) =>
  `w-full rounded-md ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-300`;

export const getTableClass = (darkMode) =>
  `min-w-full divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"} transition-colors duration-300`;

export const getTableHeaderClass = (darkMode) =>
  `${darkMode ? "bg-gray-700" : "bg-gray-50"} transition-colors duration-300`;

export const getTableHeaderCellClass = (darkMode) =>
  `px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider cursor-pointer transition-colors duration-300`;

export const getTableBodyClass = (darkMode) =>
  `${darkMode ? "bg-gray-800 divide-y divide-gray-700" : "bg-white divide-y divide-gray-200"} transition-colors duration-300`;

export const getTableRowClass = (darkMode) =>
  `hover:${darkMode ? "bg-gray-700" : "bg-gray-50"} transition-colors duration-150`;

export const getTableCellClass = (darkMode) =>
  `px-6 py-4 whitespace-nowrap text-sm ${darkMode ? "text-gray-200" : "text-gray-500"} transition-colors duration-300`;

export const getPrimaryButtonClass = (darkMode) =>
  `px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300`;

export const getSecondaryButtonClass = (darkMode) =>
  `px-4 py-2 border text-sm font-medium rounded-md ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300`;

export const getDisabledButtonClass = (darkMode) =>
  `opacity-50 cursor-not-allowed ${getPrimaryButtonClass(darkMode)}`;

export const getPaginationClass = (darkMode) =>
  `flex items-center justify-between border-t ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} px-4 py-3 sm:px-6 mt-4 transition-colors duration-300`;

export const getSortableHeaderClass = (darkMode, isActive) =>
  `px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider cursor-pointer ${isActive ? (darkMode ? "text-blue-300" : "text-blue-600") : ""} transition-colors duration-300`;
