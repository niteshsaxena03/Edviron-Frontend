import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Input,
  DatePicker,
  Select,
  Space,
  Pagination,
  message,
} from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import moment from "moment";
import TransactionService from "../services/transaction.service";
import {
  TRANSACTION_STATUS,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  DATE_FORMAT,
} from "../config";

const { RangePicker } = DatePicker;
const { Option } = Select;

const statusColors = {
  [TRANSACTION_STATUS.PENDING]: "gold",
  [TRANSACTION_STATUS.PROCESSING]: "blue",
  [TRANSACTION_STATUS.COMPLETED]: "green",
  [TRANSACTION_STATUS.FAILED]: "red",
  [TRANSACTION_STATUS.REFUNDED]: "purple",
  [TRANSACTION_STATUS.CANCELLED]: "gray",
};

const TransactionTable = ({ schoolId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  });
  const [filters, setFilters] = useState({
    studentName: "",
    status: [],
    dateRange: [],
    paymentMethod: "",
  });
  const [sortedInfo, setSortedInfo] = useState({});

  useEffect(() => {
    fetchTransactions();
  }, [schoolId, pagination.current, pagination.pageSize, filters, sortedInfo]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const queryParams = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        sortField: sortedInfo.field || "createdAt",
        sortOrder: sortedInfo.order
          ? sortedInfo.order === "ascend"
            ? "asc"
            : "desc"
          : "desc",
      };

      if (filters.studentName) {
        queryParams.studentName = filters.studentName;
      }

      if (filters.status && filters.status.length > 0) {
        queryParams.status = filters.status;
      }

      if (filters.dateRange && filters.dateRange.length === 2) {
        queryParams.startDate = filters.dateRange[0].format("YYYY-MM-DD");
        queryParams.endDate = filters.dateRange[1].format("YYYY-MM-DD");
      }

      if (filters.paymentMethod) {
        queryParams.paymentMethod = filters.paymentMethod;
      }

      const response = await TransactionService.getTransactionsBySchool(
        schoolId,
        queryParams
      );

      setTransactions(response.data.data);
      setPagination({
        ...pagination,
        total: response.data.meta.total,
      });
    } catch (error) {
      message.error("Failed to fetch transactions");
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination({
      ...pagination,
    });
    setSortedInfo(sorter);
  };

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    });
    // Reset to first page when filters change
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  const handleExport = async () => {
    try {
      setLoading(true);

      const exportParams = { ...filters };
      if (filters.dateRange && filters.dateRange.length === 2) {
        exportParams.startDate = filters.dateRange[0].format("YYYY-MM-DD");
        exportParams.endDate = filters.dateRange[1].format("YYYY-MM-DD");
        delete exportParams.dateRange;
      }

      const response = await TransactionService.exportTransactions(
        schoolId,
        exportParams
      );

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `transactions-${moment().format("YYYY-MM-DD")}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success("Transactions exported successfully");
    } catch (error) {
      message.error("Failed to export transactions");
      console.error("Error exporting transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <a>{text}</a>,
      sorter: true,
      sortOrder: sortedInfo.field === "id" && sortedInfo.order,
    },
    {
      title: "Student",
      dataIndex: "studentName",
      key: "studentName",
      sorter: true,
      sortOrder: sortedInfo.field === "studentName" && sortedInfo.order,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount, record) =>
        `${record.currency} ${parseFloat(amount).toFixed(2)}`,
      sorter: true,
      sortOrder: sortedInfo.field === "amount" && sortedInfo.order,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      filters: [
        { text: "Credit Card", value: "credit_card" },
        { text: "Bank Transfer", value: "bank_transfer" },
        { text: "Cash", value: "cash" },
      ],
      onFilter: (value, record) => record.paymentMethod === value,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format(DATE_FORMAT),
      sorter: true,
      sortOrder: sortedInfo.field === "createdAt" && sortedInfo.order,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status] || "default"}>{status}</Tag>
      ),
      filters: Object.entries(TRANSACTION_STATUS).map(([key, value]) => ({
        text: value,
        value,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button size="small" type="primary">
            View
          </Button>
          {record.status !== TRANSACTION_STATUS.REFUNDED &&
            record.status === TRANSACTION_STATUS.COMPLETED && (
              <Button size="small">Refund</Button>
            )}
        </Space>
      ),
    },
  ];

  return (
    <div className="transaction-table">
      <div className="filters" style={{ marginBottom: 16 }}>
        <Space wrap style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search by student name"
            value={filters.studentName}
            onChange={(e) => handleFilterChange("studentName", e.target.value)}
            allowClear
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
          />
          <Select
            mode="multiple"
            placeholder="Status"
            value={filters.status}
            onChange={(value) => handleFilterChange("status", value)}
            style={{ width: 200 }}
            allowClear
          >
            {Object.entries(TRANSACTION_STATUS).map(([key, value]) => (
              <Option key={key} value={value}>
                {value}
              </Option>
            ))}
          </Select>
          <RangePicker
            value={filters.dateRange}
            onChange={(dates) => handleFilterChange("dateRange", dates)}
            format={DATE_FORMAT}
          />
          <Select
            placeholder="Payment Method"
            value={filters.paymentMethod}
            onChange={(value) => handleFilterChange("paymentMethod", value)}
            style={{ width: 150 }}
            allowClear
          >
            <Option value="credit_card">Credit Card</Option>
            <Option value="bank_transfer">Bank Transfer</Option>
            <Option value="cash">Cash</Option>
          </Select>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            loading={loading}
          >
            Export
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={transactions}
        rowKey="id"
        pagination={false}
        loading={loading}
        onChange={handleTableChange}
        size="middle"
      />

      <div style={{ marginTop: 16, textAlign: "right" }}>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `Total ${total} items`}
          onChange={(page, pageSize) =>
            setPagination({ ...pagination, current: page, pageSize })
          }
          onShowSizeChange={(current, size) =>
            setPagination({ ...pagination, current: 1, pageSize: size })
          }
          pageSizeOptions={PAGE_SIZE_OPTIONS}
        />
      </div>
    </div>
  );
};

export default TransactionTable;
