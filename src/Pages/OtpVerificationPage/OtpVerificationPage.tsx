import React, { useState } from "react";
import { verifyOtp } from "../../api/usersApi";
import { useNavigate } from "react-router-dom";
import OtpVerification from "../../Components/OtpVerification/OtpVerification";

const OtpVerificationPage: React.FC = () => {
 

  return (
   <div>
    <OtpVerification />
    </div>
  );
};

export default OtpVerificationPage;