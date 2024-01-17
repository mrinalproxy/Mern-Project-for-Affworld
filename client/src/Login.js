import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import constants from './constants';

const Login = () => {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    if (localStorage.getItem('jwt')) navigate('/');
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Handle login logic (e.g., API call to a backend server)
    try {
      const response = await axios.post(
        constants.baseUrl + '/api/user/login',
        formData,
        constants.config
      );
      console.log(response.data); // Handle successful login
      localStorage.setItem('jwt', response.data.token);
      alert('Login successful!');
      window.location.reload();
      navigate('/');
    } catch (error) {
      console.error(error); // Handle login errors
      alert('Something went wrong!');
    }
  };

  const navigateToSignup = () => {
    navigate('/signup');
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: '400px',
        margin: 'auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        marginTop: '50px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="phone">Phone:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>
      <button
        type="submit"
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '10px 15px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '10px',
        }}
      >
        Login
      </button>
      <button
        type="button"
        onClick={navigateToSignup}
        style={{
          backgroundColor: '#3498db',
          color: 'white',
          padding: '10px 15px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Go to Signup
      </button>
    </form>
  );
};

export default Login;
