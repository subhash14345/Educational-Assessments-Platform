import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, Clock, Target, Calendar, Eye } from 'lucide-react';
import { TestResult } from '../../types';
import { apiService } from '../../services/api';

interface StudentSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  regNo: string;
  testName: string;
}

const StudentSubmissionModal: React.FC<StudentSubmissionModalProps> = ({
  isOpen,
  onClose,
  studentId,
  studentName,
  regNo,
  testName,
}) => {
  const [submission, setSubmission] = useState<TestResult | null>(null);
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'results' | 'login'>('results');

  useEffect(() => {
    if (isOpen && studentId) {
      loadStudentData();
    }
  }, [isOpen, studentId]);

  const loadStudentData = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Loading student data for ID:', studentId);
      
      // Load exam results
      const results = await apiService.getStudentResults(studentId);
      console.log('Exam results loaded:', results);
      setSubmission(results[0] || null);

      // Load login history
      const loginData = await apiService.getStudentLoginHistory(studentId);
      console.log('Login history loaded:', loginData);
      setLoginHistory(loginData);
    } catch (error) {
      console.error('Error loading student data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load student data';
      
      // Check for network errors or HTML responses
      if (errorMessage.includes('Unexpected token') || errorMessage.includes('<!DOCTYPE') || errorMessage.includes('Unexpected token <')) {
        setError('Network error: Unable to connect to server. Please check if the server is running on the correct URL.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (score: number, total: number) => {
    return ((score / total) * 100).toFixed(1);
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleRetry = () => {
    loadStudentData();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Student Details</h2>
            <p className="text-sm text-gray-600">{studentName} ({regNo})</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 ${activeTab === 'results' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            Exam Results
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`px-4 py-2 ${activeTab === 'login' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            Login History
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <span className="text-gray-600">Loading student data...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">{error}</div>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'results' && (
                <>
                  {submission ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-blue-600">{submission.score}</div>
                            <div className="text-sm text-gray-600">Score</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-700">{submission.totalQuestions}</div>
                            <div className="text-sm text-gray-600">Total Questions</div>
                          </div>
                          <div>
                            <div className={`text-2xl font-bold ${getGradeColor((submission.score / submission.totalQuestions) * 100)}`}>
                              {calculatePercentage(submission.score, submission.totalQuestions)}%
                            </div>
                            <div className="text-sm text-gray-600">Percentage</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-purple-600">
                              {Math.floor(submission.timeTaken / 60)}m {submission.timeTaken % 60}s
                            </div>
                            <div className="text-sm text-gray-600">Time Taken</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {submission.answers?.map((answer: any, index: number) => (
                          <div key={answer.questionId || index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">
                                Question {index + 1}
                              </span>
                              <div className="flex items-center">
                                {answer.isCorrect ? (
                                  <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-500 mr-1" />
                                )}
                                <span className={`font-medium ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                  {answer.isCorrect ? 'Correct' : 'Incorrect'}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium">Student's Answer: </span>
                                <span className={`${answer.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                  {answer.userAnswer}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Exam Results Found</h3>
                      <p className="text-gray-600">This student has not completed any tests yet.</p>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'login' && (
                <>
                  {loginHistory.length > 0 ? (
                    <div className="space-y-3">
                      {loginHistory.map((login, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                Login at: {new Date(login.loginTime).toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-600">
                                IP Address: {login.ipAddress}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-600">
                                {login.duration} minutes
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Login History</h3>
                      <p className="text-gray-600">No login records found for this student.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentSubmissionModal;
