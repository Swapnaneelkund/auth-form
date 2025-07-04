import React from 'react';

const PasswordStrength = ({ password }) => {
  const getStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[^A-Za-z0-9])/.test(password)) strength++;
    return strength;
  };

  const strength = getStrength();
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="mt-2">
      <div className="flex items-center">
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className={`h-2.5 rounded-full ${strengthColors[strength - 1]}`}
            style={{ width: `${(strength / 5) * 100}%` }}
          ></div>
        </div>
        <p className="ml-2 text-sm font-medium text-gray-900 dark:text-white">{strengthLabels[strength - 1]}</p>
      </div>
    </div>
  );
};

export default PasswordStrength;
