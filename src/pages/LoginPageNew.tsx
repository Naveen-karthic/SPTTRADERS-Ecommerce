import React, { useState } from 'react';
import LoginNewPage from './LoginNewPage';
import OTPVerificationPage from './OTPVerificationPage';

const LoginPageNew: React.FC = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string | undefined>(undefined);

  const handleOTPSent = (emailAddress: string, otpCode?: string) => {
    setEmail(emailAddress);
    setOtp(otpCode);
    setShowOTP(true);
  };

  const handleBack = () => {
    setShowOTP(false);
    setEmail('');
    setOtp(undefined);
  };

  return (
    <>
      {!showOTP ? (
        <LoginNewPage onOTPSent={handleOTPSent} />
      ) : (
        <OTPVerificationPage email={email} onBack={handleBack} initialOTP={otp} />
      )}
    </>
  );
};

export default LoginPageNew;
