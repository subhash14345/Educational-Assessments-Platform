import React, { useState } from 'react';
import Header from '../Layout/Header';
import Logins from './Logins';
import Questions from './Questions';
import Results from '../Student/Results';
import AdminProfilePopup from './AdminProfilePopup';
import TimetableManagement from './TimetableManagement';
import AdminHome from './AdminHome';
import { Users, FileText, Clock, Trophy, Home, Calendar } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showProfile, setShowProfile] = useState(false);

  const tabs = [
    { key: 'home', label: '', icon: Home },
    { key: 'logins', label: 'Logins', icon: Users },
    { key: 'questions', label: 'Questions', icon: FileText },
    { key: 'time-table', label: 'Time Table', icon: Calendar },
    { key: 'rank-table', label: 'Rank', icon: Trophy },
  ];

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <AdminHome setActiveTab={setActiveTab} />;
      case 'logins':
        // Check if there's a stored subTab from AdminHome navigation
        const storedTab = sessionStorage.getItem('adminSubTab');
        const initialTab = storedTab === 'add' || storedTab === 'view' ? storedTab : undefined;
        return <Logins initialTab={initialTab} />;
      case 'questions':
        // Check if there's a stored subTab from AdminHome navigation
        const questionsStoredTab = sessionStorage.getItem('questionsSubTab');
        const questionsInitialTab = questionsStoredTab === 'view' || questionsStoredTab === 'add' ? questionsStoredTab : undefined;
        return <Questions initialTab={questionsInitialTab} />;
      case 'time-table':
        return <TimetableManagement />;
      case 'rank-table':
        return <Results />;
      default:
        return <AdminHome setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        tabs={tabs} 
        onUserProfileClick={handleProfileClick}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {renderContent()}
      </main>
      
      {showProfile && (
        <AdminProfilePopup onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
};

export default AdminDashboard;
