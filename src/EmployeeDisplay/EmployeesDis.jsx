import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Dropdown, Menu, message } from 'antd';
import { SearchOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Define the EmployeeDis component
const EmployeeDis = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState('id'); // Default search by ID
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('ascend'); // Default sort order
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:8080/employees');
        setEmployees(response.data);
      } catch (error) {
        setError('Error fetching employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Search handler
  const handleSearch = () => {
    if (searchText.trim() === '') {
      message.warning('Please enter search text');
      return;
    }

    let url = '';

    if (searchType === 'id') {
      url = `http://localhost:8080/employees/${searchText}`;
    } else if (searchType === 'name') {
      url = `http://localhost:8080/employees/name/${searchText}`;
    }

    // Fetch data based on the searchType and searchText
    axios
      .get(url)
      .then((response) => {
        setEmployees(searchType === 'id' ? [response.data] : response.data); // Handle single or multiple results
      })
      .catch(() => setError('Error fetching employees'));
  };

  // Sort handler
  const handleSort = (order) => {
    setSortOrder(order);
    const sortedEmployees = [...employees].sort((a, b) => {
      if (a[searchType] < b[searchType]) return order === 'ascend' ? -1 : 1;
      if (a[searchType] > b[searchType]) return order === 'ascend' ? 1 : -1;
      return 0;
    });
    setEmployees(sortedEmployees);
  };

  // Define columns for the table
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Contract Duration',
      dataIndex: ['contract', 'duration'], // Assuming duration is directly available in the contract object
      key: 'contractDuration',
      render: (duration) => `${duration} months`, // Display duration in months
    },
    {
      title: 'Salary',
      dataIndex: 'salary', // Assuming salary is directly available in the contract object
      key: 'salary',
      render: (salary) => `$${salary}`, // Format salary with currency symbol
    },
    {
      title: 'Job',
      key: 'job',
      render: (text, record) => {
        const job = record.job; // Assuming job is directly available in the employee object
        return `${job.major} - ${job.role}`;
      },
    },
  ];

  // Conditional rendering based on the loading and error states
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '24px' }}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '24px', color: 'red' }}>
        {error}
      </div>
    );
  }

  // Render the component
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Space style={{ marginBottom: '16px' }}>
          <Input
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: '200px' }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            Search
          </Button>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item onClick={() => setSearchType('id')}>Search by ID</Menu.Item>
                <Menu.Item onClick={() => setSearchType('name')}>Search by Name</Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Button>Search by {searchType.toUpperCase()}</Button>
          </Dropdown>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item onClick={() => handleSort('ascend')} icon={<SortAscendingOutlined />}>
                  Sort Ascending
                </Menu.Item>
                <Menu.Item onClick={() => handleSort('descend')} icon={<SortDescendingOutlined />}>
                  Sort Descending
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Button>Sort by {searchType.toUpperCase()}</Button>
          </Dropdown>
        </Space>
      </div>
      <Table
        dataSource={employees}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        style={{ marginTop: '16px' }}
      />
      <Button
        type="default"
        style={{ marginTop: '16px' }}
        onClick={() => navigate('/dashboard')} // Navigate back to dashboard
      >
        Return to Dashboard
      </Button>
    </div>
  );
};

export default EmployeeDis;