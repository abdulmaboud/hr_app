import React, { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Switch, Dropdown, Spin } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  ProjectOutlined, 
  CalendarOutlined, 
  FileTextOutlined, 
  ExclamationCircleOutlined, 
  SettingOutlined, 
  LogoutOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHardHat } from '@fortawesome/free-solid-svg-icons'; // Importing Font Awesome icon
import 'antd/dist/reset.css';

import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

Chart.register(ArcElement, Tooltip, Legend);

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const HRDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Fetch the username from localStorage
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || 'User');

    const fetchData = async () => {
      try {
        const [projectsResponse, contractsResponse, jobsResponse] = await Promise.all([
          axios.get('http://localhost:8080/projects/all'),
          axios.get('http://localhost:8080/contracts'),
          axios.get('http://localhost:8080/jobs'),
        ]);

        setProjects(projectsResponse.data);
        setContracts(contractsResponse.data);
        setJobs(jobsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleDarkMode = (checked) => {
    setDarkMode(checked);
  };

  const handleCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const theme = darkMode ? 'dark' : 'light';
  const backgroundColor = darkMode ? '#001529' : '#f0f2f5';
  const welcomeMessageColor = '#1890ff'; // Consistent color for the welcome message

  const userMenu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<LogoutOutlined />}>
        <Link to="/login">Sign Out</Link>
      </Menu.Item>
    </Menu>
  );

  // Helper function to generate pie data
  const pieData = (labels, data) => ({
    labels,
    datasets: [{
      data,
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    }]
  });

  // Prepare pie chart data
  const projectData = pieData(projects.map(p => p.name), projects.map(() => 1));
  
  // Pie data for contracts based on duration
  const contractData = pieData(
    contracts.map(contract => `${contract.duration} months`), 
    contracts.map(contract => contract.duration)
  );

  // Pie data for jobs based on major and role
  const jobData = pieData(
    jobs.map(job => `${job.major} - ${job.role}`), 
    jobs.map(() => 1)
  );

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor }}>
      <Sider collapsible theme={theme} onCollapse={handleCollapse}>
        <div
          className="logo"
          style={{
            padding: '16px',
            color: darkMode ? 'white' : '#000',
            textAlign: 'center',
            fontSize: '24px',
            background: darkMode ? '#000c17' : '#1890ff',
            fontWeight: 'bold',
            boxShadow: darkMode ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          HR Dashboard
        </div>
        <Menu theme={theme} defaultSelectedKeys={['1']} mode="inline">
          <SubMenu key="employees" icon={<UserOutlined />} title="Employees">
            <Menu.Item key="1">
              <Link to="/employees">View All Employees</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/employees/add">Add New Employee</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="teams" icon={<TeamOutlined />} title="Teams">
            <Menu.Item key="3">
              <Link to="/ViewTeams">View All Teams</Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link to="/teams/add">Create New Team</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="projects" icon={<ProjectOutlined />} title="Projects">
            <Menu.Item key="5">
              <Link to="/projects">View All Projects</Link>
            </Menu.Item>
            <Menu.Item key="6">
              <Link to="/projects/add">Create New Project</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="attendance" icon={<CalendarOutlined />} title="Attendance">
            <Menu.Item key="7">
              <Link to="/attendance">View Attendance Records</Link>
            </Menu.Item>
            <Menu.Item key="8">
              <Link to="/attendance/mark">Mark Attendance</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="contracts" icon={<FileTextOutlined />} title="Contracts">
            <Menu.Item key="9">
              <Link to="/contracts">View All Contracts</Link>
            </Menu.Item>
            <Menu.Item key="10">
              <Link to="/contracts/create">Create New Contract</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="complaints" icon={<ExclamationCircleOutlined />} title="Complaints">
            <Menu.Item key="11">
              <Link to="/complaint/view">View All Complaints</Link>
            </Menu.Item>
            <Menu.Item key="12" icon={<PlusOutlined />}>
              <Link to="/complaint/create">File New Complaint</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="jobs" icon={<FontAwesomeIcon icon={faHardHat} />} title="Jobs">
            <Menu.Item key="15">
              <Link to="/jobs/view">View All Jobs</Link>
            </Menu.Item>
            <Menu.Item key="16">
              <Link to="/jobs/create">Create Job</Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="13" icon={<SettingOutlined />}>
            <Link to="/profile">Profile</Link>
          </Menu.Item>
          <Menu.Item key="14" icon={<LogoutOutlined />}>
            <Link to="/login">Sign Out</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: darkMode ? '#001529' : '#fff',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingRight: '20px',
          }}
        >
          <Switch
            aria-label="Toggle dark mode"
            checkedChildren={<SunOutlined />}
            unCheckedChildren={<MoonOutlined />}
            onChange={toggleDarkMode}
            checked={darkMode}
            style={{ marginRight: '20px' }}
          />
          <Dropdown overlay={userMenu} trigger={['click']}>
            <a onClick={(e) => e.preventDefault()} href="#">
              <UserOutlined style={{ fontSize: '20px', color: darkMode ? '#fff' : '#000' }} />
            </a>
          </Dropdown>
        </Header>
        <Content style={{ margin: '16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ color: welcomeMessageColor }}>
              Welcome, {username}!
            </h1>
          </div>
          <Spin spinning={loading}>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div style={{ width: '30%' }}>
                <h2>Projects</h2>
                <Pie data={projectData} />
              </div>
              <div style={{ width: '30%' }}>
                <h2>Contracts</h2>
                <Pie data={contractData} />
              </div>
              <div style={{ width: '30%' }}>
                <h2>Jobs</h2>
                <Pie data={jobData} />
              </div>
            </div>
          </Spin>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          HR Dashboard ©2024 Created by Eng. Ahmed Abdulmaboud
        </Footer>
      </Layout>
    </Layout>
  );
};

export default HRDashboard;