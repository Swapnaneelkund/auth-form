import mongoose from 'mongoose';

const pendingUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  verificationToken: String,
  verificationTokenExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
}, { timestamps: true });

const PendingUser = mongoose.model('PendingUser', pendingUserSchema);

export default PendingUser;