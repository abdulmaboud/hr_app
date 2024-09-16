import React, { useState, useEffect } from 'react';
import { Card, notification, Spin, Input, Button, Modal, Select } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Search } = Input;
const { Option } = Select;

const ViewTeams = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamsAndResources = async () => {
      setLoading(true);
      try {
        const teamResponse = await axios.get('http://localhost:8080/teams/all');
        setTeams(teamResponse.data);
        setFilteredTeams(teamResponse.data);

        const employeeResponse = await axios.get('http://localhost:8080/employees');
        setEmployees(employeeResponse.data);

        const projectResponse = await axios.get('http://localhost:8080/projects/all');
        setProjects(projectResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        notification.error({
          message: 'Error',
          description: 'Failed to fetch data. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsAndResources();
  }, []);

  const handleSearch = (value) => {
    const lowercasedValue = value.toLowerCase();
    const filtered = teams.filter((team) =>
      team.name.toLowerCase().includes(lowercasedValue) || team.id.toString().includes(lowercasedValue)
    );
    setFilteredTeams(filtered);
  };

  const handleDelete = async (teamId) => {
    try {
      await axios.delete(`http://localhost:8080/teams/delete/${teamId}`);
      setTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
      setFilteredTeams((prevFilteredTeams) => prevFilteredTeams.filter((team) => team.id !== teamId));
      notification.success({
        message: 'Success',
        description: 'Team deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting team:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to delete team. Please try again later.',
      });
    }
  };

  const handleDeleteItem = async (teamId, itemId, type) => {
    try {
      const endpoint = type === 'employees' ? 'Employee' : 'Project';
      await axios.delete(`http://localhost:8080/teams/${teamId}/${endpoint}/${itemId}`);

      setTeams((prevTeams) =>
        prevTeams.map((team) => {
          if (team.id === teamId) {
            if (type === 'employees') {
              team.employees = team.employees.filter((emp) => emp.id !== itemId);
            } else if (type === 'projects') {
              team.projects = team.projects.filter((proj) => proj.id !== itemId);
            }
          }
          return team;
        })
      );

      setFilteredTeams((prevFilteredTeams) =>
        prevFilteredTeams.map((team) => {
          if (team.id === teamId) {
            if (type === 'employees') {
              team.employees = team.employees.filter((emp) => emp.id !== itemId);
            } else if (type === 'projects') {
              team.projects = team.projects.filter((proj) => proj.id !== itemId);
            }
          }
          return team;
        })
      );

      notification.success({
        message: 'Success',
        description: `${type === 'employees' ? 'Employee' : 'Project'} removed successfully.`,
      });
    } catch (error) {
      console.error('Error deleting item from the team:', error);
      notification.error({
        message: 'Error',
        description: `Failed to remove ${type}. Please try again later.`,
      });
    }
  };

  const showModal = (team) => {
    setSelectedTeam(team);
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const updatedTeam = { ...selectedTeam };

      for (const employeeId of selectedEmployees) {
        const employee = employees.find((emp) => emp.id === employeeId);
        if (employee) {
          await axios.post(`http://localhost:8080/teams/${selectedTeam.id}/Employee/${employee.id}`);
          if (!updatedTeam.employees.some((emp) => emp.id === employee.id)) {
            updatedTeam.employees.push(employee);
          }
        }
      }

      for (const projectId of selectedProjects) {
        const project = projects.find((proj) => proj.id === projectId);
        if (project) {
          await axios.post(`http://localhost:8080/teams/${selectedTeam.id}/Project/${project.id}`);
          if (!updatedTeam.projects.some((proj) => proj.id === project.id)) {
            updatedTeam.projects.push(project);
          }
        }
      }

      setTeams((prevTeams) =>
        prevTeams.map((team) => (team.id === updatedTeam.id ? updatedTeam : team))
      );

      setFilteredTeams((prevFilteredTeams) =>
        prevFilteredTeams.map((team) => (team.id === updatedTeam.id ? updatedTeam : team))
      );

      setIsModalVisible(false);
      setSelectedEmployees([]);
      setSelectedProjects([]);
    } catch (error) {
      console.error('Error adding items to the team:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to add items to the team. Please try again later.',
      });
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedEmployees([]);
    setSelectedProjects([]);
  };

  const handleEmployeeSelectChange = (value) => {
    setSelectedEmployees(value);
  };

  const handleProjectSelectChange = (value) => {
    setSelectedProjects(value);
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '20px' }}>Teams</h2>

      <Button
        type="primary"
        onClick={() => navigate('/dashboard')}
        style={{ marginBottom: '20px' }}
      >
        Return to Dashboard
      </Button>

      <Search
        placeholder="Search by name or ID"
        onSearch={handleSearch}
        style={{ marginBottom: '20px', width: '300px' }}
        enterButton
      />

      {loading ? (
        <Spin tip="Loading teams..." />
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {filteredTeams.length > 0 ? (
            filteredTeams.map((team) => (
              <Card
                key={team.id}
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ADD8E6', padding: '10px', borderRadius: '5px' }}>
                    <span style={{ color: '#0056b3', fontWeight: 'bold' }}>{`Team: ${team.name}`}</span>
                    <DeleteOutlined
                      style={{ color: 'red', cursor: 'pointer' }}
                      onClick={() => handleDelete(team.id)}
                    />
                  </div>
                }
                style={{ width: 300, borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
                actions={[
                  <Button
                    type="link"
                    onClick={() => showModal(team)}
                    icon={<PlusOutlined />}
                    style={{ color: '#0056b3' }}
                  >
                    Add Employee/Project
                  </Button>,
                ]}
              >
                <p><strong>ID:</strong> {team.id}</p>
                <p><strong>Employees:</strong> {team.employees.length}</p>
                <p><strong>Projects:</strong> {team.projects.length}</p>

                <div style={{ marginTop: '10px' }}>
                  <h4>Employees:</h4>
                  {team.employees.length > 0 ? (
                    <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                      {team.employees.map((emp) => (
                        <li key={emp.id} style={{ padding: '5px 0', display: 'flex', justifyContent: 'space-between' }}>
                          <span>{emp.name}</span>
                          <DeleteOutlined
                            style={{ color: 'red', cursor: 'pointer' }}
                            onClick={() => handleDeleteItem(team.id, emp.id, 'employees')}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No employees in this team.</p>
                  )}
                </div>

                <div style={{ marginTop: '10px' }}>
                  <h4>Projects:</h4>
                  {team.projects.length > 0 ? (
                    <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                      {team.projects.map((proj) => (
                        <li key={proj.id} style={{ padding: '5px 0', display: 'flex', justifyContent: 'space-between' }}>
                          <span>{proj.name}</span>
                          <DeleteOutlined
                            style={{ color: 'red', cursor: 'pointer' }}
                            onClick={() => handleDeleteItem(team.id, proj.id, 'projects')}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No projects in this team.</p>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <p>No teams found.</p>
          )}
        </div>
      )}

      <Modal
        title="Add Employees and Projects"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Add"
        cancelText="Cancel"
      >
        <h4>Select Employees:</h4>
        <Select
          mode="multiple"
          placeholder="Select employees"
          value={selectedEmployees}
          onChange={handleEmployeeSelectChange}
          style={{ width: '100%', marginBottom: '20px' }}
        >
          {employees.map((emp) => (
            <Option key={emp.id} value={emp.id}>
              {emp.name}
            </Option>
          ))}
        </Select>

        <h4>Select Projects:</h4>
        <Select
          mode="multiple"
          placeholder="Select projects"
          value={selectedProjects}
          onChange={handleProjectSelectChange}
          style={{ width: '100%' }}
        >
          {projects.map((proj) => (
            <Option key={proj.id} value={proj.id}>
              {proj.name}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default ViewTeams;