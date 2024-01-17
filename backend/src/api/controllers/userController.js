const User = require('../../models/user');
const logger = require('../../utils/logger'); // Assuming you have a logger utility
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        // Create token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({ token });
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate key error
            res.status(400).json({ message: 'User already exists with that email' });
        } else {
            res.status(500).json({ message: 'Error creating user' });
        }
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        logger.info('Users retrieved successfully');
        res.status(200).json(users);
    } catch (error) {
        logger.error('Error retrieving users', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            logger.warn(`User with id ${req.params.id} not found`);
            return res.status(404).json({ message: 'User not found' });
        }
        logger.info(`User with id ${req.params.id} retrieved successfully`);
        res.status(200).json(user);
    } catch (error) {
        logger.error(`Error retrieving user with id ${req.params.id}`, error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            logger.warn(`User with id ${req.params.id} not found for update`);
            return res.status(404).json({ message: 'User not found' });
        }
        logger.info(`User with id ${req.params.id} updated successfully`);
        res.status(200).json(updatedUser);
    } catch (error) {
        logger.error(`Error updating user with id ${req.params.id}`, error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            logger.warn(`User with id ${req.params.id} not found for deletion`);
            return res.status(404).json({ message: 'User not found' });
        }
        logger.info(`User with id ${req.params.id} deleted successfully`);
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        logger.error(`Error deleting user with id ${req.params.id}`, error);
        res.status(500).json({ error: error.message });
    }
};
