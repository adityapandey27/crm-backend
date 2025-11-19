const authService = require('../services/auth.service');

exports.signup = async (req, res, next) => {
  try {
    const user = await authService.signup(req.body);
    res.success('User created', { user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const token = await authService.login(req.body);
    res.success('Login successful', { token });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.body);
    res.success('Password reset successful');
  } catch (err) {
    next(err);
  }
};
