import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import AuthForm from './components/AuthForm.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import Home from './components/Home.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import VerifyEmail from './components/VerifyEmail.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)