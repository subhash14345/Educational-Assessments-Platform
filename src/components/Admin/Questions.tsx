import React, { useState } from 'react';
import { FileText, PlusCircle, Eye } from 'lucide-react';
import AddQuestions from './AddQuestions';
import ViewQuestions from './ViewQuestions';

// Consolidated constants (moved from both AddQuestions and ViewQuestions)
// Year options for courses
const yearOptions = [
  { value: '1st', label: '1ST YEAR' },
  { value: '2nd', label: '2ND YEAR' },
  { value: '3rd', label: '3RD YEAR' },
  { value: '4th', label: '4TH YEAR' },
];

// Semester options for each year
const semesterOptions: Record<string, { value: string; label: string }[]> = {
  '1st':[
    { value: 'sem1', label: 'Semester 1'},
    { value: 'sem2', label: 'Semester 2'},
  ],
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

const categories = [
  {
    value: 'coding',
    label: 'Coding',
    subcategories: [
      { value: 'c', label: 'C Programming' },
      { value: 'python', label: 'Python' },
      { value: 'java', label: 'Java' },
      { value: 'web-development', label: 'Web Development' },
    ],
  },
  {
    value: 'aptitude-reasoning',
    label: 'Aptitude & Reasoning',
    subcategories: [
      { value: 'numbers', label: 'Numbers' },
      { value: 'series', label: 'Series' },
      { value: 'sequence', label: 'Sequence' },
    ],
  },
  {
    value: 'english',
    label: 'English',
    subcategories: [
      { value: 'parts-of-speech', label: 'Parts of Speech' },
      { value: 'article', label: 'Article' },
      { value: 'preposition', label: 'Preposition' },
    ],
  },
  {
    value: 'courses',
    label: 'Courses',
  }
];

interface QuestionsProps {
  initialTab?: 'view' | 'add';
}

const Questions: React.FC<QuestionsProps> = ({ initialTab }) => {
  // Get initial tab from props or sessionStorage, default to 'view'
  const getInitialTab = (): 'view' | 'add' => {
    if (initialTab) return initialTab;
    
    const storedTab = sessionStorage.getItem('questionsSubTab');
    sessionStorage.removeItem('questionsSubTab'); // Clean up after reading
    
    if (storedTab === 'view' || storedTab === 'add') {
      return storedTab;
    }
    
    return 'view';
  };

  const [activeTab, setActiveTab] = useState<'view' | 'add'>(getInitialTab);

  const tabs = [
    {
      key: 'view',
      label: 'View Questions',
      icon: Eye,
      component: <ViewQuestions />
    },
    {
      key: 'add',
      label: 'Add Questions',
      icon: PlusCircle,
      component: <AddQuestions />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-200 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Questions Management
          </h3>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'view' | 'add')}
                className={`flex items-center space-x-2 px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {tabs.find(tab => tab.key === activeTab)?.component}
        </div>
      </div>
    </div>
  );
};

export default Questions;
