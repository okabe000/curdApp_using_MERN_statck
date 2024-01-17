
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/user'); // Assuming a user model is already defined
const logger = require('./logger'); // Winston logger setup

// User registration
async function registerUser(email, password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    logger.info('User registered successfully', { email });
  } catch (error) {
    logger.error('Error registering user', { error: error.message, email });
    throw error;
  }
}

// User authentication
async function authenticateUser(email, password) {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    logger.info('User authenticated successfully', { email });

    return token;
  } catch (error) {
    logger.error('Error authenticating user', { error: error.message, email });
    throw error;
  }
}

// Middleware for authorization
function authorize(req, res, next) {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Authorization error', { error: error.message });
    res.status(401).send('Unauthorized');
  }
}
