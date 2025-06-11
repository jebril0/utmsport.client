import React, { useState } from "react";
import { requestPasswordResetOtp, resetPassword } from "../../api/usersApi";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);

  const handleRequestOtp = async () => {
    await requestPasswordResetOtp(email);
    setStep(2);
  };

  const handleResetPassword = async () => {
    await resetPassword({ email, otp: parseInt(otp), newPassword });
    setStep(3);
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      {step === 1 && (
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleRequestOtp}>Request OTP</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleResetPassword}>Reset Password</button>
        </div>
      )}
      {step === 3 && <p>Password reset successfully!</p>}
    </div>
  );
};

export default ForgotPassword;
