import React from 'react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
}

interface AssignmentsProps {
  year: string;
  semester: string;
  subject: string;
  onYearSelect: (year: string) => void;
  onSemesterSelect: (semester: string) => void;
  onSubjectSelect: (subject: string) => void;
}

const yearOptions = [
  { value: '1st', label: '1ST YEAR' },
  { value: '2nd', label: '2ND YEAR' },
  { value: '3rd', label: '3RD YEAR' },
  { value: '4th', label: '4TH YEAR' },
];

const semesterOptions: Record<string, { value: string; label: string }[]> = {
  '1st': [
    { value: 'sem1', label: 'Semester 1' },
    { value: 'sem2', label: 'Semester 2' },
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

const semesterSubjects: Record<string, { value: string; label: string }[]> = {
  sem1: [
    { value: 'english', label: 'English' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'programming', label: 'Programming for Problem Solving' },
    { value: 'bee', label: 'Basic Electrical Engineering' },
    { value: 'workshop', label: 'Workshop/Manufacturing Practices' },
    { value: 'english-lab', label: 'English Lab' },
    { value: 'physics-lab', label: 'Physics Lab' },
    { value: 'chemistry-lab', label: 'Chemistry Lab' },
  ],
  sem2: [
    { value: 'english2', label: 'English-II' },
    { value: 'mathematics2', label: 'Mathematics-II' },
    { value: 'biology', label: 'Biology' },
    { value: 'environmental', label: 'Environmental Science' },
    { value: 'c-programming', label: 'C Programming' },
    { value: 'mechanics', label: 'Engineering Mechanics' },
    { value: 'graphics', label: 'Engineering Graphics' },
    { value: 'c-lab', label: 'C Programming Lab' },
    { value: 'mechanics-lab', label: 'Engineering Mechanics Lab' },
    { value: 'graphics-lab', label: 'Engineering Graphics Lab' },
  ],
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

const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Assignment 1',
    description: 'Complete exercises 1-10 from the textbook.',
    dueDate: '2024-07-15',
  },
  {
    id: '2',
    title: 'Assignment 2',
    description: 'Prepare a presentation on the given topic.',
    dueDate: '2024-07-30',
  },
];

const Assignments: React.FC<AssignmentsProps> = ({
  year,
  semester,
  subject,
  onYearSelect,
  onSemesterSelect,
  onSubjectSelect,
}) => {
  const semesters = year ? semesterOptions[year] || [] : [];
  const subjects = semester ? semesterSubjects[semester] || [] : [];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Assignments</h2>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block mb-1 font-semibold">Select Year</label>
          <select
            value={year}
            onChange={(e) => onYearSelect(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">-- Select Year --</option>
            {yearOptions.map((y) => (
              <option key={y.value} value={y.value}>
                {y.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Select Semester</label>
          <select
            value={semester}
            onChange={(e) => onSemesterSelect(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">-- Select Semester --</option>
            {semesters.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Select Subject</label>
          <select
            value={subject}
            onChange={(e) => onSubjectSelect(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">-- Select Subject --</option>
            {subjects.map((subj) => (
              <option key={subj.value} value={subj.value}>
                {subj.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        {subject ? (
          <div>
            <h3 className="text-xl font-semibold mb-2">Assignments for {subject.toUpperCase()}</h3>
            {mockAssignments.length === 0 ? (
              <p>No assignments available.</p>
            ) : (
              <ul className="space-y-4">
                {mockAssignments.map((assignment) => (
                  <li key={assignment.id} className="border border-gray-300 rounded-md p-4">
                    <h4 className="font-semibold text-lg">{assignment.title}</h4>
                    <p className="text-gray-700">{assignment.description}</p>
                    <p className="text-sm text-gray-500">Due Date: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p>Please select a subject to view assignments.</p>
        )}
      </div>
    </div>
  );
};

export default Assignments;
