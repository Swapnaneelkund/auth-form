import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, AlertCircle } from 'lucide-react';

const VerifyEmail = () => {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyUserEmail = async () => {
      try {
        const response = await axios.get(`/api/auth/verify-email/${token}`);
        setVerificationStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');
      } catch (error) {
        setVerificationStatus('error');
        setMessage(error.response?.data?.message || 'Email verification failed. Token might be invalid or expired.');
      }
    };

    if (token) {
      verifyUserEmail();
    } else {
      setVerificationStatus('error');
      setMessage('No verification token provided.');
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 text-white">
      <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-md text-center">
        {verificationStatus === 'verifying' && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">Verifying your email...</h2>
            <p>Please wait, this may take a moment.</p>
          </div>
        )}

        {verificationStatus === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
            <p>{message}</p>
            <p className="mt-4">You can now close this page or <Link to="/" className="text-indigo-300 hover:text-indigo-400 font-semibold">log in</Link>.</p>
          </div>
        )}

        {verificationStatus === 'error' && (
          <div className="flex flex-col items-center">
            <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
            <p>{message}</p>
            <p className="mt-4">Please try again or contact support.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
