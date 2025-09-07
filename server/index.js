import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI);

// Question Schema
const questionSchema = new mongoose.Schema({
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Test Result Schema
const testResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  timeTaken: { type: Number, required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    userAnswer: String,
    isCorrect: Boolean
  }],
  submittedAt: { type: Date, default: Date.now }
});

import User from './models/User.js';
import LoginLog from './models/LoginLog.js';
const Question = mongoose.model('Question', questionSchema);
const TestResult = mongoose.model('TestResult', testResultSchema);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Check file extension
    if (path.extname(file.originalname).toLowerCase() !== '.xlsx') {
      return cb(new Error('Only .xlsx files are allowed'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

import studentRoutes from './routes/studentRoutes.js';
import timetableRoutes from './routes/timetableRoutes.js';

// Routes

app.use(studentRoutes);
app.use(timetableRoutes);

app.post('/api/register', async (req, res) => {
  try {
    const { name, regno, password, year, branch, section, phone } = req.body;

    if (!name || !regno || !password) {
      return res.status(400).json({ error: 'Name, registration number, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ regno });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this registration number already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with role 'student'
    const newUser = new User({
      name,
      regno,
      password: hashedPassword,
      year,
      branch,
      section,
      phone,
      role: 'student',
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { regno, password } = req.body;
    
    const user = await User.findOne({ regno });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        regno: user.regno,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin routes
app.post('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { name, regno, password, role, year, branch, section, phone } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      name,
      regno,
      password: hashedPassword,
      role: role || 'student',
      year,
      branch,
      section,
      phone
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Registration number already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/admin/users/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/questions/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { category, subcategory } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check if file exists
    if (!fs.existsSync(req.file.path)) {
      return res.status(400).json({ error: 'Uploaded file not found' });
    }
    let workbook;
    try {
      workbook = XLSX.readFile(req.file.path);
    } catch (error) {
      // Clean up the uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Invalid Excel file format' });
    }
    
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Validate data structure
    if (!data || data.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Excel file is empty or invalid' });
    }

    // Validate required columns
    const requiredColumns = ['question', 'option1', 'option2', 'option3', 'option4', 'correctAnswer'];
    const firstRow = data[0];
    const missingColumns = requiredColumns.filter(col => !(col in firstRow));
    
    if (missingColumns.length > 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        error: `Missing required columns: ${missingColumns.join(', ')}` 
      });
    }
    const questions = data.map((row, index) => {
      // Validate each row
      if (!row.question || !row.option1 || !row.option2 || !row.option3 || !row.option4 || !row.correctAnswer) {
        throw new Error(`Row ${index + 2} has missing data`);
      }
      
      return {
        category,
        subcategory,
        question: row.question.toString().trim(),
        options: [
          row.option1.toString().trim(),
          row.option2.toString().trim(),
          row.option3.toString().trim(),
          row.option4.toString().trim()
        ],
        correctAnswer: row.correctAnswer.toString().trim()
      };
    });

    try {
      await Question.insertMany(questions);
    } catch (dbError) {
      fs.unlinkSync(req.file.path);
      return res.status(500).json({ error: 'Failed to save questions to database' });
    }

    // Clean up the uploaded file after successful processing
    fs.unlinkSync(req.file.path);
    
    res.json({ message: 'Questions uploaded successfully' });
  } catch (error) {
    // Clean up file in case of any error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/admin/questions', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/admin/questions/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/questions/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const { question, options, correctAnswer, category, subcategory, year, semester } = req.body;

    // Validate required fields
    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'Question and at least 2 options are required' });
    }

    if (!correctAnswer) {
      return res.status(400).json({ error: 'Correct answer is required' });
    }

    if (!category || !subcategory) {
      return res.status(400).json({ error: 'Category and subcategory are required' });
    }

    // Validate that correct answer is one of the options
    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ error: 'Correct answer must be one of the options' });
    }

    // Find and update the question
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      {
        question,
        options,
        correctAnswer,
        category,
        subcategory,
        year,
        semester
      },
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Server error while updating question' });
  }
});

// Admin - Get all test results
app.get('/api/admin/results', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const results = await TestResult.find()
      .populate('userId', 'name regno year branch section')
      .sort({ submittedAt: -1 });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Student routes
app.get('/api/questions/:category/:subcategory', authenticateToken, async (req, res) => {
  try {
    const { category, subcategory } = req.params;
    
    const questions = await Question.find({ category, subcategory })
      .select('-correctAnswer')
      .limit(30);
    
    // Shuffle the questions array to randomize order
    const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    
    // Also shuffle the options within each question
    const randomizedQuestions = shuffledQuestions.map(question => {
      const questionObj = question.toObject();
      
      // Create array of options with their original indices
      const optionsWithIndex = questionObj.options.map((option, index) => ({
        option,
        originalIndex: index
      }));
      
      // Shuffle the options
      const shuffledOptions = optionsWithIndex.sort(() => Math.random() - 0.5);
      
      // Update the question with shuffled options
      questionObj.options = shuffledOptions.map(item => item.option);
      
      return questionObj;
    });
    
    res.json(randomizedQuestions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/test/submit', authenticateToken, async (req, res) => {
  try {
    const { category, subcategory, answers, timeTaken } = req.body;
    
    const questions = await Question.find({ category, subcategory });
    
    let score = 0;
    const resultAnswers = answers.map(answer => {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      const isCorrect = question && question.correctAnswer === answer.userAnswer;
      if (isCorrect) score++;
      
      return {
        questionId: answer.questionId,
        userAnswer: answer.userAnswer,
        isCorrect
      };
    });

    const testResult = new TestResult({
      userId: req.user.userId,
      category,
      subcategory,
      score,
      totalQuestions: questions.length,
      timeTaken,
      answers: resultAnswers
    });

    await testResult.save();
    
    res.json({
      score,
      totalQuestions: questions.length,
      percentage: (score / questions.length) * 100
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/results', authenticateToken, async (req, res) => {
  try {
    const results = await TestResult.find({ userId: req.user.userId })
      .sort({ submittedAt: -1 });

    // Populate question details for each result
    const resultsWithQuestions = await Promise.all(
      results.map(async (result) => {
        const answersWithQuestions = await Promise.all(
          result.answers.map(async (answer) => {
            const question = await Question.findById(answer.questionId);
            return {
              questionId: answer.questionId,
              question: question ? question.question : 'Question not found',
              options: question ? question.options : [],
              correctAnswer: question ? question.correctAnswer : '',
              userAnswer: answer.userAnswer,
              isCorrect: answer.isCorrect
            };
          })
        );

        return {
          _id: result._id,
          userId: result.userId,
          category: result.category,
          subcategory: result.subcategory,
          score: result.score,
          totalQuestions: result.totalQuestions,
          timeTaken: result.timeTaken,
          submittedAt: result.submittedAt,
          answers: answersWithQuestions
        };
      })
    );
    
    res.json(resultsWithQuestions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/rankings', authenticateToken, async (req, res) => {
  try {
    const rankings = await TestResult.aggregate([
      {
        $group: {
          _id: '$userId',
          totalScore: { $sum: '$score' },
          totalQuestions: { $sum: '$totalQuestions' },
          testsCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          name: '$user.name',
          regno: '$user.regno',
          year: '$user.year',
          branch: '$user.branch',
          section: '$user.section',
          totalScore: 1,
          totalQuestions: 1,
          testsCount: 1,
          percentage: { $multiply: [{ $divide: ['$totalScore', '$totalQuestions'] }, 100] }
        }
      },
      {
        $sort: { percentage: -1 }
      }
    ]);

    res.json(rankings);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin routes for viewing student submissions
app.get('/api/admin/results/:studentId', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { studentId } = req.params;
    
    // Validate student ID
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: 'Invalid student ID format' });
    }

    // Check if student exists
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Fetch all test results for this student
    const results = await TestResult.find({ userId: studentId })
      .populate('userId', 'name regno year branch section')
      .sort({ submittedAt: -1 });

    // Format the response - return empty array if no results
    const formattedResults = results.map(result => ({
      id: result._id,
      student: {
        id: result.userId._id,
        name: result.userId.name,
        regno: result.userId.regno,
        year: result.userId.year,
        branch: result.userId.branch,
        section: result.userId.section
      },
      category: result.category,
      subcategory: result.subcategory,
      score: result.score,
      totalQuestions: result.totalQuestions,
      percentage: ((result.score / result.totalQuestions) * 100).toFixed(1),
      timeTaken: result.timeTaken,
      submittedAt: result.submittedAt,
      answers: result.answers.map(answer => ({
        questionId: answer.questionId,
        userAnswer: answer.userAnswer,
        isCorrect: answer.isCorrect
      }))
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error('Error fetching student submissions:', error);
    res.status(500).json({ error: 'Server error while fetching student submissions' });
  }
});

// Admin route for viewing student login history
app.get('/api/admin/login-history/:studentId', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { studentId } = req.params;
    
    // Validate student ID
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: 'Invalid student ID format' });
    }

    // Check if student exists
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Fetch login history for this student
    const loginHistory = await LoginLog.find({ userId: studentId })
      .sort({ loginTime: -1 });

    // Format the response
    const formattedLoginHistory = loginHistory.map(login => ({
      id: login._id,
      name: login.name,
      regno: login.regno,
      loginTime: login.loginTime,
      ipAddress: login.ipAddress,
      userAgent: login.userAgent,
      success: login.success
    }));

    res.json(formattedLoginHistory);
  } catch (error) {
    console.error('Error fetching student login history:', error);
    res.status(500).json({ error: 'Server error while fetching student login history' });
  }
});

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        name: 'Admin',
        regno: 'admin',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      // console.log('Default admin created: admin/admin123');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  createDefaultAdmin();
});
