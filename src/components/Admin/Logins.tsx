import React, { useState } from 'react';
import { UserPlus, Users } from 'lucide-react';
import AddUser from './AddUser';
import ViewUsers from './ViewUsers';

interface LoginsProps {
  initialTab?: 'add' | 'view';
}

const Logins: React.FC<LoginsProps> = ({ initialTab }) => {
  // Get initial tab from props or sessionStorage, default to 'view'
  const getInitialTab = (): 'add' | 'view' => {
    if (initialTab) return initialTab;
    
    const storedTab = sessionStorage.getItem('adminSubTab');
    sessionStorage.removeItem('adminSubTab'); // Clean up after reading
    
    if (storedTab === 'add' || storedTab === 'view') {
      return storedTab;
    }
    
    return 'view';
  };

  const [activeTab, setActiveTab] = useState<'add' | 'view'>(getInitialTab);

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="items-center justify-center flex space-x-4 border-b border-gray-200 pb-4 mb-6">
          <button
            onClick={() => setActiveTab('view')}
            className={`flex items-center space-x-2 px-6 py-2 rounded-md text-lg font-medium transition-colors ${
              activeTab === 'view'
                ? 'bg-blue-100 text-blue-800 border-b-2 border-b-blue-500'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            <span>View Users</span>
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`flex items-center space-x-2 px-6 py-2 rounded-md text-lg font-medium transition-colors ${
              activeTab === 'add'
                ? 'bg-blue-100 text-blue-800 border-b-2 border-b-blue-500'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Add Users or Admins</span>
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'view' && <ViewUsers />}
          {activeTab === 'add' && <AddUser />}
        </div>
      </div>
    </div>
  );
};

export default Logins;
