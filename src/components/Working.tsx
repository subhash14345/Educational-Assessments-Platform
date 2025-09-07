import React from 'react';
import { Settings, Zap, Clock } from 'lucide-react';

const Working: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center">
          {/* Animated Gear Icon */}
          <div className="relative inline-block mb-8">
            <div className="animate-bounce rounded-full bg-blue-100 p-4">
              <Settings className="w-24 h-24 text-blue-600 mx-auto" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Site Under Construction
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-8">
            We're working hard to bring you something amazing!
          </p>

          {/* Animated Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-600 animate-pulse" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Fast Performance</h3>
              <p className="text-gray-600 text-sm">Lightning-fast loading times</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600 animate-bounce" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Coming Soon</h3>
              <p className="text-gray-600 text-sm">Estimated launch: Soon</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Settings className="w-6 h-6 text-green-600 animate-spin" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Under Development</h3>
              <p className="text-gray-600 text-sm">Building something great</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Development Progress</span>
              <span className="text-sm text-gray-500">85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style={{ width: '85%' }}></div>
            </div>
          </div>

          {/* Animated Dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>

          {/* Contact Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-2">Need to get in touch?</p>
            <a 
              href="https://www.indonalandatech.com/"
              target="_blank"
              rel="noopener noreferrer"  
              className="text-blue-600 hover:text-blue-800 underline transition-colors"
            >
              https://www.indonalandatech.com/
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Working;
