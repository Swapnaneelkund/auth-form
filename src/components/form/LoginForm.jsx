import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import FormInput from './FormInput';

const LoginForm = ({ formData, handleInputChange, errors }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      <FormInput
        label="Email Address *"
        icon={Mail}
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Enter your email"
        error={errors.email}
      />
      <FormInput
        label="Password *"
        icon={Lock}
        type={showPassword ? 'text' : 'password'}
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        placeholder="Enter your password"
        error={errors.password}
        toggleVisibility={{
          show: showPassword,
          onClick: () => setShowPassword(!showPassword),
        }}
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-white/90">
            Remember me
          </label>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
