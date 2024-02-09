const User = require('../../models/user');
const Item = require('../../models/item'); // Ensure this path is correct

const logger = require('../../utils/logger'); // Assuming you have a logger utility
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
JWT_SECRET = '81c83db1bd37c6095b706d240a294e73cfb112fc6faa314d7133cd04a2f96e8b3b77e1444b68b3d179c29edcc6ff4affc6de2eb8581145c11ea38514db3933bd'

exports.createUser = async (req, res) => {
    try {
        // Include category in the destructuring assignment
        const { username, email, password, category } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with category
        const user = new User({
            username,
            email,
            password: hashedPassword,
            category // Add the category field here
        });

        await user.save();

        // Create token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({ token });
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate key error
            res.status(400).json({ message: 'User already exists with that email' });
        } else {
            res.status(500).json({ message: 'Error creating user', error });
        }
    }
};

exports.loginUser = async (req, res) => {
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
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
};

exports.changeUserPassword = async (req, res) => {
    // const { userId } = req.params; // or req.user.id if you're using authentication middleware
    const { currentPassword, newPassword , userId} = req.body;
    console.log("Changing password for user ID:", userId);

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current and new passwords are required.' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        logger.error(`Error updating password for user with id ${userId}:`, error);
        res.status(500).json({ message: 'Error updating password', error });
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

exports.getUserItems = async (req, res) => {
    try {
        const userId = req.params.id;

        // Find all items where the 'providedBy' field matches the user's ID
        const items = await Item.find({ providedBy: userId });

        if (!items || items.length === 0) {
            logger.warn(`No items found for user with id ${userId}`);
            return res.status(404).json({ message: 'No items found' });
        }

        logger.info(`Items for user with id ${userId} retrieved successfully`);
        res.status(200).json(items);
    } catch (error) {
        logger.error(`Error retrieving items for user with id ${req.params.id}`, error);
        res.status(500).json({ error: error.message });
    }
};
exports.getUserProfileInfo = async (req, res) => {
    try {
        const userId = req.params.id;
        // Assuming 'providedItems' is the correct field name that should reference user's items.
        // Ensure this field exists in your User schema and is correctly set up to reference the Item model.
        const user = await User.findById(userId).populate('providedItems'); // Use 'populate' to fetch related items
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If user is found but no items are populated, log the user object to check if providedItems exists and is populated
        console.log(`User with id ${userId} found: `, user);

        // Simplify the items for the response
        const items = user.providedItems.map(item => ({
            name: item.name,
            id: item._id
            // Add other relevant item fields here
        }));

        const profileInfo = {
            username: user.username,
            score: user.score,
            category: user.category,
            items: items
        };

        // Log what is being sent back to the client
        console.log(`Sending profile info for user ${userId}: `, profileInfo);

        res.json(profileInfo);
    } catch (error) {
        console.error(`Error retrieving user profile info for user ${req.params.id}: `, error);
        res.status(500).json({ message: 'Error retrieving user profile info', error });
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
