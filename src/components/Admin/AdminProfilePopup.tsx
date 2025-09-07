import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUserUpdate } from '../../context/UserUpdateContext';
import { apiService } from '../../services/api';

interface AdminProfilePopupProps {
  onClose: () => void;
}

const AdminProfilePopup: React.FC<AdminProfilePopupProps> = ({ onClose }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [regno, setRegno] = useState('');
  const [phone, setPhone] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const { setUserUpdated } = useUserUpdate();

  // Fetch admin profile when component mounts
  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setFetchError(null);
        
        const response = await apiService.getStudentProfile(user.id);
        const userData = response.user;
        
        // Update form fields with admin data
        setName(userData.name || '');
        setRegno(userData.regno || '');
        setPhone(userData.phone || '');
        
        // Update auth context with complete data
        updateUser({
          ...user,
          ...userData
        });
        
      } catch (error) {
        console.error('Failed to fetch admin profile:', error);
        setFetchError(error instanceof Error ? error.message : 'Failed to load profile data');
        
        // Fallback to existing user data
        setName(user?.name || '');
        setRegno(user?.regno || '');
        setPhone(user?.phone || '');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [user?.id]);

  const handleUpdate = async () => {
    if (!user) return;

    setSaving(true);
    setUpdateError(null);

    try {
      const profileData = {
        name: name.trim(),
        regno: regno.trim(),
        phone: phone?.trim() || '',
      };

      const response = await apiService.updateStudentProfile(user.id, profileData);
      
      // Update local state with response from server
      const updatedUser = {
        ...user,
        ...response.user
      };
      
      updateUser(updatedUser);
      setUserUpdated(true);
      setEditing(false);
      
      alert('Admin profile updated successfully!');
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update profile');
      console.error('Profile update error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end items-start z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Loading admin profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end items-start z-50 pt-20">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Admin Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {fetchError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {fetchError}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            {editing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 rounded-md">{name || '-'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
            {editing ? (
              <input
                type="text"
                value={regno}
                onChange={(e) => setRegno(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder='Any number'
              />
              
            ) : (
              <p className="px-3 py-2 bg-gray-50 rounded-md">{regno || '-'}</p>
            )}
          </div>
          <p className="text-sm text-red-500"><span className='border-b-2 border-blue-500'>NOTE:</span> Regd Number & password should be different</p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            {editing ? (
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 9876543210"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 rounded-md">{phone || '-'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Role</label>
            <p className="px-3 py-2 bg-gray-50 rounded-md font-semibold text-blue-500">Administrator</p>
          </div>
        </div>
        
        {updateError && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {updateError}
          </div>
        )}
        
        <div className="flex justify-end space-x-3 mt-6">
          {editing ? (
            <>
              <button
                onClick={handleUpdate}
                disabled={saving}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setUpdateError(null);
                  // Reset to original values
                  setName(user?.name || '');
                  setRegno(user?.regno || '');
                  setPhone(user?.phone || '');
                }}
                disabled={saving}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:text-white hover:bg-gray-400 disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update Details
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePopup;