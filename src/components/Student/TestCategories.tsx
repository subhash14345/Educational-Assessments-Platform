import React, { useState } from 'react';
import { Code, Brain, BookOpen } from 'lucide-react';

interface TestCategoriesProps {
  onCategorySelect: (category: string, subcategory: string) => void;
  categories?: {
    value: string;
    label: string;
    subcategories?: { value: string; label: string }[];
  }[];
  semesterSubjects: Record<string, { value: string; label: string }[]>;
  semesterOptions: Record<string, { value: string; label: string }[]>;
  yearOptions: { value: string; label: string }[];
}

const TestCategories: React.FC<TestCategoriesProps> = ({ onCategorySelect, categories, semesterSubjects, semesterOptions, yearOptions }) => {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
    setSelectedSemester('');
  };

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemester(e.target.value);
  };

  const renderSubcategories = (subcategories: { value: string; label: string }[]) => (
    <div className="space-y-2">
      {subcategories.map((subcategory) => (
        <button
          key={subcategory.value}
          onClick={() => onCategorySelect('courses', subcategory.value)}
          className="w-full text-left p-2 sm:p-3 rounded-md border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm sm:text-base"
        >
          {subcategory.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Choose Your Test</h2>
        <p className="text-sm sm:text-base text-gray-600 px-4">Select a category and subcategory to begin your assessment</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {categories && categories.length > 0 ? (
          categories.map((category) => {
            if (category.value === 'courses') {
              return (
                <div key={category.value} className="bg-white rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="bg-yellow-500 text-white p-3 sm:p-4 rounded-lg mb-4 flex items-center justify-center">
                    {/* You can add an icon here if desired */}
                    <span className="text-lg font-bold">📚</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center sm:text-left">{category.label}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1 font-semibold">Select Year</label>
                      <select
                        value={selectedYear}
                        onChange={handleYearChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="">-- Select Year --</option>
                        {yearOptions.map((year) => (
                          <option key={year.value} value={year.value}>
                            {year.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 font-semibold">Select Semester</label>
                      <select
                        value={selectedSemester}
                        onChange={handleSemesterChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                        disabled={!selectedYear}
                      >
                        <option value="">-- Select Semester --</option>
                        {selectedYear && semesterOptions[selectedYear]
                          ? semesterOptions[selectedYear].map((sem) => (
                              <option key={sem.value} value={sem.value}>
                                {sem.label}
                              </option>
                            ))
                          : null}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 font-semibold">Select Subject</label>
                      {selectedSemester ? (
                        renderSubcategories(semesterSubjects[selectedSemester] || [])
                      ) : (
                        <p className="text-gray-500">Please select a semester</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={category.value} className="bg-white rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className={`${category.value === 'coding' ? 'bg-blue-500' : category.value === 'aptitude-reasoning' ? 'bg-green-500' : 'bg-purple-500'} text-white p-3 sm:p-4 rounded-lg mb-4 flex items-center justify-center`}>
                    {category.value === 'coding' && <Code className="h-6 w-6 sm:h-8 sm:w-8" />}
                    {category.value === 'aptitude-reasoning' && <Brain className="h-6 w-6 sm:h-8 sm:w-8" />}
                    {category.value === 'english' && <BookOpen className="h-6 w-6 sm:h-8 sm:w-8" />}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center sm:text-left">{category.label}</h3>
                  <div className="space-y-2">
                    {category.subcategories && category.subcategories.length > 0 ? (
                      category.subcategories.map((subcategory) => (
                        <button
                          key={subcategory.value}
                          onClick={() => onCategorySelect(category.value, subcategory.value)}
                          className="w-full text-left p-2 sm:p-3 rounded-md border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm sm:text-base"
                        >
                          {subcategory.label}
                        </button>
                      ))
                    ) : (
                      <p>No subcategories available.</p>
                    )}
                  </div>
                </div>
              );
            }
          })
        ) : (
          <p>No categories available.</p>
        )}
      </div>
    </div>
  );
};

export default TestCategories;
