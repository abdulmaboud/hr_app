import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Button, DatePicker, Form, InputNumber, message, Switch } from 'antd';
import { FaSun, FaMoon } from 'react-icons/fa';
import moment from 'moment';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const ContractForm = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [salaryPerYear, setSalaryPerYear] = useState(0);
  const [duration, setDuration] = useState(0); // Duration in months
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate hook

  // Calculate duration in whole months
  const calculateDuration = (start, end) => {
    if (start && end && end.isAfter(start)) {
      const durationInMonths = end.diff(start, 'months', true); // Calculate fractional months
      setDuration(Math.floor(durationInMonths)); // Round down to nearest integer
    } else {
      setDuration(0);
    }
  };

  useEffect(() => {
    calculateDuration(startDate, endDate);
  }, [startDate, endDate]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate || !salaryPerYear) {
      message.error('Please fill out all fields');
      return;
    }

    if (startDate.isAfter(endDate)) {
      message.error('End date must be after the start date');
      return;
    }

    if (duration <= 0) {
      message.error('Duration must be greater than zero');
      return;
    }

    const params = new URLSearchParams();
    params.append('start', startDate.format('YYYY-MM-DD'));
    params.append('end', endDate.format('YYYY-MM-DD'));
    params.append('duration', duration);
    params.append('salaryPerYear', salaryPerYear);

    setLoading(true);
    try {
      await axios.post('http://localhost:8080/contracts?' + params.toString());
      message.success('Contract created successfully!');
      
      // Reset all fields
      setStartDate(null);
      setEndDate(null);
      setSalaryPerYear(0);
      setDuration(0);
      form.resetFields();
    } catch (error) {
      console.error('Error creating contract:', error.response?.data || error);
      message.error('Failed to create contract');
    } finally {
      setLoading(false);
    }
  };

  // Initialize the form object from Ant Design
  const [form] = Form.useForm();

  return (
    <div className={`contract-form ${darkMode ? 'dark-mode' : ''}`}>
      <div className="theme-switcher">
        <Switch
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
          checkedChildren={<FaSun />}
          unCheckedChildren={<FaMoon />}
        />
      </div>
      <h2 className="title">Create Contract</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: 'Please select a start date!' }]}
          className="form-item"
        >
          <DatePicker
            onChange={handleStartDateChange}
            value={startDate}
            format="YYYY-MM-DD"
            className="date-picker"
          />
        </Form.Item>
        <Form.Item
          label="End Date"
          name="endDate"
          rules={[{ required: true, message: 'Please select an end date!' }]}
          className="form-item"
        >
          <DatePicker
            onChange={handleEndDateChange}
            value={endDate}
            format="YYYY-MM-DD"
            className="date-picker"
          />
        </Form.Item>
        <Form.Item
          label="Salary per Year"
          name="salaryPerYear"
          rules={[{ required: true, message: 'Please enter salary per year!' }]}
          className="form-item"
        >
          <InputNumber
            min={0}
            value={salaryPerYear}
            onChange={setSalaryPerYear}
            className="input-number"
          />
        </Form.Item>
        <Form.Item label="Duration (months)" className="form-item">
          <Input value={duration} readOnly className="duration-input" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} className="submit-button">
            Create Contract
          </Button>
        </Form.Item>
      </Form>
      <Button
        type="default"
        onClick={() => navigate('/dashboard')} // Navigate to dashboard
        style={{ marginTop: '16px' }}
      >
        Return to Dashboard
      </Button>
      <style jsx>{`
        .contract-form {
          padding: 24px;
          background: #fff;
          min-height: 100vh;
          transition: background 0.3s, color 0.3s;
        }

        .contract-form.dark-mode {
          background: #001f3f; /* Dark navy */
          color: #fff;
        }

        .title {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 24px;
          color: #1890ff; /* Button color in light mode */
          transition: color 0.3s;
        }

        .contract-form.dark-mode .title {
          color: #fff;
        }

        .theme-switcher {
          position: absolute;
          top: 24px;
          right: 24px;
          transition: transform 0.3s;
        }

        .date-picker, .input-number, .duration-input {
          border-radius: 4px;
          border: 1px solid #d9d9d9;
          transition: border-color 0.3s, background-color 0.3s;
        }

        .contract-form.dark-mode .date-picker, 
        .contract-form.dark-mode .input-number, 
        .contract-form.dark-mode .duration-input {
          background-color: #003366; /* Darker background for inputs */
          border-color: #0056b3; /* Light border for dark mode */
          color: #fff;
        }

        .submit-button {
          background-color: #1890ff;
          border-color: #1890ff;
          transition: background-color 0.3s, border-color 0.3s;
        }

        .contract-form.dark-mode .submit-button {
          background-color: #40a9ff;
          border-color: #40a9ff;
        }

        .submit-button:hover {
          background-color: #40a9ff;
          border-color: #40a9ff;
        }

        .contract-form.dark-mode .submit-button:hover {
          background-color: #1d78c1;
          border-color: #1d78c1;
        }

        .form-item .ant-form-item-label {
          color: #000;
          transition: color 0.3s;
        }

        .contract-form.dark-mode .form-item .ant-form-item-label {
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default ContractForm;