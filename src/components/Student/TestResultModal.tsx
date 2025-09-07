import React from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { TestResult } from '../../types';

interface TestResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: TestResult | null;
}

const TestResultModal: React.FC<TestResultModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  if (!isOpen || !result) return null;

  const calculatePercentage = (score: number, total: number) => {
    return ((score / total) * 100).toFixed(1);
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Test Results Details</h2>
            <p className="text-sm text-gray-600">
              {result.category.charAt(0).toUpperCase() + result.category.slice(1)} - 
              {result.subcategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Summary Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{result.score}</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-700">{result.totalQuestions}</div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${getGradeColor((result.score / result.totalQuestions) * 100)}`}>
                  {calculatePercentage(result.score, result.totalQuestions)}%
                </div>
                <div className="text-sm text-gray-600">Percentage</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatTime(result.timeTaken)}
                </div>
                <div className="text-sm text-gray-600">Time Taken</div>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions & Answers</h3>
            
            {result.answers?.map((answer, index) => (
              <div key={answer.questionId || index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
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

                <div className="space-y-3">
                  {/* Question */}
                  <div>
                    <span className="font-medium text-gray-900">Question: </span>
                    <span className="text-gray-700">{answer.question}</span>
                  </div>

                  {/* Options */}
                  <div>
                    <span className="font-medium text-gray-900">Options: </span>
                    <div className="mt-1 space-y-1">
                      {answer.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`pl-3 border-l-2 ${
                            option === answer.correctAnswer
                              ? 'border-green-500 bg-green-50'
                              : option === answer.userAnswer && !answer.isCorrect
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-300'
                          }`}
                        >
                          <span className="text-gray-700">
                            {String.fromCharCode(65 + optIndex)}. {option}
                            {option === answer.correctAnswer && (
                              <span className="ml-2 text-green-600 text-sm">✓ Correct</span>
                            )}
                            {option === answer.userAnswer && !answer.isCorrect && (
                              <span className="ml-2 text-red-600 text-sm">✗ Your Answer</span>
                            )}
                            {option === answer.userAnswer && answer.isCorrect && (
                              <span className="ml-2 text-green-600 text-sm">✓ Your Answer</span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Student's Answer */}
                  <div>
                    <span className="font-medium text-gray-900">Your Answer: </span>
                    <span className={`${answer.isCorrect ? 'text-green-700' : 'text-red-700'} font-medium`}>
                      {answer.userAnswer || 'Not answered'}
                    </span>
                  </div>

                  {/* Correct Answer */}
                  {!answer.isCorrect && (
                    <div>
                      <span className="font-medium text-gray-900">Correct Answer: </span>
                      <span className="text-green-700 font-medium">{answer.correctAnswer}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResultModal;
