import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserUpdateProvider } from './context/UserUpdateContext';
import AuthTabs from './components/Auth/AuthTabs';
import StudentDashboard from './components/Student/StudentDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <AuthTabs />;
  }

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  return <StudentDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <UserUpdateProvider>
        <AppContent />
      </UserUpdateProvider>
    </AuthProvider>
  );
}

export default App;
