const jwt = require('jsonwebtoken');
const config = require('config');

// const { JWT_SECRET_KEY } = config;

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');

  // Check for token
  if (!token)
    return res.status(401).json({ errors: { msg: 'No token, authorization denied' } });

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(400).json({ errors: { msg: 'Token is not valid' } });
  }
};