import React, { useEffect, useState } from 'react';
import StudentDashboard from '../../Components/StudentDashboard/StudentDashboard';
import { getCurrentUser } from '../../api/usersApi';
import { useNavigate } from 'react-router-dom';

const StudentDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser()
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <div><StudentDashboard /></div>
  );
};

export default StudentDashboardPage;