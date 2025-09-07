import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import LoginForm from './LoginForm';
// import Header from '../Layout/Header';
import { apiService } from '../../services/api';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    regno: '',
    password: '',
    year: '',
    branch: '',
    section: '',
    phone: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Use apiService.createUser instead of direct fetch
      try {
        const response = await apiService.createUser(formData, true); // skipAuth = true
        setSuccess('User registered successfully!');
        setFormData({
          name: '',
          regno: '',
          password: '',
          year: '',
          branch: '',
          section: '',
          phone: '',
        });
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        } else {
          throw new Error('Failed to register user');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg">
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-sm border-black shadow-sm focus:border-black-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter full name"
        />
      </div>

      <div>
        <label htmlFor="regno" className="block text-sm font-medium text-gray-700">Registration Number</label>
        <input
          type="text"
          id="regno"
          name="regno"
          value={formData.regno}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter registration number"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <div className="mt-1 relative">
        <input
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter password"
        />
        <button
          type="button"
          className="absolute hover:border-white-300 inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400" />
          )}
        </button>
        </div>
      </div>

      <div>
        <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
        <select
          id="year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Select year</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>

      <div>
        <label htmlFor="branch" className="block text-sm font-medium text-gray-700">Branch</label>
        <select
          id="branch"
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Select branch</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="EEE">EEE</option>
          <option value="AIML">AIML</option>
          <option value="AIDS">AIDS</option>
          <option value="CSE-CS">CSE-CS</option>
          <option value="AI-DS">AI-DS</option>
          <option value="MECH">MECH</option>
          <option value="CIVIL">CIVIL</option>
          <option value="Robotics">Robotics</option>
        </select>
      </div>

      <div>
        <label htmlFor="section" className="block text-sm font-medium text-gray-700">Section</label>
        <select
          id="section"
          name="section"
          value={formData.section}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Select section</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="E">E</option>
          <option value="F">F</option>
          <option value="G">G</option>
        </select>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter phone number"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </div>
    </form>
  );
};

const AuthTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showAdminRegister, setShowAdminRegister] = useState(false);
  const tabs = [
    { key: 'login', label: 'Login' },
    { key: 'register', label: 'Register' },
  ];

  // Wrapper function to match Header's setActiveTab type
  // const handleSetActiveTab = (tab: string) => {
  //   if (tab === 'login' || tab === 'register') {
  //     setActiveTab(tab);
  //   }
  // };

  // const handleUserProfileRightClick = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   setShowAdminRegister(true);
  // };

  return (
    <>
      {/* Header removed on login/register page */}
      <div className="max-w-md mx-auto mt-10 p-4 bg-gray-50 rounded-lg shadow-lg">
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setActiveTab('login')}
            className={`px-4 py-2 font-semibold ${activeTab === 'login' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`ml-4 px-4 py-2 font-semibold ${activeTab === 'register' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Register
          </button>
        </div>
        {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
        {showAdminRegister && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                onClick={() => setShowAdminRegister(false)}
              >
                &#x2715;
              </button>
              <h2 className="text-xl font-semibold mb-4">Admin Registration</h2>
              <RegisterForm />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AuthTabs;
