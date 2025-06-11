import React, { useEffect, useState } from 'react';
import UserManagement from '../../Components/AdminDashboard/UserManagment';
import AnalyticsDashboard from '../../Components/AdminDashboard/AnalyticsDashboard';
import AdminSecurity from '../../Components/AdminDashboard/AdminSecurity';
import { getCurrentUser } from '../../api/usersApi';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const [activePage, setActivePage] = useState<'userManagement' | 'analytics' | 'security'>('userManagement');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getCurrentUser()
            .then(user => {
                if (typeof user === 'object' && user !== null && 'role' in user && (user as { role: string }).role !== "admin") {
                    navigate("/login");
                }
                setLoading(false);
            })
            .catch(() => {
                navigate("/login");
            });
    }, [navigate]);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div>
                <button onClick={() => setActivePage('userManagement')}>User Management</button>
                <button onClick={() => setActivePage('analytics')}>Analytics Dashboard</button>
                <button onClick={() => setActivePage('security')}>Admin Security</button>
            </div>
            <div>
                {activePage === 'userManagement' && <UserManagement />}
                {activePage === 'analytics' && <AnalyticsDashboard />}
                {activePage === 'security' && <AdminSecurity />}
            </div>
        </div>
    );
};

export default AdminPage;