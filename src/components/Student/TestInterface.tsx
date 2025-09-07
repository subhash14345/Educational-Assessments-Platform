import React, { useState, useEffect, useCallback } from 'react';
import { Clock, ChevronLeft, ChevronRight, Send, AlertCircle, Shield, Lock } from 'lucide-react';
import { Question } from '../../types';
import { apiService } from '../../services/api';

interface TestInterfaceProps {
  category: string;
  subcategory: string;
  onTestComplete: (result: any) => void;
  onBack: () => void;
}

const TestInterface: React.FC<TestInterfaceProps> = ({ 
  category, 
  subcategory, 
  onTestComplete,
  onBack 
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // const length=30;
  const handleSubmit = useCallback(async () => {
    const timeTaken = (30 * 60) - timeLeft;
    const testAnswers = questions.map(q => ({
      questionId: q._id,
      userAnswer: answers[q._id] || ''
    }));

    try {
      const result = await apiService.submitTest({
        category,
        subcategory,
        answers: testAnswers,
        timeTaken
      });
      onTestComplete(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit test');
    }
  }, [category, subcategory, answers, questions, timeLeft, onTestComplete]);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      handleSubmit();
    }
  }, [handleSubmit]);

  const handleFullscreenChange = useCallback(() => {
    const isCurrentlyFullscreen = !!document.fullscreenElement;
    setIsFullscreen(isCurrentlyFullscreen);
    
    if (!isCurrentlyFullscreen && questions.length > 0) {
      handleSubmit();
    }
  }, [handleSubmit, questions.length]);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const testQuestions = await apiService.getTestQuestions(category, subcategory);
        setQuestions(testQuestions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [category, subcategory]);

  useEffect(() => {
    if (questions.length > 0) {
      // Enter fullscreen
      document.documentElement.requestFullscreen();
      
      // Add event listeners for security
      document.addEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      
      // Copy protection event listeners
      const preventContextMenu = (e: Event) => e.preventDefault();
      const preventKeyDown = (e: KeyboardEvent) => {
        // Prevent common copy shortcuts
        if ((e.ctrlKey || e.metaKey) && ['c', 'x', 'a', 'p', 's', 'u'].includes(e.key.toLowerCase())) {
          e.preventDefault();
        }
        // Prevent F12 (DevTools)
        if (e.key === 'F12') {
          e.preventDefault();
        }
        // Prevent Ctrl+Shift+I (DevTools)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'i') {
          e.preventDefault();
        }
      };
      const preventDragStart = (e: DragEvent) => e.preventDefault();
      const preventSelectStart = (e: Event) => e.preventDefault();
      const preventCopy = (e: ClipboardEvent) => e.preventDefault();
      const preventCut = (e: ClipboardEvent) => e.preventDefault();
      const preventPaste = (e: ClipboardEvent) => e.preventDefault();
      
      // Add copy protection listeners
      document.addEventListener('contextmenu', preventContextMenu);
      document.addEventListener('keydown', preventKeyDown);
      document.addEventListener('dragstart', preventDragStart);
      document.addEventListener('selectstart', preventSelectStart);
      document.addEventListener('copy', preventCopy);
      document.addEventListener('cut', preventCut);
      document.addEventListener('paste', preventPaste);
      
      // Prevent print screen
      const preventPrint = () => {
        window.print = () => {};
        window.onbeforeprint = () => false;
      };
      preventPrint();
      
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('contextmenu', preventContextMenu);
        document.removeEventListener('keydown', preventKeyDown);
        document.removeEventListener('dragstart', preventDragStart);
        document.removeEventListener('selectstart', preventSelectStart);
        document.removeEventListener('copy', preventCopy);
        document.removeEventListener('cut', preventCut);
        document.removeEventListener('paste', preventPaste);
      };
    }
  }, [questions.length, handleVisibilityChange, handleFullscreenChange]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleSubmit();
    }
  }, [timeLeft, handleSubmit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const canSubmit = questions.every(q => answers[q._id]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Instructions
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="cursor:not-allowed fixed inset-0 bg-white flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-3 sm:p-4 flex items-center justify-between">
        <h1 className="text-sm sm:text-lg lg:text-xl font-semibold truncate mr-2">
          {category.charAt(0).toUpperCase() + category.slice(1)} - {subcategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </h1>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-lg font-mono">{formatTime(timeLeft)}</span>
          </div>
          <div className="text-xs sm:text-sm hidden sm:block">
            Question {currentQuestion + 1} of { questions.length}
          </div>
        </div>
      </div>

      {/* Question Progress */}
      <div className="cursor:not-allowed  bg-gray-100 p-2 sm:p-4">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-medium transition-colors flex-shrink-0 ${
                index === currentQuestion
                  ? 'bg-blue-600 text-white'
                  : answers[questions[index]._id]
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div className="cursor:not-allowed text-xs sm:text-sm text-gray-600 mt-2 sm:hidden">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      {/* Question Content */}
      <div className="cursor:not-allowed flex-1 p-3 sm:p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 leading-relaxed">{currentQ.question}</h2>
            
            <div className="space-y-2 sm:space-y-3">
              {currentQ.options.map((option, index) => (
                <label
                  key={index}
                  className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name={`question-${currentQ._id}`}
                    value={option}
                    checked={answers[currentQ._id] === option}
                    onChange={(e) => handleAnswerChange(currentQ._id, e.target.value)}
                    className="mt-1 text-blue-600"
                  />
                  <span className="text-sm sm:text-base text-gray-700 leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-100 p-3 sm:p-4">
        <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </button>

        <div className="flex space-x-2 sm:space-x-4">
          <button
            onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
            disabled={currentQuestion === questions.length - 1}
            className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
          >
            <Send className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Submit Test</span>
            <span className="sm:hidden">Submit</span>
          </button>
        </div>
        </div>
      </div>

      {!canSubmit && (
        <div className="bg-yellow-50 border-t border-yellow-200 p-2 sm:p-3">
          <div className="flex items-center space-x-2 text-yellow-800">
            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-sm">Please answer all questions before submitting</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestInterface;