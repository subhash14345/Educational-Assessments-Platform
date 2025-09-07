import React, { useState, useEffect } from 'react';
import { FileText, Trash2, Filter, AlertCircle, Edit3 } from 'lucide-react';
import { Question } from '../../types';
import { apiService } from '../../services/api';
import EditQuestionModal from './EditQuestionModal';

// Year options for courses
const yearOptions = [
  { value: '2nd', label: '2ND YEAR' },
  { value: '3rd', label: '3RD YEAR' },
  { value: '4th', label: '4TH YEAR' },
];

// Semester options for each year
const semesterOptions: Record<string, { value: string; label: string }[]> = {
  '2nd': [
    { value: 'sem3', label: 'Semester 3' },
    { value: 'sem4', label: 'Semester 4' },
  ],
  '3rd': [
    { value: 'sem5', label: 'Semester 5' },
    { value: 'sem6', label: 'Semester 6' },
  ],
  '4th': [
    { value: 'sem7', label: 'Semester 7' },
    { value: 'sem8', label: 'Semester 8' },
  ],
};

// Subjects (subcategories) for each semester
const semesterSubjects: Record<string, { value: string; label: string }[]> = {
  sem3: [
    { value: 'dmgt', label: 'Discrete Mathematics' },
    { value: 'mefa', label: 'Managerial Economics & Financial Analysis' },
    { value: 'CO', label: 'Computer Organisation' },
    { value: 'adsa', label: 'Advanced Data Structures & Algorithms' },
    { value: 'dbms', label: 'Database Management Systems' },
    { value: 'adsa lab', label: 'Advanced Data Structures & Algorithms Lab' },
    { value: 'dbms lab', label: 'Database Management Systems Lab' },
    { value: 'python', label: 'Python Programming' },
  ],
  sem4: [
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'history', label: 'History' },
  ],
  sem5: [
    { value: 'ml', label: 'Machine Learning' },
    { value: 'cn', label: 'Computer Networks' },
    { value: 'atcd', label: 'Automata Theory & Compiler Design' },
    { value: 'ooad', label: 'Object Oriented Analysis & Design' },
    { value: 'ai', label: 'Artificial Intelligence' },
    { value: 'mpmc', label: 'Micro Processors & Micro Controllers' },
    { value: 'ml lab', label: 'Machine Learning Lab' },
    { value: 'cn lab', label: 'Computer Networks Lab' },
    { value: 'soft', label: 'Soft Skills' },
    { value: 'flutter', label: 'User Interface Design & Flutter' },

  ],
  sem6: [
    { value: 'geography', label: 'Geography' },
    { value: 'english', label: 'English' },
    { value: 'physics', label: 'Physics' },
  ],
  sem7: [
    { value: 'cns', label: 'Cryptography & Network Security' },
    { value: 'nlp', label: 'Natural Language Processing' },
    { value: 'cv', label: 'Computer Vision' },
    { value: 'app', label: 'Advanced Python Programming' },
  ],
  sem8: [
    { value: 'biology', label: 'Biology' },
    { value: 'history', label: 'History' },
    { value: 'geography', label: 'Geography' },
  ],
};

const ViewQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, categoryFilter, subjectFilter]);

  const loadQuestions = async () => {
    try {
      const data = await apiService.getQuestions();
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = questions;

    if (categoryFilter) filtered = filtered.filter(q => q.category === categoryFilter);

    if (categoryFilter === 'courses') {
      // Commented out year and semester filtering due to missing fields in question data
      /*
      if (yearFilter) {
        console.log('Filtering year:', yearFilter);
        console.log('Filtering sem:', semesterFilter);
        // console.log('Filtering subject:', subjectFilter);
        filtered = filtered.filter(q => {
          console.log('Question year:', q.subcategory);
          return q.year === yearFilter;
        });
      }
      if (semesterFilter) filtered = filtered.filter(q => q.semester === semesterFilter);
      */
      if (subjectFilter) {
        // Fix: subjectFilter values like 'maths' should match question.subcategory exactly
        filtered = filtered.filter(q => q.subcategory === subjectFilter);
      }
    } else {
      if (subjectFilter) filtered = filtered.filter(q => q.subcategory === subjectFilter);
    }

    setFilteredQuestions(filtered);
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    setDeleteLoading(questionId);
    try {
      await apiService.deleteQuestion(questionId);
      setQuestions(questions.filter(q => q._id !== questionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete question');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedQuestion: Question) => {
    setEditLoading(true);
    try {
      console.log('Saving question:', updatedQuestion);
      await apiService.updateQuestion(updatedQuestion._id, updatedQuestion);
      setQuestions(questions.map(q => q._id === updatedQuestion._id ? updatedQuestion : q));
      setEditModalOpen(false);
      setEditingQuestion(null);
      setError('');
    } catch (err) {
      console.error('Save error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update question');
    } finally {
      setEditLoading(false);
    }
  };

  const getUniqueValues = (key: keyof Question) => {
    return [...new Set(questions.map(q => q[key]).filter(Boolean))];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Question Bank ({filteredQuestions.length})
        </h3>

        {error && (
          <div className="mb-4 flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          {/* Category */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setYearFilter('');
                setSemesterFilter('');
                setSubjectFilter('');
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {getUniqueValues('category').map((category) => {
                // Add type guard to ensure category is string
                if (typeof category !== 'string') return null;
                return (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Year (for Courses) */}
          {categoryFilter === 'courses' && (
            <div>
              <select
                value={yearFilter}
                onChange={e => {
                  setYearFilter(e.target.value);
                  setSemesterFilter('');
                  setSubjectFilter('');
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Years</option>
                {yearOptions.map((yr) => (
                  <option key={yr.value} value={yr.value}>
                    {yr.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Semester (for Courses and after year is selected) */}
          {categoryFilter === 'courses' && yearFilter && (
            <div>
              <select
                value={semesterFilter}
                onChange={e => {
                  setSemesterFilter(e.target.value);
                  setSubjectFilter('');
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Semesters</option>
                {semesterOptions[yearFilter]?.map((sem) => (
                  <option key={sem.value} value={sem.value}>
                    {sem.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Subject (Subcategory) for Courses */}
          {categoryFilter === 'courses' && yearFilter && semesterFilter && (
            <div>
              <select
                value={subjectFilter}
                onChange={e => setSubjectFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Subjects</option>
                {semesterSubjects[semesterFilter]?.map((subcat, index) => (
                  // Add index to key to ensure uniqueness
                  <option key={`${subcat.value}-${index}`} value={subcat.value}>
                    {subcat.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Subcategory for non-courses */}
          {categoryFilter && categoryFilter !== 'courses' && (
            <div>
              <select
                value={subjectFilter}
                onChange={e => setSubjectFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Subcategories</option>
              {getUniqueValues('subcategory').map((subcategory) => {
                // Add type guard to ensure subcategory is string
                if (typeof subcategory !== 'string') return null;
                return (
                  <option key={subcategory} value={subcategory}>
                    {subcategory.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </option>
                );
              })}
              </select>
            </div>
          )}
        </div>

        {filteredQuestions.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm sm:text-base px-4">No questions found. Upload some questions to see them here.</p>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <div key={question._id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-3 space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {question.category}
                      </span>
                          {question.category === 'courses' ? (
                            <>
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                {question.year ? `${question.year.toUpperCase()} YEAR` : ''}
                              </span>
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                                {/* Check if question.year and question.semester are defined before indexing */}
                                {question.year && question.semester
                                  ? semesterOptions[question.year]?.find((s: { value: string; label: string }) => s.value === question.semester)?.label
                                  : ''}
                              </span>
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                                {/* Check if question.semester is defined before indexing */}
                                {question.semester
                                  ? semesterSubjects[question.semester]?.find((s: { value: string; label: string }) => s.value === question.subcategory)?.label || question.subcategory
                                  : question.subcategory}
                              </span>
                            </>
                          ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          {question.subcategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      )}
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base leading-relaxed">{question.question}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                      {question.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className={`${question.correctAnswer === option ? 'text-green-600 font-medium' : 'text-gray-600'} leading-relaxed`}>
                            {option}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(question)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-xs sm:text-sm"
                    >
                      <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Edit</span>
                      <span className="sm:hidden">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(question._id)}
                      disabled={deleteLoading === question._id}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-800 disabled:opacity-50 text-xs sm:text-sm"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">{deleteLoading === question._id ? 'Deleting...' : 'Delete'}</span>
                      <span className="sm:hidden">Del</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <EditQuestionModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingQuestion(null);
        }}
        question={editingQuestion}
        onSave={handleSaveEdit}
        loading={editLoading}
      />
    </div>
  );
};

export default ViewQuestions;