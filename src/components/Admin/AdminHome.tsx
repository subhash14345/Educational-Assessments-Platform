import React, { useState, useEffect } from 'react';
import { 
  Users, 
  PlusCircle, 
  Eye, 
  FileText, 
  Clock, 
  Trophy,
  Home,
  UserPlus,
  BookOpen,
  Calendar,
  Award
} from 'lucide-react';
import { apiService } from '../../services/api';

interface AdminHomeProps {
  setActiveTab: (tab: string) => void;
}

interface StatsData {
  totalUsers: number;
  totalQuestions: number;
}

const AdminHome: React.FC<AdminHomeProps> = ({ setActiveTab }) => {
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalQuestions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch only users and questions data
      const [usersResponse, questionsResponse] = await Promise.all([
        apiService.getUsers(),
        apiService.getQuestions()
      ]);

      // Calculate statistics
      const totalUsers = usersResponse.length || 0;
      const totalQuestions = questionsResponse.length || 0;

      setStats({
        totalUsers,
        totalQuestions
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardStats();
  };

  const boxes = [
    {
      title: 'Add Users',
      description: 'Create new user accounts for students and staff',
      icon: UserPlus,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      tab: 'logins',
      subTab: 'add',
      route: '/admin/add-logins'
    },
    {
      title: 'View Users',
      description: 'Manage and view all registered users',
      icon: Users,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      tab: 'logins',
      subTab: 'view',
      route: '/admin/view-users'
    },
    {
      title: 'Add Questions',
      description: 'Create new questions for tests and assessments',
      icon: PlusCircle,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      tab: 'questions',
      subTab: 'add',
      route: '/admin/add-questions'
    },
    {
      title: 'View Questions',
      description: 'Browse and manage all questions',
      icon: Eye,
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600',
      tab: 'questions',
      subTab: 'view',
      route: '/admin/view-questions'
    },
    {
      title: 'Time Table',
      description: 'View and manage exam schedules',
      icon: Calendar,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      tab: 'time-table',
      route: '/admin/time-table'
    },
    {
      title: 'Rank Table',
      description: 'View student rankings and performance',
      icon: Award,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      tab: 'rank-table',
      route: '/admin/rank-table'
    }
  ];

  const handleBoxClick = (tab: string, subTab?: string) => {
    // Store the subTab in sessionStorage to be read by the target component
    if (subTab) {
      if (tab === 'logins') {
        sessionStorage.setItem('adminSubTab', subTab);
      } else if (tab === 'questions') {
        sessionStorage.setItem('questionsSubTab', subTab);
      }
    }
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex flex-col">
      <div className="flex-grow">
        <div className="max-w-8xl mx-auto px-8 sm:px-6 lg:px-10 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Admin Dashboard
            </h1>
            <p className="text-xl text-gray-700">
              Welcome to the administration panel. Manage your platform efficiently.
            </p>
          </div>

          {/* Stats Overview - Updated to show only 2 boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Questions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Boxes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boxes.map((box, index) => (
              <div
                key={index}
                onClick={() => handleBoxClick(box.tab, box.subTab)}
                className={`${box.color} ${box.hoverColor} text-white rounded-xl shadow-lg p-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    <box.icon className="h-16 w-16" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{box.title}</h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {box.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => handleBoxClick('logins', 'add')}
                className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Add New User
              </button>
              
              <button
                onClick={() => handleBoxClick('questions', 'add')}
                className="flex items-center justify-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add Questions
              </button>
              
              <button
                onClick={() => handleBoxClick('time-table')}
                className="flex items-center justify-center px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <Calendar className="h-5 w-5 mr-2" />
                View Schedule
              </button>
              
              <button
                onClick={() => handleBoxClick('rank-table')}
                className="flex items-center justify-center px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Award className="h-5 w-5 mr-2" />
                View Rankings
              </button>
            </div>
          </div>
        </div>
      </div>
      <EnhancedAdminFooter />
    </div>
  );
};

import EnhancedAdminFooter from './EnhancedAdminFooter';

export default AdminHome;
