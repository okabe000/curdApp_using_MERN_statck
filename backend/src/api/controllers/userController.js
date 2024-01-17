const User = require('../../models/user');
const logger = require('../../utils/logger'); // Assuming you have a logger utility
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.createUser = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({...req.body, password: hashedPassword});
        const savedUser = await newUser.save();

        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        logger.info('User created successfully', { id: savedUser._id, email: savedUser.email });
        res.status(201).json({ user: savedUser, token });
    } catch (error) {
        logger.error('Error creating user', error);
        res.status(400).json({ error: error.message });
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
