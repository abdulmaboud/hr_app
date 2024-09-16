import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/users/signIn', {
        username,
        password,
      });

      if (response.status === 200) {
        // Save the username to localStorage
        localStorage.setItem('username', username);
        
        setSuccessMessage('Login successful!');
        setErrorMessage('');
        setUsername('');
        setPassword('');
        
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage('Invalid username or password. Please try again.');
        setUsername('');
        setPassword('');
        setSuccessMessage('');
      } else {
        setErrorMessage('An error occurred. Please try again.');
        setSuccessMessage('');
      }
    }
  };

  return (
    <div style={{ ...styles.container, backgroundImage: `url('/h3bax.jpeg')` }}>
      <div style={styles.overlay}></div>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleLogin}>
          <div style={styles.inputContainer}>
            <label htmlFor="username" style={styles.label}>Username:</label>
            <input
              type="text"
              id="username"
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div style={styles.inputContainer}>
            <label htmlFor="password" style={styles.label}>Password:</label>
            <input
              type="password"
              id="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={styles.button}>
            Sign In
          </button>
        </form>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        {successMessage && <p style={styles.success}>{successMessage}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1,
  },
  loginBox: {
    position: 'relative',
    zIndex: 2,
    width: '450px',
    padding: '50px',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: '10px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(15px)',
  },
  title: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#333',
  },
  inputContainer: {
    marginBottom: '20px',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: 'transparent',
    color: '#4CAF50',
    border: '2px solid #4CAF50',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease, color 0.3s ease',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  error: {
    color: 'red',
    marginTop: '15px',
    fontSize: '14px',
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: '10px',
    borderRadius: '5px',
  },
  success: {
    color: 'green',
    marginTop: '15px',
    fontSize: '14px',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
    padding: '10px',
    borderRadius: '5px',
  },
};

export default LoginPage;