import React, { useState } from 'react';
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { apiService } from '../../services/api';

const AddUser: React.FC = () => {
  const [formData, setFormData] = useState({
    role: 'student', // new field for role
    name: '',
    regno: '',
    password: '',
    year: '',
    branch: '',
    section: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      await apiService.createUser(formData);
      setSuccess('User created successfully!');
      setFormData({ role: 'student', name: '', regno: '', password: '', year: '', branch: '', section: '', phone: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            {formData.role === 'admin' ? 'Add New Admin' : 'Add New Student'}
          </h3>

          {error && (
            <div className="mb-4 flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-md">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="role" className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
 
            <div>
              <label htmlFor="name" className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                placeholder={formData.role === 'admin' ? "Enter admin's full name" : "Enter student's full name"}
              />
            </div>
 
            {formData.role === 'student' && (
              <>
                <div>
                  <label htmlFor="regno" className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    id="regno"
                    name="regno"
                    value={formData.regno}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    placeholder="Enter unique registration number"
                  />
                </div>
 
                <div>
                  <label htmlFor="year" className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    placeholder="Enter year"
                  />
                </div>
 
                <div>
                  <label htmlFor="branch" className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                    Branch
                  </label>
                  <input
                    type="text"
                    id="branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    placeholder="Enter branch"
                  />
                </div>
 
                <div>
                  <label htmlFor="section" className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                    Section
                  </label>
                  <input
                    type="text"
                    id="section"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    placeholder="Enter section"
                  />
                </div>
              </>
            )}
 
            <div>
              <label htmlFor="password" className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                placeholder="Enter password"
              />
            </div>
 
            <div>
              <label htmlFor="phone" className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                placeholder={formData.role === 'admin' ? "Enter admin's phone number" : "Enter phone number"}
              />
            </div>
 
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                {loading ? 'Adding...' : formData.role === 'admin' ? 'Add Admin' : 'Add Student'}
              </button>
            </div>
          </form>
      </div>
    </div>
  );
};

export default AddUser;
