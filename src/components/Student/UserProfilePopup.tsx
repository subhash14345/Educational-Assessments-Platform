import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUserUpdate } from '../../context/UserUpdateContext';
import { apiService } from '../../services/api';

interface UserProfilePopupProps {
  onClose: () => void;
}

const UserProfilePopup: React.FC<UserProfilePopupProps> = ({ onClose }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [regno, setRegno] = useState('');
  const [year, setYear] = useState('');
  const [branch, setBranch] = useState('');
  const [section, setSection] = useState('');
  const [phone, setPhone] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const { setUserUpdated } = useUserUpdate();

  // Fetch complete user profile when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setFetchError(null);
        
        const response = await apiService.getStudentProfile(user.id);
        const userData = response.user;
        
        // Update form fields with complete user data
        setName(userData.name || '');
        setRegno(userData.regno || '');
        setYear(userData.year || '');
        setBranch(userData.branch || '');
        setSection(userData.section || '');
        setPhone(userData.phone || '');
        
        // Update auth context with complete data
        updateUser({
          ...user,
          ...userData
        });
        
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setFetchError(error instanceof Error ? error.message : 'Failed to load profile data');
        
        // Fallback to existing user data if fetch fails
        setName(user?.name || '');
        setRegno(user?.regno || '');
        setYear(user?.year || '');
        setBranch(user?.branch || '');
        setSection(user?.section || '');
        setPhone(user?.phone || '');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  const handleUpdate = async () => {
    if (!user) return;

    setSaving(true);
    setUpdateError(null);

    try {
      const profileData = {
        name: name.trim(),
        year: year?.trim() || '',
        branch: branch?.trim() || '',
        section: section?.trim() || '',
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
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update profile');
      console.error('Profile update error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end items-start z-50">
      <div className="bg-white mt-20 mr-6 rounded-lg shadow-lg p-6 w-96 max-w-full">
        <h2 className="text-lg font-semibold mb-4">User Profile</h2>
        
        {fetchError && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            {fetchError}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            {editing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            ) : (
              <p className="mt-1 text-gray-900">{name || '-'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Registration Number</label>
            {editing ? (
              <input
                type="text"
                value={regno}
                onChange={(e) => setRegno(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                disabled
              />
            ) : (
              <p className="mt-1 text-gray-900">{regno || '-'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Year</label>
            {editing ? (
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="e.g., 2nd, 3rd, 4th"
              />
            ) : (
              <p className="mt-1 text-gray-900">{year || '-'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Branch</label>
            {editing ? (
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="e.g., CSE, ECE, ME"
              />
            ) : (
              <p className="mt-1 text-gray-900">{branch || '-'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Section</label>
            {editing ? (
              <input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="e.g., A, B, C"
              />
            ) : (
              <p className="mt-1 text-gray-900">{section || '-'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            {editing ? (
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="e.g., 9876543210"
              />
            ) : (
              <p className="mt-1 text-gray-900">{phone || '-'}</p>
            )}
          </div>
        </div>
        
        {updateError && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {updateError}
          </div>
        )}
        
        <div className="flex justify-end space-x-2 mt-6">
          {editing ? (
            <>
              <button
                onClick={handleUpdate}
                disabled={saving}
                className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setUpdateError(null);
                  // Reset to original values
                  setName(user?.name || '');
                  setYear(user?.year || '');
                  setBranch(user?.branch || '');
                  setSection(user?.section || '');
                  setPhone(user?.phone || '');
                }}
                disabled={saving}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update Details
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
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

export default UserProfilePopup;
