import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Clock, Target, TrendingUp, Eye } from 'lucide-react';
import { TestResult, Ranking } from '../../types'; //import types
import { apiService } from '../../services/api';
import TestResultModal from './TestResultModal';
import { useAuth } from '../../context/AuthContext';

const Results: React.FC = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<TestResult[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters state
  const [yearFilter, setYearFilter] = useState<string>('');
  const [branchFilter, setBranchFilter] = useState<string>('');
  const [sectionFilter, setSectionFilter] = useState<string>('');
  const [testNameFilter, setTestNameFilter] = useState<string>('');
  const totalQuestions = 30; // Assuming total questions is constant for all tests
  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch both results and rankings
        const [resultsData, rankingsData] = await Promise.all([
          apiService.getResults(),
          apiService.getRankings()
        ]);
        
        setResults(resultsData);
        setRankings(rankingsData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Get unique values for filters from rankings
  const uniqueYears = Array.from(new Set(rankings.map(r => r.year).filter(Boolean))) as string[];
  const uniqueBranches = Array.from(new Set(rankings.map(r => r.branch).filter(Boolean))) as string[];
  const uniqueSections = Array.from(new Set(rankings.map(r => r.section).filter(Boolean))) as string[];
  const uniqueTestNames = Array.from(new Set(rankings.map(r => r.testName).filter(Boolean))) as string[];

  // Filter rankings based on selected filters
  const filteredRankings = rankings.filter(r => {
    return (
      (yearFilter === '' || r.year === yearFilter) &&
      (branchFilter === '' || r.branch === branchFilter) &&
      (sectionFilter === '' || r.section === sectionFilter) &&
      (testNameFilter === '' || r.testName === testNameFilter)
    );
  });

  // Export filtered rankings to Excel
  const exportFilteredRankingsExcel = () => {
    const headers = ['Name', 'Reg. Number', 'Year', 'Branch', 'Section', 'Test Name', 'Score', 'Total Questions', 'Percentage'];
    const rows = filteredRankings.map(r => [
      r.name || '',
      r.regno || '',
      r.year || '',
      r.branch || '',
      r.section || '',
      r.testsCount || '',
      r.totalScore.toString(),
      r.totalQuestions.toString(),
      r.percentage.toFixed(2)
    ]);
    const csvContent =
      headers.join('\t') +
      '\n' +
      rows.map(row => row.join('\t')).join('\n');
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtered_rankings.xls';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export filtered rankings to PDF
  const printFilteredRankingsPDF = () => {
    const headers = ['Name', 'Reg. Number', 'Year', 'Branch', 'Section', 'Test Count', 'Score', 'Total Questions', 'Percentage'];
    const rows = filteredRankings.map(r => [
      r.name || '',
      r.regno || '',
      r.year || '',
      r.branch || '',
      r.section || '',
      r.testsCount || '',
      r.totalScore.toString(),
      r.totalQuestions.toString(),
      r.percentage.toFixed(2)
    ]);
    const style = `
      <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    `;
    const tableHeaders = headers.map(h => `<th>${h}</th>`).join('');
    const tableRows = rows
      .map(
        row =>
          '<tr>' +
          row.map(cell => `<td>${cell}</td>`).join('') +
          '</tr>'
      )
      .join('');
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Print Filtered Rankings</title>${style}</head>
          <body>
            <h1>Filtered Rankings</h1>
            <table>
              <thead><tr>${tableHeaders}</tr></thead>
              <tbody>${tableRows}</tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const handleViewDetails = (result: TestResult) => {
    setSelectedResult(result);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResult(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    if (percentage >= 40) return 'E';
    return 'F';
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Assessment Results</h2>
        <p className="text-sm sm:text-base text-gray-600 px-4">Your performance and rankings</p>
      </div>

      {/* Filter Controls */}
      {rankings.length > 0 && user?.role !== 'student' && (
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <select 
              value={yearFilter} 
              onChange={(e) => setYearFilter(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">All Years</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            
            <select 
              value={branchFilter} 
              onChange={(e) => setBranchFilter(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">All Branches</option>
              {uniqueBranches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
            
            <select 
              value={sectionFilter} 
              onChange={(e) => setSectionFilter(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">All Sections</option>
              {uniqueSections.map(section => (
                <option key={section} value={section}>{section}</option>
              ))}
            </select>
            
            <select 
              value={testNameFilter} 
              onChange={(e) => setTestNameFilter(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">All Tests</option>
              {uniqueTestNames.map(testName => (
                <option key={testName} value={testName}>{testName}</option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={exportFilteredRankingsExcel}
              className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Export Excel
            </button>
            <button 
              onClick={printFilteredRankingsPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Print PDF
            </button>
          </div>
        </div>
      )}

      {/* Test Results */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Test Results
        </h3>
        
        {results.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm sm:text-base px-4">No test results yet. Take a test to see your results here.</p>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result._id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 space-y-2 sm:space-y-0">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                      {result.category.charAt(0).toUpperCase() + result.category.slice(1)} - {result.subcategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h4>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(result.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right sm:text-center">
                    <div className={`text-2xl font-bold ${getGradeColor((result.score / totalQuestions) * 100)}`}>
                      {getGrade((result.score / totalQuestions) * 100)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {result.score}/{30}
                    </div>
                  </div>
                </div>
              
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-1 text-blue-500" />
                    <span>Score: {result.score}/{totalQuestions}</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                    <span>Percentage: {((result.score / totalQuestions) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-orange-500" />
                    <span>Time: {formatTime(result.timeTaken)}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-purple-500" />
                    <span>{new Date(result.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* View Details Button */}
                <div className="mt-3">
                  <button
                    onClick={() => handleViewDetails(result)}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs"
                  >
                    <Eye className="h-3 w-3" />
                    <span>View Questions & Answers</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rankings */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
          <Trophy className="h-5 w-5 mr-2" />
          Rankings ({filteredRankings.length} results)
        </h3>
        
        {rankings.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm sm:text-base px-4">No rankings available yet.</p>
        ) : filteredRankings.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm sm:text-base px-4">No results match the selected filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Rank</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Name</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell">Reg. No.</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Year</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Branch</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Section</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">Tests</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell">Score</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4">%</th>
                </tr>
              </thead>
              <tbody>
                {filteredRankings.map((ranking, index) => (
                  <tr key={ranking._id || index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium">
                      {index + 1}
                      {index === 0 && <Trophy className="h-3 w-3 sm:h-4 sm:w-4 inline ml-1 sm:ml-2 text-yellow-500" />}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 truncate max-w-24 sm:max-w-none">{ranking.name}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell">{ranking.regno}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">{ranking.year || '-'}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">{ranking.branch || '-'}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">{ranking.section || '-'}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">{ranking.testsCount}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell">{ranking.totalScore}/{totalQuestions * ranking.testsCount}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <span className={`font-medium ${getGradeColor(ranking.percentage)}`}>
                        {ranking.percentage .toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Test Result Modal */}
      <TestResultModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        result={selectedResult}
      />
    </div>
  );
};

export default Results;