import React, { useState, useEffect } from 'react';
import { Users, Trash2, Calendar, AlertCircle, Eye } from 'lucide-react';
import { User } from '../../types';
import { apiService } from '../../services/api';
import StudentSubmissionModal from './StudentSubmissionModal';

const ViewUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Modal state
  const [selectedStudent, setSelectedStudent] = useState<{
    id: string;
    name: string;
    regNo: string;
    testName: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters state
  const [yearFilter, setYearFilter] = useState<string>('');
  const [branchFilter, setBranchFilter] = useState<string>('');
  const [sectionFilter, setSectionFilter] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await apiService.getUsers();
      console.log('Fetched users:', data);
      // Map _id to id for compatibility
      const mappedUsers = data.map((user: any) => ({
        ...user,
        id: user._id,
      }));
      setUsers(mappedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    console.log('Deleting user with ID:', userId);
    if (!confirm('Are you sure you want to delete this student?')) return;

    setDeleteLoading(userId);
    try {
      await apiService.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleRowClick = (user: User) => {
    // Only allow clicking for students
    if (user.role === 'student') {
      setSelectedStudent({
        id: user.id,
        name: user.name,
        regNo: user.regno,
        testName: 'General Test'
      });
      setIsModalOpen(true);
    }
  };

  // Get unique values for filters
  const uniqueYears = Array.from(new Set(users.map(user => user.year).filter(Boolean))) as string[];
  const uniqueBranches = Array.from(new Set(users.map(user => user.branch).filter(Boolean))) as string[];
  const uniqueSections = Array.from(new Set(users.map(user => user.section).filter(Boolean))) as string[];
  const uniqueRoles = Array.from(new Set(users.map(user => user.role).filter(Boolean))) as string[];

  // Filter users based on selected filters
  const filteredUsers = users.filter(user => {
    return (
      (yearFilter === '' || user.year === yearFilter) &&
      (branchFilter === '' || user.branch === branchFilter) &&
      (sectionFilter === '' || user.section === sectionFilter) &&
      (roleFilter === '' || user.role === roleFilter)
    );
  });
  console.log('Filtered users count:', filteredUsers.length);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  // Function to export filtered users as Excel-compatible CSV
  function exportFilteredUsersExcel() {
    const headers = ['Name', 'Reg. Number', 'Year', 'Branch', 'Section', 'Phone', 'Created'];
    const rows = filteredUsers.map(user => [
      user.name || '',
      user.regno || '',
      user.year || '',
      user.branch || '',
      user.section || '',
      user.phone || '',
      new Date().toLocaleDateString(),
    ]);
    const csvContent =
      headers.join('\t') +
      '\n' +
      rows.map(row => row.join('\t')).join('\n');
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtered_students.xls';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Function to print filtered users as PDF
  function printFilteredUsersPDF() {
    const headers = ['Name', 'Reg. Number', 'Year', 'Branch', 'Section', 'Phone', 'Created'];
    const rows = filteredUsers.map(user => [
      user.name || '',
      user.regno || '',
      user.year || '',
      user.branch || '',
      user.section || '',
      user.phone || '',
      new Date().toLocaleDateString(),
    ]);
    const style = `
      <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    `;
    const tableHeaders = headers.map(h => `<th>${h}</th>`).join('');
    const tableRows = rows
      .map(
        row =>
          '<tr>' +
          row.map(cell => `<td>${cell}</td>`).join('') +
          '</tr>'
      )
      .join('');
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Print Filtered Students</title>${style}</head>
          <body>
            <h1>Filtered Students</h1>
            <table>
              <thead><tr>${tableHeaders}</tr></thead>
              <tbody>${tableRows}</tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          User List ({filteredUsers.length})
        </h3>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap space-x-4 items-center">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="">All Years</option>
            {uniqueYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="">All Branches</option>
            {uniqueBranches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>

          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="">All Sections</option>
            {uniqueSections.map(section => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="">All Roles</option>
            {uniqueRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          {/* Export Buttons */}
          <div className="ml-4 flex space-x-2">
            <button
              onClick={exportFilteredUsersExcel}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            >
              Export Excel
            </button>
            <button
              onClick={printFilteredUsersPDF}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
            >
              Print PDF
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {filteredUsers.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm sm:text-base px-4">No students found. Add some students to see them here.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Name</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Role</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Reg. Number</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Year</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Branch</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Section</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Phone</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  if (!user.id) {
                    console.warn('User without id found:', user);
                    return null;
                  }
                  return (
                    <tr 
                      key={user.id} 
                      className={`border-b border-gray-100 hover:bg-gray-50 ${user.role === 'student' ? 'cursor-pointer hover:bg-blue-50' : ''}`}
                      onClick={() => handleRowClick(user)}
                    >
                      <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium truncate max-w-32 sm:max-w-none">{user.name}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">{user.role || '-'}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">{user.regno || '-'}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">{user.year || '-'}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">{user.branch || '-'}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">{user.section || '-'}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">{user.phone || '-'}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell">
                        <div className="flex items-center space-x-2">
                          {user.role === 'student' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(user);
                              }}
                              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-xs"
                              title="View Results"
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="hidden sm:inline">Results</span>
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(user.id);
                            }}
                            disabled={deleteLoading === user.id}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-800 disabled:opacity-50 text-xs sm:text-sm"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">{deleteLoading === user.id ? 'Deleting...' : 'Delete'}</span>
                            <span className="sm:hidden">Del</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Submission Modal */}
      {selectedStudent && (
        <StudentSubmissionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          studentId={selectedStudent.id}
          studentName={selectedStudent.name}
          regNo={selectedStudent.regNo}
          testName={selectedStudent.testName}
        />
      )}
    </div>
  );
};

export default ViewUsers;
