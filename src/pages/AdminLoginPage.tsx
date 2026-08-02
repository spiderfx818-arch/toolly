import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { store } from '../lib/store';
import { AdminLogin } from '../components/Admin/AdminLogin';
import { AdminUser } from '../types';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(store.getAdminUser());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setAdminUser(store.getAdminUser());
    });
    return () => unsubscribe();
  }, []);

  if (adminUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans">
      <AdminLogin
        onLogin={async (email, pass) => {
          const success = await store.loginAdmin(email, pass);
          if (success) {
            navigate('/dashboard');
          }
          return success;
        }}
        onClose={() => navigate('/')}
      />
    </div>
  );
};
