const crypto = require('node:crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const issueToken = (user) => jwt.sign({ sub: user.id, role: user.role, ver: user.tokenVersion }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m', algorithm: 'HS256' });
const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone || null, department: user.department || null, isActive: user.isActive, createdAt: user.createdAt, updatedAt: user.updatedAt });

exports.login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.validated.body.email }).select('+password +tokenVersion');
  const valid = user && await user.comparePassword(req.validated.body.password);
  if (!valid || !user.isActive) return res.status(401).json({ success: false, message: 'Invalid email or password' });
  return res.json({ success: true, message: 'Login successful', data: { accessToken: issueToken(user), tokenType: 'Bearer', expiresIn: process.env.JWT_EXPIRES_IN || '15m', user: publicUser(user) } });
});
exports.me = asyncHandler(async (req, res) => res.json({ success: true, message: 'Current user', data: { user: publicUser(req.user) } }));
exports.logout = asyncHandler(async (req, res) => {
  await User.updateOne({ _id: req.user.id }, { $inc: { tokenVersion: 1 } });
  res.json({ success: true, message: 'Logged out successfully', data: null });
});
exports.changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('+password +tokenVersion');
  if (!(await user.comparePassword(req.validated.body.currentPassword))) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  user.password = req.validated.body.newPassword;
  user.tokenVersion += 1;
  await user.save();
  res.json({ success: true, message: 'Password changed. Please sign in again.', data: null });
});
exports.forgotPassword = asyncHandler(async (req, res) => {
  const email = req.validated.body.email;
  const user = await User.findOne({ email, isActive: true });
  if (user && process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const raw = crypto.randomBytes(32).toString('hex');
    user.resetTokenHash = crypto.createHash('sha256').update(raw).digest('hex');
    user.resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_SECURE === 'true', auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
    const base = process.env.FRONTEND_URL;
    await transporter.sendMail({ from: process.env.SMTP_FROM, to: user.email, subject: 'ProCureX password reset', text: `Use this one-time token in your password reset request: ${raw}\nIt expires in 15 minutes. Frontend: ${base}` });
  }
  res.json({ success: true, message: 'If an eligible account exists, password reset instructions will be sent.', data: null });
});
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.validated.body;
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({ resetTokenHash: hash, resetTokenExpiresAt: { $gt: new Date() }, isActive: true }).select('+resetTokenHash +resetTokenExpiresAt +tokenVersion');
  if (!user) return res.status(400).json({ success: false, message: 'Reset token is invalid or expired' });
  user.password = newPassword;
  user.resetTokenHash = undefined;
  user.resetTokenExpiresAt = undefined;
  user.tokenVersion += 1;
  await user.save();
  res.json({ success: true, message: 'Password reset successfully. Please sign in.', data: null });
});
