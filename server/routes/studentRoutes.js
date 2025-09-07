import express from 'express';
import jwt from 'jsonwebtoken';
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

// Update student profile
router.put('/api/students/profile/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, year, branch, section, phone } = req.body;

    // Validate input
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters' });
    }

    // Check if user is updating their own profile or is admin
    if (req.user.userId !== id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to update this profile' });
    }

    // Find user and update
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    user.name = name.trim();
    user.year = year?.trim() || '';
    user.branch = branch?.trim() || '';
    user.section = section?.trim() || '';
    user.phone = phone?.trim() || '';

    await user.save();

    // Return updated user without password
    const updatedUser = {
      id: user._id,
      name: user.name,
      regno: user.regno,
      role: user.role,
      year: user.year,
      branch: user.branch,
      section: user.section,
      phone: user.phone
    };

    res.json({ user: updatedUser, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Server error while updating profile' });
  }
});

// Get student profile
router.get('/api/students/profile/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check authorization
    if (req.user.userId !== id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to view this profile' });
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Server error while fetching profile' });
  }
});

export default router;
