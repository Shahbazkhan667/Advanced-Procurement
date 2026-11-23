const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['admin', 'employee', 'department_manager', 'procurement_officer', 'finance_manager', 'director', 'vendor'];
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  password: { type: String, required: true, minlength: 12, select: false },
  phone: { type: String, trim: true, maxlength: 30 },
  role: { type: String, enum: ROLES, required: true, default: 'employee' },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },
  isActive: { type: Boolean, default: true },
  tokenVersion: { type: Number, default: 0, select: false },
  resetTokenHash: { type: String, select: false },
  resetTokenExpiresAt: { type: Date, select: false },
}, { timestamps: true, toJSON: { transform(_doc, ret) { delete ret.password; delete ret.tokenVersion; delete ret.resetTokenHash; delete ret.resetTokenExpiresAt; return ret; } } });

userSchema.pre('save', async function hashPassword() {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 12);
});
userSchema.methods.comparePassword = function comparePassword(candidate) { return bcrypt.compare(candidate, this.password); };
userSchema.index({ role: 1, isActive: 1 });
module.exports = mongoose.model('User', userSchema);
module.exports.ROLES = ROLES;
