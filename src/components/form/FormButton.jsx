import React from 'react';

const FormButton = ({ loading, text, onClick }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
  >
    {loading ? (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
        {text}
      </div>
    ) : (
      text
    )}
  </button>
);

export default FormButton;
