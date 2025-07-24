import React, { useState } from 'react';
import useAuthForm from '../hooks/useAuthForm';
import axios from 'axios';

const Home = () => {
  const { logout } = useAuthForm();
  const [protectedData, setProtectedData] = useState('');
  const [error, setError] = useState('');

  const fetchProtectedData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('Token from localStorage:', token);
      if (!token) {
        setError('No token found.');
        return;
      }
      const response = await axios.get('/api/auth/protected', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProtectedData(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch protected data.');
      setProtectedData('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome! You are logged in.</h1>
      <p className="text-lg mb-8">This is your protected dashboard area.</p>
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200 mb-4"
      >
        Logout
      </button>
      <button
        onClick={fetchProtectedData}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        Fetch Protected Data
      </button>
      {protectedData && <p className="mt-4 text-green-300">{protectedData}</p>}
      {error && <p className="mt-4 text-red-300">{error}</p>}
    </div>
  );
};

export default Home;
