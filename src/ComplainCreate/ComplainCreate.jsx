import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Select, Button, message, Switch } from 'antd';
import { SunOutlined, MoonOutlined, ArrowLeftOutlined } from '@ant-design/icons'; // Import ArrowLeftOutlined
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const { Option } = Select;

const AddComplain = () => {
  const [employeeId, setEmployeeId] = useState(null);
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState(null);
  const [reason, setReason] = useState('');
  const [complainType, setComplainType] = useState('warning');
  const [amount, setAmount] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:8080/employees');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
        message.error('Failed to fetch employees');
      }
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async () => {
    if (!employeeId || !subject || !date || !reason || amount <= 0) {
      message.error('Please fill in all fields correctly!');
      return;
    }

    // Prepare request data based on complainType
    const requestData = {
      type: complainType,
      subject,
      date: date.toISOString(),
      reason,
      [complainType === 'warning' ? 'deduction' : 'bonus']: amount,
      employee: { id: employeeId },
    };

    try {
      // Send request to create a warning or bonus
      const endpoint = complainType === 'warning' ? 'warning' : 'bonus';
      await axios.post(`http://localhost:8080/${endpoint}`, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Send request to adjust salary based on the complain type
      const salaryEndpoint = complainType === 'warning' ? 'deduct' : 'bonus';
      await axios.post(`http://localhost:8080/employees/${employeeId}/${salaryEndpoint}`, 
        complainType === 'warning' ? { deduction: amount } : { bonus: amount },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      message.success('Request added and processed successfully!');
      resetForm();
    } catch (error) {
      console.error('Error processing request:', error);
      message.error('Failed to process request');
    }
  };

  const resetForm = () => {
    setEmployeeId(null);
    setSubject('');
    setDate(null);
    setReason('');
    setComplainType('warning');
    setAmount(0);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleReturn = () => {
    navigate('/dashboard'); // Navigate to the dashboard route
  };

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
        color: darkMode ? '#ffffff' : '#000000',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: 800 }}>
        <h2 style={{ color: darkMode ? '#ffffff' : '#007bff', transition: 'color 0.5s ease' }}>Create Complain</h2>
        <div>
          <Button
            onClick={handleReturn}
            icon={<ArrowLeftOutlined />}
            style={{
              marginRight: 16,
              backgroundColor: darkMode ? '#001f3f' : '#ffffff',
              color: darkMode ? '#ffffff' : '#000000',
              border: 'none',
              transition: 'background-color 0.3s, color 0.3s',
            }}
          >
            Return to Dashboard
          </Button>
          <Switch
            checked={darkMode}
            onChange={toggleDarkMode}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
        </div>
      </div>
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        style={{ width: '100%', maxWidth: 800, marginTop: 20 }}
      >
        <Form.Item label="Employee" required>
          <Select
            showSearch
            placeholder="Select an employee"
            value={employeeId}
            onChange={value => setEmployeeId(value)}
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            style={{ width: '100%', backgroundColor: darkMode ? '#d3d3d3' : '#ffffff' }}
            allowClear
          >
            {employees.map(employee => (
              <Option key={employee.id} value={employee.id}>
                {employee.name} (ID: {employee.id})
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Subject" required>
          <Input
            placeholder="Enter subject"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            style={{ backgroundColor: darkMode ? '#d3d3d3' : '#ffffff' }}
          />
        </Form.Item>
        <Form.Item label="Date" required>
          <DatePicker
            style={{ width: '100%', backgroundColor: darkMode ? '#d3d3d3' : '#ffffff' }}
            value={date ? moment(date) : null}
            onChange={date => setDate(date)}
          />
        </Form.Item>
        <Form.Item label="Reason" required>
          <Input.TextArea
            rows={4}
            placeholder="Enter reason"
            value={reason}
            onChange={e => setReason(e.target.value)}
            style={{ backgroundColor: darkMode ? '#d3d3d3' : '#ffffff' }}
          />
        </Form.Item>
        <Form.Item label="Complain Type" required>
          <Select
            value={complainType}
            onChange={value => setComplainType(value)}
            style={{ backgroundColor: darkMode ? '#d3d3d3' : '#ffffff' }}
          >
            <Option value="warning">Warning</Option>
            <Option value="bonus">Bonus</Option>
          </Select>
        </Form.Item>
        <Form.Item label={complainType === 'warning' ? 'Deduction Amount' : 'Bonus Amount'} required>
          <Input
            type="number"
            placeholder={complainType === 'warning' ? 'Enter deduction amount' : 'Enter bonus amount'}
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            min={0}
            style={{ backgroundColor: darkMode ? '#d3d3d3' : '#ffffff' }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddComplain;