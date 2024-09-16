import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Table, Select, Switch, Radio, Button, message, Spin } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import moment from 'moment';
import { FaMinus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const { Search } = Input;
const { Option } = Select;

const ContractList = () => {
  const navigate = useNavigate(); // Use useNavigate hook
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [sortKey, setSortKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchType, setSearchType] = useState('id');
  const [showSearchChoices, setShowSearchChoices] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/contracts');
      setContracts(response.data);
      setFilteredContracts(response.data);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      message.error('Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    const filteredData = contracts.filter((contract) => {
      if (searchType === 'id') {
        return contract.id.toString().includes(value);
      }
      if (searchType === 'duration') {
        return Math.floor(contract.duration / 12).toString().includes(value); // Convert to integer years
      }
      return false;
    });
    setFilteredContracts(filteredData);
  };

  const handleSort = (key) => {
    const sortedData = [...filteredContracts].sort((a, b) => {
      if (key === 'salaryperyear') {
        return a.salaryperyear - b.salaryperyear;
      }
      if (key === 'duration') {
        return a.duration - b.duration;
      }
      if (key === 'id') {
        return a.id - b.id;
      }
      return 0;
    });
    setFilteredContracts(sortedData);
    setSortKey(key);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const deleteContract = async (id) => {
    setLoading(true); // Show loading indicator while deleting
    try {
      await axios.delete(`http://localhost:8080/contracts/delete/${id}`);
      message.success('Contract deleted successfully!');
      fetchContracts(); // Refresh the contract list after deletion
    } catch (error) {
      console.error('Error deleting contract:', error);
      message.error('Failed to delete contract');
    } finally {
      setLoading(false); // Hide loading indicator after deletion
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Start Date',
      dataIndex: 'start',
      key: 'start',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'End Date',
      dataIndex: 'end',
      key: 'end',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Duration (years)',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => Math.floor(duration / 12), // Convert duration to integer years
    },
    {
      title: 'Salary per Year',
      dataIndex: 'salaryperyear',
      key: 'salaryperyear',
      sorter: (a, b) => a.salaryperyear - b.salaryperyear,
      sortOrder: sortKey === 'salaryperyear' ? 'ascend' : null,
    },
    {
      title: <span style={{ color: 'red' }}>Delete</span>,
      key: 'action',
      className: 'delete-column',
      render: (_, record) => (
        <Button
          type="link"
          icon={<FaMinus />}
          onClick={() => deleteContract(record.id)}
          style={{ color: 'red' }}
        />
      ),
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        background: darkMode ? '#001f3f' : '#f0f2f5',
        minHeight: '100vh',
        width: '100vw',
        transition: 'background-color 0.5s ease, color 0.5s ease',
        color: darkMode ? '#fff' : '#000',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Button
          type="primary"
          onClick={() => navigate('/dashboard')} // Navigate to dashboard
          style={{ marginRight: '16px' }}
        >
          Return to Dashboard
        </Button>
        <h2
          style={{
            fontSize: '32px',
            color: darkMode ? '#fff' : '#007bff',
            transition: 'color 0.5s ease',
            margin: 0,
          }}
        >
          Contracts
        </h2>
        <Switch
          checked={darkMode}
          onChange={toggleDarkMode}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          style={{ marginLeft: 'auto' }}
        />
      </div>
      <div
        style={{
          marginBottom: '16px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          flexWrap: 'wrap',
        }}
      >
        <Search
          placeholder={`Search by ${searchType}`}
          onSearch={handleSearch}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowSearchChoices(true)}
          onBlur={() => setTimeout(() => setShowSearchChoices(false), 200)} // Delay hiding to allow click
          style={{ width: 200, marginRight: '16px', flexShrink: 0 }}
        />
        <Select
          placeholder="Sort by"
          onChange={handleSort}
          value={sortKey}
          style={{ width: 150, flexShrink: 0 }}
        >
          <Option value="id">ID</Option>
          <Option value="salaryperyear">Salary per Year</Option>
          <Option value="duration">Duration</Option>
        </Select>
        {showSearchChoices && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              zIndex: 100,
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: '4px',
              width: '200px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              maxHeight: '150px',
              overflowY: 'auto',
              transition: 'opacity 0.3s ease',
            }}
          >
            <Radio.Group
              value={searchType}
              onChange={handleSearchTypeChange}
              style={{ display: 'flex', flexDirection: 'column', padding: '8px' }}
            >
              <Radio.Button value="id" style={{ marginBottom: '8px' }}>Search by ID</Radio.Button>
              <Radio.Button value="duration">Search by Duration</Radio.Button>
            </Radio.Group>
          </div>
        )}
      </div>
      <Spin spinning={loading} tip="Loading..." delay={300}>
        <Table
          columns={columns}
          dataSource={filteredContracts}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          style={{ width: '100%', height: '100%', flex: 1 }}
          scroll={{ y: 'calc(100vh - 200px)' }}
          className="contract-table"
        />
      </Spin>
      {/* CSS for hover effect */}
      <style jsx>{`
        .contract-table .delete-column {
          opacity: 0;
          transition: opacity 0.3s;
        }
        .contract-table:hover .delete-column {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default ContractList;