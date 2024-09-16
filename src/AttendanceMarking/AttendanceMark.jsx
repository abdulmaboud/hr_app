import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, DatePicker, Select, Radio, Button, notification } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const AttendanceMark = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:8080/employees');
        setEmployees(response.data);
      } catch (error) {
        notification.error({
          message: 'Error fetching employees',
          description: 'Failed to fetch employees data. Please try again later.',
        });
      }
    };

    fetchEmployees();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Ensure both date and time are formatted as 'YYYY-MM-DDTHH:mm:ss'
      const formattedDateTime = moment(values.date).format('YYYY-MM-DDTHH:mm:ss');

      // Prepare the JSON body with formatted date and time
      const attendanceData = {
        id: null,  // Assuming id is auto-generated or you want to omit it
        date: formattedDateTime, // Use formatted date and time
        attendance: values.status.toUpperCase(),
        employee: {
          id: values.employeeId  // Send the employee ID
        }
      };

      // Send POST request with JSON body
      await axios.post('http://localhost:8080/attendances', attendanceData);

      notification.success({
        message: 'Attendance Marked',
        description: `Attendance for employee ID ${values.employeeId} on ${formattedDateTime} marked as ${values.status.toUpperCase()}.`,
      });

      form.resetFields();
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Failed to mark attendance. Please try again later.';
      notification.error({
        message: 'Error marking attendance',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = () => {
    navigate('/dashboard'); // Navigate to the dashboard
  };

  return (
    <div style={{ padding: '24px', background: '#fff', minHeight: '360px' }}>
      <h2>Mark Attendance</h2>
      <Button 
        type="default" 
        onClick={handleReturn} 
        style={{ marginBottom: '20px' }}
      >
        Return to Dashboard
      </Button>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: 'ATTENDED' }}
      >
        <Form.Item
          label="Date and Time"
          name="date"
          rules={[{ required: true, message: 'Please select a date and time' }]}
        >
          <DatePicker
            format="YYYY-MM-DD HH:mm:ss"
            showTime={{ format: 'HH:mm:ss' }} // Enable time selection with hours, minutes, and seconds
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="Employee"
          name="employeeId"
          rules={[{ required: true, message: 'Please select an employee' }]}
        >
          <Select placeholder="Select an employee" style={{ width: '100%' }}>
            {employees.map((emp) => (
              <Select.Option key={emp.id} value={emp.id}>
                {emp.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Please select attendance status' }]}
        >
          <Radio.Group>
            <Radio value="ATTENDED">Attended</Radio>
            <Radio value="ABSENT">Absent</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AttendanceMark;