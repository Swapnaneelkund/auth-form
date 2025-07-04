import React from 'react';
import Logo from '../assets/logo.png';
import { ArrowLeft } from 'lucide-react';
import useAuthForm from '../hooks/useAuthForm';
import LoginForm from './form/LoginForm';
import SignupForm from './form/SignupForm';
import ForgotPasswordForm from './form/ForgotPasswordForm';
import FormButton from './form/FormButton';
import Notification from './Notification';

const AuthForm = () => {
  const {
    mode,
    loading,
    message,
    formData,
    errors,
    switchMode,
    handleInputChange,
    handleSubmit,
    clearMessage,
  } = useAuthForm();

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Welcome Back';
      case 'signup': return 'Create Account';
      case 'forgot': return 'Reset Password';
      default: return 'Welcome';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'login': return 'Sign in to your account';
      case 'signup': return 'Sign up for a new account';
      case 'forgot': return 'Enter your email to receive a reset link';
      default: return '';
    }
  };

  const getButtonText = () => {
    if (loading) {
      switch (mode) {
        case 'login': return 'Signing In...';
        case 'signup': return 'Creating Account...';
        case 'forgot': return 'Sending Reset Link...';
      }
    }
    switch (mode) {
      case 'login': return 'Sign In';
      case 'signup': return 'Create Account';
      case 'forgot': return 'Send Reset Link';
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main form container */}
      <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          {mode === 'forgot' && (
            <button
              onClick={() => switchMode('login')}
              className="absolute top-6 left-6 text-white/70 hover:text-white transition duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          
          <img src={Logo} alt="Logo" className="mx-auto mb-4 w-34 h-34 object-contain pr-4" />
          
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{getTitle()}</h2>
          <p className="text-white/70">{getSubtitle()}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'login' && <LoginForm formData={formData} handleInputChange={handleInputChange} errors={errors} />}
          {mode === 'signup' && <SignupForm formData={formData} handleInputChange={handleInputChange} errors={errors} />}
          {mode === 'forgot' && <ForgotPasswordForm formData={formData} handleInputChange={handleInputChange} errors={errors} />}

          <FormButton
            type="submit"
            loading={loading}
            text={getButtonText()}
          />
        </form>

        {/* Footer */}
        <div className="mt-8 space-y-4">
          {mode === 'login' && (
            <>
              <div className="text-center">
                <button
                  onClick={() => switchMode('forgot')}
                  className="text-white/70 hover:text-white text-sm transition duration-200"
                >
                  Forgot your password?
                </button>
              </div>
              <div className="text-center">
                <p className="text-white/70">
                  Don't have an account?
                  <button
                    onClick={() => switchMode('signup')}
                    className="ml-2 text-indigo-300 hover:text-indigo-200 font-medium transition duration-200"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </>
          )}

          {mode === 'signup' && (
            <div className="text-center">
              <p className="text-white/70">
                Already have an account?
                <button
                  onClick={() => switchMode('login')}
                  className="ml-2 text-indigo-300 hover:text-indigo-200 font-medium transition duration-200"
                >
                  Sign In
                </button>
              </p>
            </div>
          )}

          {mode === 'forgot' && (
            <div className="text-center">
              <p className="text-white/70">
                Remember your password?
                <button
                  onClick={() => switchMode('login')}
                  className="ml-2 text-indigo-300 hover:text-indigo-200 font-medium transition duration-200"
                >
                  Sign In
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
      <Notification message={message.text} type={message.type} onClose={clearMessage} />
    </div>
  );
};

export default AuthForm;