import express from 'express';
import jwt from 'jsonwebtoken';
import Timetable from '../models/Timetable.js';
import User from '../models/User.js';

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

const router = express.Router();

// Get all timetable entries (admin only)
router.get('/api/admin/timetable', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { year, branch, section, day } = req.query;
    let filter = {};

    if (year) filter.year = year;
    if (branch) filter.branch = branch;
    if (section) filter.section = section;
    if (day) filter.day = day;

    const timetableEntries = await Timetable.find(filter).sort({ 
      year: 1, 
      branch: 1, 
      section: 1, 
      day: 1, 
      timeSlot: 1 
    });

    res.json(timetableEntries);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).json({ error: 'Server error while fetching timetable' });
  }
});

// Get timetable for specific student (based on their year, branch, section)
router.get('/api/timetable', authenticateToken, async (req, res) => {
  try {
    // For students, get their profile to determine year, branch, section
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.year || !user.branch || !user.section) {
      return res.status(400).json({ error: 'Student profile incomplete. Please update your profile with year, branch, and section.' });
    }

    const { day } = req.query;
    let filter = {
      year: user.year,
      branch: user.branch,
      section: user.section
    };

    if (day) filter.day = day;

    const timetableEntries = await Timetable.find(filter).sort({ 
      day: 1, 
      timeSlot: 1 
    });

    res.json(timetableEntries);
  } catch (error) {
    console.error('Error fetching student timetable:', error);
    res.status(500).json({ error: 'Server error while fetching timetable' });
  }
});

// Create new timetable entry (admin only)
router.post('/api/admin/timetable', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { day, timeSlot, subject, teacher, room, year, branch, section } = req.body;

    // Validate required fields
    if (!day || !timeSlot || !subject || !teacher || !room || !year || !branch || !section) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check for overlapping time slots
    const existingEntry = await Timetable.findOne({
      year,
      branch,
      section,
      day,
      timeSlot
    });

    if (existingEntry) {
      return res.status(409).json({ error: 'Time slot already occupied for this class' });
    }

    const timetableEntry = new Timetable({
      day,
      timeSlot,
      subject,
      teacher,
      room,
      year,
      branch,
      section
    });

    await timetableEntry.save();

    res.status(201).json({ 
      message: 'Timetable entry created successfully', 
      entry: timetableEntry 
    });
  } catch (error) {
    console.error('Error creating timetable entry:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error while creating timetable entry' });
  }
});

// Update timetable entry (admin only)
router.put('/api/admin/timetable/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const { day, timeSlot, subject, teacher, room, year, branch, section } = req.body;

    // Validate required fields
    if (!day || !timeSlot || !subject || !teacher || !room || !year || !branch || !section) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check for overlapping time slots (excluding current entry)
    const existingEntry = await Timetable.findOne({
      _id: { $ne: id },
      year,
      branch,
      section,
      day,
      timeSlot
    });

    if (existingEntry) {
      return res.status(409).json({ error: 'Time slot already occupied for this class' });
    }

    const updatedEntry = await Timetable.findByIdAndUpdate(
      id,
      {
        day,
        timeSlot,
        subject,
        teacher,
        room,
        year,
        branch,
        section,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ error: 'Timetable entry not found' });
    }

    res.json({ 
      message: 'Timetable entry updated successfully', 
      entry: updatedEntry 
    });
  } catch (error) {
    console.error('Error updating timetable entry:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error while updating timetable entry' });
  }
});

// Delete timetable entry (admin only)
router.delete('/api/admin/timetable/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const deletedEntry = await Timetable.findByIdAndDelete(id);

    if (!deletedEntry) {
      return res.status(404).json({ error: 'Timetable entry not found' });
    }

    res.json({ message: 'Timetable entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting timetable entry:', error);
    res.status(500).json({ error: 'Server error while deleting timetable entry' });
  }
});

// Get available years, branches, sections for filtering
router.get('/api/admin/timetable/filters', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const years = await Timetable.distinct('year');
    const branches = await Timetable.distinct('branch');
    const sections = await Timetable.distinct('section');

    res.json({
      years: years.sort(),
      branches: branches.sort(),
      sections: sections.sort()
    });
  } catch (error) {
    console.error('Error fetching timetable filters:', error);
    res.status(500).json({ error: 'Server error while fetching filters' });
  }
});

export default router;
