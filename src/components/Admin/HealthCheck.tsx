import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const HealthCheck: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [details, setDetails] = useState<string>('');
  const [apiUrl, setApiUrl] = useState<string>('');

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      setApiUrl(apiBaseUrl);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setStatus('error');
        setDetails('No authentication token found. Please log in.');
        return;
      }

      const response = await fetch(`${apiBaseUrl}/admin/questions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        setStatus('success');
        setDetails('API is working correctly');
      } else {
        setStatus('error');
        const errorText = await response.text();
        setDetails(`API error: ${response.status} - ${response.statusText}\n${errorText}`);
      }
    } catch (err) {
      setStatus('error');
      setDetails(err instanceof Error ? err.message : 'Network error - check if server is running');
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        {status === 'success' && <CheckCircle className="h-5 w-5 text-green-500 mr-2" />}
        {status === 'error' && <XCircle className="h-5 w-5 text-red-500 mr-2" />}
        {status === 'checking' && <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />}
        API Health Check
      </h3>
      <p className="text-sm text-gray-600 mb-2">API URL: {apiUrl}</p>
      <p className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
        {details}
      </p>
      <button 
        onClick={checkHealth}
        className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
      >
        Recheck
      </button>
    </div>
  );
};

export default HealthCheck;
