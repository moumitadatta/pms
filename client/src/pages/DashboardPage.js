import React from 'react';
import { useSelector } from 'react-redux';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import EmployeeDashboard from '../components/dashboard/EmployeeDashboard';

const DashboardPage = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div>
      {user && user.role === 'admin' ? (
        <AdminDashboard />
      ) : (
        <EmployeeDashboard />
      )}
    </div>
  );
};

export default DashboardPage;