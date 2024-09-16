import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Select, Button, notification } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const { Option } = Select;

const AddProject = () => {
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:8080/employees');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
        notification.error({
          message: 'Error',
          description: 'Failed to fetch employees. Please try again later.',
        });
      }
    };

    fetchEmployees();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Format dates to the required format
      const formattedLaunchDate = values.launchDate ? moment(values.launchDate).format('YYYY-MM-DD') : null;
      const formattedDeadline = values.deadline ? moment(values.deadline).format('YYYY-MM-DD') : null;

      // Prepare project data
      const projectData = {
        name: values.name,
        launch: formattedLaunchDate,
        deadline: formattedDeadline,
        membersNo: 0 // Number of members initialized to 0
      };

      // Save the project first
      const response = await axios.post('http://localhost:8080/projects', projectData);
      const projectId = response.data.id;

      // If an employee is selected, assign the project
      if (values.employeeId) {
        await axios.post(`http://localhost:8080/employees/project/${values.employeeId}`, projectData);
      }

      notification.success({
        message: 'Success',
        description: 'Project created and assigned successfully.',
      });

      form.resetFields(); // Reset form after submission
    } catch (error) {
      console.error('Error adding project:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to add project. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', background: '#fff', minHeight: '360px' }}>
      <h2>Add New Project</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Project Name"
          name="name"
          rules={[{ required: true, message: 'Please enter the project name' }]}
        >
          <Input placeholder="Enter project name" />
        </Form.Item>

        <Form.Item
          label="Launch Date"
          name="launchDate"
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Deadline"
          name="deadline"
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Assign to Employee"
          name="employeeId"
        >
          <Select placeholder="Select an employee (optional)" allowClear>
            {employees.map((emp) => (
              <Option key={emp.id} value={emp.id}>
                {emp.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Project
          </Button>
        </Form.Item>
      </Form>
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

export default AddProject;