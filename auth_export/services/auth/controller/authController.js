import { ApiError } from "../../../utils/ApiError.js";
import { apiResponce } from "../../../utils/ApiResponseHandler.js";
import asyncHandler from "../../../utils/AsyncHandler.js";
import User from '../models/User.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate verification token
  const verificationToken = crypto.randomBytes(20).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
  user.verificationToken = hashedToken;
  user.verificationTokenExpires = Date.now() + 3600000; // 1 hour

  // Debug log: print tokens
  console.log('Verification token (raw):', verificationToken);
  console.log('Verification token (hashed):', hashedToken);

  await user.save({ validateBeforeSave: false });

  // Send verification email
  const verificationURL = `http://localhost:8000/api/auth/verify-email/${verificationToken}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Email Verification',
    html: `
      <p>Please click on the following link to verify your email address:</p>
      <p><a href="${verificationURL}">${verificationURL}</a></p>
      <p>If you did not create this account, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json(
    new apiResponce(200,"User registered successfully. Please check your email for verification.")
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "Invalid email or password");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email address to log in.");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = user.generateAuthToken();

  const loggedInUser = await User.findById(user._id).select("-password");

  return res.status(200).json(
    new apiResponce(200, { user: loggedInUser, token }, "User logged in successfully")
  );
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User with this email does not exist");
  }

  // Generate a reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetToken = hashedResetToken;
  user.passwordResetExpires = Date.now() + 3600000; // 1 hour

  // Debug log: print tokens
  console.log('Reset token (raw):', resetToken);
  console.log('Reset token (hashed):', hashedResetToken);

  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetURL = `http://localhost:8000/api/auth/reset-password/${resetToken}`;

  // Send email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Password Reset Request',
    html: `
      <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
      <p>Please click on the following link, or paste this into your browser to complete the process:</p>
      <p><a href="${resetURL}">${resetURL}</a></p>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    `,
  };

  await transporter.sendMail(mailOptions);

  return res.status(200).json(
    new apiResponce(200, {}, "Password reset link sent to your email")
  );
});

const verifyEmail = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Email verification token is invalid or has expired");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new apiResponce(200, {}, "Email verified successfully!")
  );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Password reset token is invalid or has expired");
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new apiResponce(200, {}, "Password has been reset")
  );
});

export {
  registerUser,
  loginUser,
  forgotPassword,
  verifyEmail,
  resetPassword
};