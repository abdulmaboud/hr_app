import React, { useState, useEffect } from 'react';
import { Table, Button, notification, Spin, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const JobListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleDeleteButtonId, setVisibleDeleteButtonId] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:8080/jobs');
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/jobs/delete/${id}`);
      setJobs(jobs.filter((job) => job.id !== id));
      notification.success({
        message: 'Job Deleted',
        description: 'The job has been successfully deleted.',
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'There was an error deleting the job.',
      });
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Major',
      dataIndex: 'major',
      key: 'major',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Delete',
      key: 'actions',
      render: (_, record) => (
        <Tooltip title="Delete">
          <Button
            type="link"
            danger
            icon={<span style={{ fontSize: '16px', color: 'red' }}>−</span>}
            onClick={() => handleDelete(record.id)}
            style={{ visibility: visibleDeleteButtonId === record.id ? 'visible' : 'hidden' }}
            className="delete-button"
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Job List</h2>
      <Button type="default" onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px' }}>
        Return to Dashboard
      </Button>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={jobs}
          rowKey="id"
          onRow={(record) => ({
            onMouseEnter: () => {
              setVisibleDeleteButtonId(record.id);
            },
            onMouseLeave: () => {
              setVisibleDeleteButtonId(null);
            },
          })}
        />
      </Spin>
    </div>
  );
};

export default JobListPage;