import React, { useEffect, useState } from "react";
import StaffDashboard from "../../Components/StaffDashboard/StaffDashboard";
import { getCurrentUser } from "../../api/usersApi";
import { useNavigate } from "react-router-dom";

const StaffDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        if (
          typeof user !== "object" ||
          user === null ||
          !("role" in user) ||
          (user as any).role !== "staff" && (user as any).role !== "admin"
        ) {
          navigate("/login");
        }
        setLoading(false);
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return <StaffDashboard />;
};

export default StaffDashboardPage;