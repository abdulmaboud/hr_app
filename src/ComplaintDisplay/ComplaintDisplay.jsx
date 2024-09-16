import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaSun, FaMoon, FaArrowLeft } from 'react-icons/fa'; // Import icons
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './ComplaintDisplay.css'; // Import the CSS file for styling

const ViewComplaints = () => {
  const [bonuses, setBonuses] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const [bonusResponse, warningResponse] = await Promise.all([
          axios.get('http://localhost:8080/bonus'),
          axios.get('http://localhost:8080/warning'),
        ]);

        setBonuses(bonusResponse.data);
        setWarnings(warningResponse.data);
      } catch (err) {
        setError('There was an error fetching the complaints!');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const deleteComplaint = async (id, type) => {
    try {
      if (type === 'warning') {
        await axios.delete(`http://localhost:8080/warning/${id}`);
        setWarnings(warnings.filter(warning => warning.id !== id));
      } else if (type === 'bonus') {
        await axios.delete(`http://localhost:8080/bonus/${id}`);
        setBonuses(bonuses.filter(bonus => bonus.id !== id));
      }
    } catch (err) {
      console.error('There was an error deleting the complaint!', err);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleReturn = () => {
    navigate('/dashboard'); // Navigate to the dashboard route
  };

  if (loading) {
    return <p>Loading complaints...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const filterComplaints = (complaints) => {
    return complaints
      .filter((complaint) => filterType === 'all' || complaint.type === filterType)
      .filter((complaint) => !filterDate || new Date(complaint.date).toLocaleDateString() === new Date(filterDate).toLocaleDateString());
  };

  return (
    <div className={`complaints-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="header">
        <h1>Complaints & Requests</h1>
        <button className="mode-switcher" onClick={toggleDarkMode}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        <button className="return-button" onClick={handleReturn}>
          <FaArrowLeft /> Return to Dashboard
        </button>
      </div>

      <div className="filter-container">
        <label htmlFor="filter">Filter by Type:</label>
        <select
          id="filter"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="warning">Warnings</option>
          <option value="bonus">Bonuses</option>
        </select>

        <label htmlFor="date-filter">Filter by Date:</label>
        <input
          id="date-filter"
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      {filterComplaints(warnings).map((warning) => (
        <div key={warning.id} className="complaint-box warning">
          <div className="complaint-header">
            <h3>{warning.subject}</h3>
            <span className="complaint-badge warning-badge">Warning</span>
            <FaTrashAlt
              className="delete-icon"
              onClick={() => deleteComplaint(warning.id, 'warning')}
            />
          </div>
          <p><strong>Reason:</strong> {warning.reason}</p>
          <p><strong>Employee ID:</strong> {warning.employee ? warning.employee.id : 'N/A'}</p>
          <p><strong>Employee Name:</strong> {warning.employee ? warning.employee.name : 'N/A'}</p>
          <p><strong>Deduction:</strong> {warning.deduction}</p>
          <p><strong>Date:</strong> {new Date(warning.date).toLocaleDateString()}</p>
        </div>
      ))}

      {filterComplaints(bonuses).map((bonus) => (
        <div key={bonus.id} className="complaint-box bonus">
          <div className="complaint-header">
            <h3>{bonus.subject}</h3>
            <span className="complaint-badge bonus-badge">Bonus</span>
            <FaTrashAlt
              className="delete-icon"
              onClick={() => deleteComplaint(bonus.id, 'bonus')}
            />
          </div>
          <p><strong>Reason:</strong> {bonus.reason}</p>
          <p><strong>Employee ID:</strong> {bonus.employee ? bonus.employee.id : 'N/A'}</p>
          <p><strong>Employee Name:</strong> {bonus.employee ? bonus.employee.name : 'N/A'}</p>
          <p><strong>Bonus:</strong> {bonus.bonus}</p>
          <p><strong>Date:</strong> {new Date(bonus.date).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default ViewComplaints;