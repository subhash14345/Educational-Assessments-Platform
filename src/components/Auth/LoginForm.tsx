import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

const LoginForm: React.FC = () => {
  const [regno, setRegno] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.login(regno, password);
      login(response.token, response.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <div>
          <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            Assessment Platform
          </h2>
          <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
            Sign in to your account
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-white p-6 sm:p-8 rounded-lg shadow-lg" onSubmit={handleSubmit}>
          {error && (
            <div className="flex items-start space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm leading-relaxed">{error}</span>
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label htmlFor="regno" className="block text-sm sm:text-base font-medium text-gray-700">
                Registration Number
              </label>
              <input
                id="regno"
                name="regno"
                type="text"
                required
                value={regno}
                onChange={(e) => setRegno(e.target.value)}
                className="mt-1 hover:border-green-400 appearance-none rounded-md relative block w-full px-3 py-2 sm:py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-sm sm:text-base"
                placeholder="Enter your registration number"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm sm:text-base font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none hover:border-green-400 rounded-md relative block w-full px-3 py-2 sm:py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-sm sm:text-base"
                  placeholder="Enter your password"
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
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Please Wait...' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-500">
              If you don't have an account, please Register and Login.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;