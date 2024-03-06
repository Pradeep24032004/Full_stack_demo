import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Make sure you have react-router-dom installed

function EmailVerification() {
  const { token } = useParams();
  const [verificationMessage, setVerificationMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/verify/${token}`);
        const data = await response.json();
        if (response.ok) {
          setVerificationMessage(data.message);
        } else {
          setVerificationMessage('Email verification failed. Please try again.');
        }
      } catch (error) {
        console.error(error);
        setVerificationMessage('Email verification failed. Please try again.');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{verificationMessage}</p>
    </div>
  );
}

export default EmailVerification;
