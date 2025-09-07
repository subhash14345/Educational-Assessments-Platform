const API_BASE_URL = 'http://10.91.110.179:5000/api'; // 'http://10.136.23.179:5000/api' import.meta.env.VITE_API_URL || 'http://localhost:5000/api' || 'http://10.91.110.179:5000/api';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  private async handleResponse(response: Response) {
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      // Handle HTML error pages
      if (contentType && contentType.includes('text/html')) {
        const text = await response.text();
        throw new Error(`Server error: ${response.status} - HTML response received instead of JSON`);
      }
      
      // Try to parse JSON error
      try {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Request failed');
      } catch {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
    }
    
    return response.json();
  }

  // Auth
  async login(regno: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ regno, password }),
    });
    
    return this.handleResponse(response);
  }

  // Admin - Users
  async createUser(userData: { name: string; regno: string; password: string; year?: string; branch?: string; section?: string; phone?: string }, skipAuth: boolean = false) {
    const headers = skipAuth ? { 'Content-Type': 'application/json' } : this.getHeaders();
    const url = skipAuth ? `${API_BASE_URL}/register` : `${API_BASE_URL}/admin/users`;
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(userData),
    });
    
    return this.handleResponse(response);
  }

  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async deleteUser(userId: string) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  // Admin - Questions
  async uploadQuestions(formData: FormData) {
    const token = this.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/questions/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    return this.handleResponse(response);
  }

  async getQuestions() {
    const response = await fetch(`${API_BASE_URL}/admin/questions`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async deleteQuestion(questionId: string) {
    const response = await fetch(`${API_BASE_URL}/admin/questions/${questionId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async updateQuestion(questionId: string, questionData: any) {
    console.log('Updating question:', questionId);
    console.log('API URL:', `${API_BASE_URL}/admin/questions/${questionId}`);
    
    const response = await fetch(`${API_BASE_URL}/admin/questions/${questionId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(questionData),
    });
    
    return this.handleResponse(response);
  }

  // Student - Tests
  async getTestQuestions(category: string, subcategory: string) {
    const response = await fetch(`${API_BASE_URL}/questions/${category}/${subcategory}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async submitTest(testData: {
    category: string;
    subcategory: string;
    answers: { questionId: string; userAnswer: string }[];
    timeTaken: number;
  }) {
    const response = await fetch(`${API_BASE_URL}/test/submit`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(testData),
    });
    
    return this.handleResponse(response);
  }

  async getResults() {
    const response = await fetch(`${API_BASE_URL}/results`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  // get results to admin
  async getAllTestResults() {
    const response = await fetch(`${API_BASE_URL}/admin/results`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getStudentResults(studentId: string) {
    const response = await fetch(`${API_BASE_URL}/admin/results/${studentId}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getStudentLoginHistory(studentId: string) {
    const response = await fetch(`${API_BASE_URL}/admin/login-history/${studentId}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getRankings() {
    const response = await fetch(`${API_BASE_URL}/rankings`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  // Student - Profile
  async updateStudentProfile(userId: string, profileData: {
    name: string;
    year?: string;
    branch?: string;
    section?: string;
    phone?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/students/profile/${userId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(profileData),
    });
    
    return this.handleResponse(response);
  }

  async getStudentProfile(userId: string) {
    const response = await fetch(`${API_BASE_URL}/students/profile/${userId}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  // Timetable - Admin
  async getTimetableEntries(filters?: { year?: string; branch?: string; section?: string; day?: string }) {
    const params = new URLSearchParams();
    if (filters?.year) params.append('year', filters.year);
    if (filters?.branch) params.append('branch', filters.branch);
    if (filters?.section) params.append('section', filters.section);
    if (filters?.day) params.append('day', filters.day);

    const url = `${API_BASE_URL}/admin/timetable${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async createTimetableEntry(entryData: {
    day: string;
    timeSlot: string;
    subject: string;
    teacher: string;
    room: string;
    year: string;
    branch: string;
    section: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/admin/timetable`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(entryData),
    });
    
    return this.handleResponse(response);
  }

  async updateTimetableEntry(entryId: string, entryData: {
    day: string;
    timeSlot: string;
    subject: string;
    teacher: string;
    room: string;
    year: string;
    branch: string;
    section: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/admin/timetable/${entryId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(entryData),
    });
    
    return this.handleResponse(response);
  }

  async deleteTimetableEntry(entryId: string) {
    const response = await fetch(`${API_BASE_URL}/admin/timetable/${entryId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getTimetableFilters() {
    const response = await fetch(`${API_BASE_URL}/admin/timetable/filters`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  // Timetable - Student
  async getStudentTimetable(day?: string) {
    const url = day ? `${API_BASE_URL}/timetable?day=${day}` : `${API_BASE_URL}/timetable`;
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();
