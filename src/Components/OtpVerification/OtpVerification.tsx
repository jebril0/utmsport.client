import React, { useState } from "react";
import { verifyOtp } from "../../api/usersApi";
import { useNavigate } from "react-router-dom";

const OtpVerification: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Updated OTP verification to show success message and redirect
  const handleVerifyOtp = async () => {
    try {
      const response = await verifyOtp(email, parseInt(otp));
      setMessage((response as { message: string }).message);
      alert("OTP verified successfully! Redirecting to login page..."); // Success alert
      navigate("/login"); // Redirect to login after successful verification
    } catch (error: any) {
      setMessage(error.response?.data || "OTP verification failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>OTP Verification</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerifyOtp}>Verify OTP</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default OtpVerification;