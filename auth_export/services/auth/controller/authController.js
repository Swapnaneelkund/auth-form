import { ApiError } from "../../../utils/ApiError.js";
import { apiResponce } from "../../../utils/ApiResponseHandler.js";
import asyncHandler from "../../../utils/AsyncHandler.js";
import User from '../models/User.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import PendingUser from '../models/pendingUser.js';


const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }
  const pendingUser = await PendingUser.findOne({ email });
  if (pendingUser) {
    await PendingUser.deleteOne({ _id: pendingUser._id });
  }
  const pending = await PendingUser.create({ name, email, password });

  let verificationToken;
  let exists = true;
  while (exists) {
    verificationToken = crypto.randomBytes(20).toString("hex");
    exists = await PendingUser.exists({ verificationToken: verificationToken });
  }
  const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
  pending.verificationToken = hashedToken;
  pending.verificationTokenExpires = new Date(Date.now() + 3600000);

  await pending.save({ validateBeforeSave: false });

  const verificationURL = `${process.env.URL}/api/auth/verify-email/${verificationToken}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: pending.email,
    subject: 'Email Verification',
    html: `
      <p>Please click on the following link to verify your email address:</p>
      <p><a href="${verificationURL}">${verificationURL}</a></p>
      <p>If you did not create this account, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
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
  
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 6 * 30 * 24 * 60 * 60 * 1000 
  });
  return res.status(200).json(
    new apiResponce(200,"User logged in successfully")
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

  let resetToken;
  let exists = true;

  while (exists) {
  resetToken = crypto.randomBytes(20).toString("hex");
  exists = await PendingUser.exists({ verificationToken: resetToken });
 }
  const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const pending= await PendingUser.create({
    email: user.email,
    verificationToken:hashedResetToken,
    verificationTokenExpires:new Date(Date.now() + 3600000)
  })


  // Create reset URL
  const resetURL = `${process.env.URL}/api/auth/reset-password/${resetToken}`; //`https://luxe-carry.vercel.app/reset-password/${resetToken}`

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

  const pending = await PendingUser.findOne({
    verificationToken: hashedToken,
    verificationTokenExpires: { $gt: new Date() },  });

  if (!pending) {
    throw new ApiError(400, "Email verification token is invalid or has expired");
  }

  const user = await User.create({
    name: pending.name,
    email: pending.email,
    password: pending.password,
    isVerified: true,
  });
  await PendingUser.deleteOne({ _id: pending._id });
  const token =user.generateAuthToken();
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 6 * 30 * 24 * 60 * 60 * 1000 
  });
  return res.redirect(`${process.env.frontURL}/home`);
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const pending=await PendingUser.findOne({
    
    verificationToken: hashedToken,
    verificationTokenExpires: { $gt: new Date() },
  })

  if (!pending) {
    throw new ApiError(400, "Password reset token is invalid or has expired");
  }
  const user=await User.findOnezzzzr.save({ validateBeforeSave: false });
  PendingUser.deleteOne({_id:pending._id})

  return res.redirect(`${process.env.frontURL}/`);

});

export {
  registerUser,
  loginUser,
  forgotPassword,
  verifyEmail,
  resetPassword
};