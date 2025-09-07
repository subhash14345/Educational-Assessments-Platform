import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Book, User, Building, AlertCircle } from 'lucide-react';
import { apiService } from '../../services/api';

interface TimetableEntry {
  _id: string;
  day: string;
  timeSlot: string;
  subject: string;
  teacher: string;
  room: string;
  year: string;
  branch: string;
  section: string;
}

const StudentTimetable: React.FC = () => {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState<string>('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchTimetable();
  }, [selectedDay]);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiService.getStudentTimetable(selectedDay || undefined);
      setEntries(data);
    } catch (error: any) {
      if (error.message.includes('Student profile incomplete')) {
        setError('Please complete your profile with year, branch, and section information to view your timetable.');
      } else {
        setError(error.message || 'Failed to fetch timetable');
      }
    } finally {
      setLoading(false);
    }
  };

  const groupEntriesByDay = (entries: TimetableEntry[]) => {
    const grouped: { [key: string]: TimetableEntry[] } = {};
    
    days.forEach(day => {
      grouped[day] = entries.filter(entry => entry.day === day);
    });

    return grouped;
  };

  const groupedEntries = groupEntriesByDay(entries);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <AlertCircle size={24} className="text-yellow-600" />
          <h2 className="text-lg font-semibold text-yellow-800">Profile Information Required</h2>
        </div>
        <p className="text-yellow-700 mb-4">{error}</p>
        <p className="text-sm text-yellow-600">
          Please update your profile with your year, branch, and section information to view your personalized timetable.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Timetable</h1>
          <p className="text-gray-600">View your class schedule</p>
        </div>
        
        {/* Day Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Filter by day:</label>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Days</option>
            {days.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Weekly Timetable View */}
      {!selectedDay && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {days.map(day => (
            <div key={day} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-center">{day}</h3>
              {groupedEntries[day].length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Calendar size={32} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No classes</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {groupedEntries[day]
                    .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
                    .map(entry => (
                      <div key={entry._id} className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-blue-800">{entry.timeSlot}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Book size={12} className="text-blue-600 mr-1" />
                            <span className="text-sm font-medium text-gray-900">{entry.subject}</span>
                          </div>
                          <div className="flex items-center">
                            <User size={12} className="text-blue-600 mr-1" />
                            <span className="text-xs text-gray-600">{entry.teacher}</span>
                          </div>
                          <div className="flex items-center">
                            <Building size={12} className="text-blue-600 mr-1" />
                            <span className="text-xs text-gray-600">{entry.room}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Single Day Detailed View */}
      {selectedDay && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 text-white">
            <h2 className="text-lg font-semibold">{selectedDay} Schedule</h2>
          </div>
          
          {groupedEntries[selectedDay].length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No classes scheduled for {selectedDay}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {groupedEntries[selectedDay]
                    .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
                    .map(entry => (
                      <tr key={entry._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Clock size={16} className="text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">{entry.timeSlot}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Book size={16} className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{entry.subject}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User size={16} className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{entry.teacher}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Building size={16} className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{entry.room}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Class Information */}
      {entries.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Class Information</h3>
          <p className="text-sm text-blue-700">
            Year: {entries[0].year} | Branch: {entries[0].branch} | Section: {entries[0].section}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentTimetable;
