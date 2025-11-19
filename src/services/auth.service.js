const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async ({ name, email, password }) => {
  if (!name || !email || !password) throw new Error('name, email and password are required');
  const exists = await User.findOne({ email });
  if (exists) throw new Error('User already exists');
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  return { id: user._id, name: user.name, email: user.email };
};

exports.login = async ({ email, password }) => {
  if (!email || !password) throw new Error('email and password required');
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error('Invalid credentials');
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  return { token, user: { id: user._id, name: user.name, email: user.email } };
};

exports.resetPassword = async ({ email, newPassword }) => {
  if (!email || !newPassword) throw new Error('email and newPassword required');
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return true;
};
