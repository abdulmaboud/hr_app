import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, notification } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const { Option } = Select;

const CreateEmployee = () => {
  const [form] = Form.useForm();
  const [projects, setProjects] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResponse, jobsResponse, contractsResponse] = await Promise.all([
          axios.get('http://localhost:8080/projects/all'),
          axios.get('http://localhost:8080/jobs'),
          axios.get('http://localhost:8080/contracts')
        ]);

        setProjects(projectsResponse.data);
        setJobs(jobsResponse.data);
        setContracts(contractsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        notification.error({
          message: 'Error',
          description: 'Failed to fetch projects, jobs, or contracts. Please try again later.',
        });
      }
    };

    fetchData();
  }, []);

  const handleContractChange = (contractId) => {
    const selected = contracts.find(contract => contract.id === contractId);
    setSelectedContract(selected);
    form.setFieldsValue({ salary: selected ? selected.salaryPerYear : '' });
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const employeeData = {
        name: values.name,
        project: { id: values.projectId }, // Assuming project and job IDs are sufficient
        job: { id: values.jobId },
        contract: { id: values.contractId },
        salary: selectedContract ? selectedContract.salaryPerYear : undefined, // Include salary if selected
        status: values.status,
        tenant: { id: 1 } // Reference tenant with ID 1 by default
      };

      await axios.post('http://localhost:8080/employees', employeeData);

      notification.success({
        message: 'Success',
        description: 'Employee created successfully.',
      });

      form.resetFields();
    } catch (error) {
      console.error('Error creating employee:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to create employee. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', background: '#fff', minHeight: '360px' }}>
      <Button
        type="default"
        onClick={() => navigate('/dashboard')} // Navigate back to dashboard
        style={{ marginBottom: '16px' }}
      >
        Return to Dashboard
      </Button>
      <h2>Create New Employee</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter the employee name' }]}
        >
          <Input placeholder="Enter employee name" />
        </Form.Item>

        <Form.Item
          label="Select Project"
          name="projectId"
        >
          <Select placeholder="Select a project" style={{ width: '100%' }}>
            {projects.map(proj => (
              <Option key={proj.id} value={proj.id}>
                {proj.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Select Job"
          name="jobId"
        >
          <Select placeholder="Select a job" style={{ width: '100%' }}>
            {jobs.map(job => (
              <Option key={job.id} value={job.id}>
                {job.title} - {job.major} - {job.role}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Select Contract"
          name="contractId"
          rules={[{ required: true, message: 'Please select a contract' }]}
        >
          <Select placeholder="Select a contract" style={{ width: '100%' }} onChange={handleContractChange}>
            {contracts.map(contract => (
              <Option key={contract.id} value={contract.id}>
                {contract.name} - Duration: {contract.duration} months - Salary: ${contract.salaryPerYear}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Salary"
          name="salary"
        >
          <Input disabled placeholder={`Salary: ${selectedContract ? selectedContract.salaryPerYear : 'N/A'}`} />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Please select the employee status' }]}
        >
          <Select placeholder="Select status" style={{ width: '100%' }}>
            <Option value="HIRED">Hired</Option>
            <Option value="FIRED">Fired</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Employee
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateEmployee;