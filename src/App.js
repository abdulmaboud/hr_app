import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HRDashboard from './mainpage/dashboard';
import LoginPage from './login/login';
import AttendancePage from './AttendanceDisplay/AttendanceDis';
import AttendanceMark from './AttendanceMarking/AttendanceMark';
import ProjectsList from './ProjectDisplay/ProjectDis';
import EmployeeDis from './EmployeeDisplay/EmployeesDis';
import ContractList from './ContractsDisplay/ContractDis';
import ContractForm from './ContractCreate/ContractCreate';
import AddComplain from './ComplainCreate/ComplainCreate';
import CreateJobListPage from './JobDisplay/JobDisplay';
import JobListPage from './JobView/JobView';
import AddProject from './ProjectCreate/ProjectCreate';
import CreateTeam from './TeamCreate/TeamCreate';
import CreateEmployee from './EmployeeCreate/EmployeeCreate';
import ViewComplaints from './ComplaintDisplay/ComplaintDisplay';
import ProfileView from './Profile/Profile';
import ViewTeams from './TeamDisplay/TeamDisplay'

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect the root path to the login page */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<HRDashboard />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/attendance/mark" element={<AttendanceMark />} />
        <Route path="/projects" element={<ProjectsList />} />
        <Route path="/employees" element={<EmployeeDis />} />
        <Route path="/contracts" element={<ContractList />} />
        <Route path="/contracts/create" element={<ContractForm />} />
        <Route path="/complaint/create" element={<AddComplain />} />
        <Route path="/jobs/create" element={<CreateJobListPage />} />
        <Route path="/jobs/view" element={<JobListPage />} />
        <Route path="/projects/add" element={<AddProject />} />
        <Route path="/teams/add" element={<CreateTeam />} />
        <Route path="/employees/add" element={<CreateEmployee />} />
        <Route path="/complaint/view" element={<ViewComplaints />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/ViewTeams" element={< ViewTeams/>} />
      </Routes>
    </Router>
  );
}

export default App;