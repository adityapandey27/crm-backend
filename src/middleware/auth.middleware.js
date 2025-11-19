const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.error('Authorization header missing', 401);
    const parts = authHeader.split(' ');
    if (parts.length !== 2) return res.error('Invalid auth header', 401);
    const token = parts[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    if (!user) return res.error('User not found', 401);
    req.user = { id: user._id, email: user.email, name: user.name };
    next();
  } catch (err) {
    return res.error('Unauthorized', 401);
  }
};
