import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, notification } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const { Option } = Select;

const CreateJobPage = () => {
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
      }
    };

    fetchEmployees();
  }, []);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      // Create or update a new job first
      const jobResponse = await axios.post('http://localhost:8080/jobs', {
        major: values.major,
        role: values.role,
      });

      notification.success({
        message: 'Job Created or Updated',
        description: 'The job has been successfully created or updated.',
      });

      if (values.employeeId && values.employeeId !== 'none') {
        // Assign the created job to the employee
        await axios.post(`http://localhost:8080/employees/job/${values.employeeId}`, jobResponse.data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        notification.success({
          message: 'Job Assigned',
          description: 'The job has been successfully assigned to the employee.',
        });
      }

      form.resetFields();
    } catch (error) {
      console.error('Error processing the job request:', error);
      notification.error({
        message: 'Error',
        description: 'There was an error processing the job request.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Create New Job</h2>
      <Button type="default" onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px' }}>
        Return to Dashboard
      </Button>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ employeeId: 'none' }}
      >
        <Form.Item
          label="Major"
          name="major"
          rules={[{ required: true, message: 'Please input the major!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: 'Please input the role!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Assign to Employee"
          name="employeeId"
        >
          <Select>
            <Option value="none">None</Option>
            {employees.map(employee => (
              <Option key={employee.id} value={employee.id}>
                {employee.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {form.getFieldValue('employeeId') && form.getFieldValue('employeeId') !== 'none'
              ? 'Create and Assign Job'
              : 'Create Job'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateJobPage;