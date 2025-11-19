exports.success = (res, message, data = {}) => {
  res.status(200).json({ success: true, message, data });
};

exports.error = (res, message, status = 400, data = {}) => {
  res.status(status).json({ success: false, message, data });
};
