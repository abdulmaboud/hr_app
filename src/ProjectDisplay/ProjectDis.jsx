import React, { useState, useEffect } from 'react';
import { Table, Spin, Alert, Button, Popconfirm, notification } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:8080/projects/all');
        console.log('Backend Response:', response.data); // Log data to verify format
        
        if (Array.isArray(response.data)) {
          // Ensure response is correctly formatted and has the members_no field
          response.data.forEach(project => {
            if (!('members_no' in project)) {
              console.warn(`Project ${project.id} is missing the 'members_no' field.`);
            }
          });
          
          setProjects(response.data); // Set the projects state
        } else {
          setError('Unexpected response format');
        }
      } catch (error) {
        setError('Error fetching projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/projects/Delete/${id}`);
      setProjects(projects.filter(project => project.id !== id));
      notification.success({
        message: 'Project Deleted',
        description: 'The project has been successfully deleted.',
      });
    } catch (error) {
      notification.error({
        message: 'Error Deleting Project',
        description: 'There was an error deleting the project.',
      });
    }
  };

  const columns = [
    {
      title: 'Project ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Launch Date',
      dataIndex: 'launch',
      key: 'launch',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Number of Members',
      dataIndex: 'membersNo',  // Verify this matches backend response
      key: 'membersNo',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this project?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>All Projects</h1>
      <Table
        dataSource={projects}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
      <Button
        type="primary"
        style={{ marginTop: '16px' }}
        onClick={() => navigate('/dashboard')} // Navigate back to dashboard
      >
        Return to Dashboard
      </Button>
    </div>
  );
};

export default ProjectsList;