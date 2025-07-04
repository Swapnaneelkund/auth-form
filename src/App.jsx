// App.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import useAuthForm from './hooks/useAuthForm';

function App() {
  return (
    <div className="App">
      <Outlet />
    </div>
  );
}

export default App;