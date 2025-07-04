import React from 'react';
import { Mail } from 'lucide-react';
import FormInput from './FormInput';

const ForgotPasswordForm = ({ formData, handleInputChange, errors }) => (
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
  </div>
);

export default ForgotPasswordForm;
