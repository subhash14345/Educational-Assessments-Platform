import mongoose from 'mongoose';

const loginLogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  regno: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  loginTime: { 
    type: Date, 
    default: Date.now 
  },
  ipAddress: { 
    type: String 
  },
  userAgent: { 
    type: String 
  },
  success: { 
    type: Boolean, 
    default: true 
  }
});

// Index for efficient querying
loginLogSchema.index({ userId: 1, loginTime: -1 });
loginLogSchema.index({ regno: 1, loginTime: -1 });

const LoginLog = mongoose.model('LoginLog', loginLogSchema);

export default LoginLog;
