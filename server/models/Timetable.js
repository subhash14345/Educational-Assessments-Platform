import mongoose from 'mongoose';

const timetableEntrySchema = new mongoose.Schema({
  day: { 
    type: String, 
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  timeSlot: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        // Validate time slot format like "09:00-10:00"
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Time slot must be in format "HH:MM-HH:MM"'
    }
  },
  subject: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  teacher: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  room: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 50
  },
  year: { 
    type: String, 
    required: true,
    enum: ['1st', '2nd', '3rd', '4th']
  },
  branch: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  section: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 10
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field before saving
timetableEntrySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create compound index for efficient querying
timetableEntrySchema.index({ year: 1, branch: 1, section: 1, day: 1, timeSlot: 1 });

const Timetable = mongoose.model('Timetable', timetableEntrySchema);

export default Timetable;
