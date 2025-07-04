import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

const FormInput = ({ icon: Icon, type, name, value, onChange, placeholder, error, children, label, toggleVisibility }) => {
  const errorId = error ? `${name}-error` : undefined;
  const isPasswordField = name.toLowerCase().includes('password');

  return (
    <div>
      <label htmlFor={name} className="block text-white/90 text-sm font-medium mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full pl-12 pr-4 py-3 bg-white/10 border ${
            error ? 'border-red-400' : 'border-white/20'
          } rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ${isPasswordField ? 'pr-12' : ''}`}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={errorId}
        />
        {isPasswordField && toggleVisibility && (
          <button
            type="button"
            onClick={toggleVisibility.onClick}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition duration-200"
          >
            {toggleVisibility.show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
        {children}
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-300">{error}</p>
      )}
    </div>
  );
};

export default FormInput;
