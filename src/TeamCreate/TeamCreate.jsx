import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, notification } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const { Option } = Select;

const CreateTeam = () => {
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchEmployeesAndProjects = async () => {
      try {
        const [employeesResponse, projectsResponse] = await Promise.all([
          axios.get('http://localhost:8080/employees'),
          axios.get('http://localhost:8080/projects/all'),
        ]);

        setEmployees(employeesResponse.data);
        setProjects(projectsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        notification.error({
          message: 'Error',
          description: 'Failed to fetch employees or projects. Please try again later.',
        });
      }
    };

    fetchEmployeesAndProjects();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Step 1: Create the team
      const teamResponse = await axios.post('http://localhost:8080/teams/create', null, {
        params: { name: values.name },
      });

      const teamId = teamResponse.data.id;

      // Step 2: Add employees to the team
      if (values.employees && values.employees.length > 0) {
        await axios.post(`http://localhost:8080/teams/${teamId}/addEmployeeList`, 
          values.employees // Send list of IDs directly
        );
      }

      // Step 3: Add projects to the team
      if (values.projects && values.projects.length > 0) {
        await axios.post(`http://localhost:8080/teams/${teamId}/addProjectList`,
          values.projects // Send list of IDs directly
        );
      }

      notification.success({
        message: 'Success',
        description: 'Team created and updated successfully.',
      });

      form.resetFields();
    } catch (error) {
      console.error('Error creating team:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to create or update team. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReturnToDashboard = () => {
    navigate('/dashboard'); // Use navigate instead of history.push
  };

  return (
    <div style={{ padding: '24px', background: '#fff', minHeight: '360px' }}>
      <h2>Create New Team</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Team Name"
          name="name"
          rules={[{ required: true, message: 'Please enter the team name' }]}
        >
          <Input placeholder="Enter team name" />
        </Form.Item>

        <Form.Item
          label="Select Employees"
          name="employees"
        >
          <Select
            mode="multiple"
            placeholder="Select employees (optional)"
            style={{ width: '100%' }}
            allowClear
          >
            {employees.map((emp) => (
              <Option key={emp.id} value={emp.id}>
                {emp.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Select Projects"
          name="projects"
          rules={[{ required: true, message: 'Please select at least one project' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select projects"
            style={{ width: '100%' }}
          >
            {projects.map((proj) => (
              <Option key={proj.id} value={proj.id}>
                {proj.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Team
          </Button>
          <Button type="default" style={{ marginLeft: '10px' }} onClick={handleReturnToDashboard}>
            Return to Dashboard
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateTeam;