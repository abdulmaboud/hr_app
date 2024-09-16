import React, { useState, useEffect } from 'react';
import { DatePicker, Table, Spin, Typography, Select, Button } from 'antd';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8080/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date.format('YYYY-MM-DDTHH:mm:ss')); // Adjusting format for LocalDateTime compatibility
    } else {
      setSelectedDate(null);
    }
  };

  const handleEmployeeChange = (employeeId) => {
    setSelectedEmployee(employeeId || null); // Allow clearing of employee selection
  };

  const fetchAttendance = async () => {
    if (!selectedDate) return; // Ensure a date is selected before fetching attendance
    setLoading(true);
    try {
      let response;
      if (selectedEmployee) {
        // Fetch attendance by both employee and date
        response = await axios.get(`http://localhost:8080/attendances/${selectedEmployee}/${selectedDate}`);
      } else {
        // Fetch attendance by date only
        response = await axios.get(`http://localhost:8080/attendances/date/${selectedDate}`);
      }
      setAttendanceData(response.data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchAttendance();
    }
  }, [selectedDate, selectedEmployee]); // Trigger fetch when date or employee changes

  // Enum mapping for attendance status
  const attendanceStatus = {
    PRESENT: 'ATTENDED',
    ABSENT: 'ABSENT',
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Employee',
      key: 'employee',
      render: (text, record) => (
        <span>{record.employee.id} - {record.employee.name}</span>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => moment(date).format('YYYY-MM-DD HH:mm:ss'), // Formatting LocalDateTime
    },
    {
      title: 'Attendance',
      dataIndex: 'attendance',
      key: 'attendance',
      render: (attendance) => attendanceStatus[attendance] || 'Unknown', // Use enum mapping
    },
  ];

  const handleReturn = () => {
    navigate('/dashboard'); // Navigate to the dashboard
  };

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      <Title level={2}>Attendance</Title>
      <Button 
        type="default" 
        onClick={handleReturn} 
        style={{ marginBottom: '16px' }}
      >
        Return to Dashboard
      </Button>
      <div style={{ marginBottom: '16px' }}>
        <DatePicker
          showTime
          onChange={handleDateChange}
          format="YYYY-MM-DD HH:mm:ss"
          style={{ marginRight: '8px' }}
        />
        <Select
          placeholder="Select Employee (Optional)"
          onChange={handleEmployeeChange}
          style={{ width: '200px' }}
          allowClear
        >
          {employees.map((employee) => (
            <Option key={employee.id} value={employee.id}>
              {employee.name}
            </Option>
          ))}
        </Select>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      ) : (
        <Table
          dataSource={attendanceData}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      )}
    </div>
  );
};

export default AttendancePage;