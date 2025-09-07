import React from 'react';
import { Clock, Monitor, AlertTriangle, CheckCircle } from 'lucide-react';

interface TestInstructionsProps {
  category: string;
  subcategory: string;
  onStartTest: () => void;
  onBack: () => void;
}

const TestInstructions: React.FC<TestInstructionsProps> = ({ 
  category, 
  subcategory, 
  onStartTest, 
  onBack 
}) => {
  const instructions = [
    {
      icon: Clock,
      title: 'Time Limit',
      description: 'You have 15 minutes to complete the test. The timer will start automatically.',
    },
    {
      icon: Monitor,
      title: 'Full Screen Mode',
      description: 'The test will run in full screen mode. Switching tabs will automatically submit your test.',
    },
    {
      icon: AlertTriangle,
      title: 'Answer All Questions',
      description: 'You must answer all questions before submitting. You can navigate between questions.',
    },
    {
      icon: CheckCircle,
      title: 'Submit Test',
      description: 'You can submit early if you finish before time, or it will auto-submit when time expires.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Test Instructions</h2>
          <p className="text-lg sm:text-xl text-gray-600 px-2">
            {category.charAt(0).toUpperCase() + category.slice(1)} - {subcategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {instructions.map((instruction, index) => (
            <div key={index} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <instruction.icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mt-0.5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{instruction.title}</h3>
                <p className="text-sm text-gray-600">{instruction.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1 text-sm sm:text-base">Important Notice</h3>
              <p className="text-sm text-yellow-700">
                Once you start the test, you cannot pause it. Make sure you have a stable internet connection 
                and are in a quiet environment. The test will automatically submit if you switch tabs or lose focus.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            Back to Categories
          </button>
          <button
            onClick={onStartTest}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-base"
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestInstructions;