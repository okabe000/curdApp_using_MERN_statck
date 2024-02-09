const Item = require('../../models/item');
const logger = require('../../utils/logger'); // Ensure you have a logger utility
const User = require('../../models/user'); // Ensure you have imported the User model
const sharp = require('sharp');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const X_AMOUNT = 10; // Reward to the user for adding an item

exports.createItem = async (req, res) => {
    try {
        const { name, description, location, tags, userId } = req.body;

        // Validate request body
        if (!name || !description || !location || !userId) {
            throw new Error('Missing required fields');
        }

        // Process image if available
        let compressedImageBuffer;
        if (req.file) {
            compressedImageBuffer = await sharp(req.file.buffer)
                .resize(800, 600)
                .jpeg({ quality: 10 })
                .toBuffer();
        }

        const newItemData = {
            name,
            description,
            location: typeof location === 'string' ? JSON.parse(location) : location,
            providedBy: userId,
            tags: typeof tags === 'string' ? JSON.parse(tags) : tags,
            image: compressedImageBuffer || null, // Use compressed image if available
        };

        const newItem = new Item(newItemData);
        await newItem.save();

        // Add the item to the user's providedItems array
        await User.findByIdAndUpdate(userId, { $push: { providedItems: newItem._id } });

        // Increment user's score by reward amount
        await User.findByIdAndUpdate(userId, { $inc: { score: X_AMOUNT } });

        res.status(201).json({ message: 'Item created successfully' });
    } catch (error) {
        logger.error('Error creating item', error);
        res.status(400).json({ error: error.message });
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.find({});
        
        // Convert image buffers to base64-encoded strings
        const itemsWithImages = items.map(item => ({
            ...item._doc,
            image: item.image ? item.image.toString('base64') : null, // Convert image buffer to base64 if it exists
        }));
        logger.info('Items retrieved successfully');
        res.status(200).json(itemsWithImages);
    } catch (error) {
        logger.error('Error retrieving items', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            logger.warn(`Item with id ${req.params.id} not found`);
            return res.status(404).json({ message: 'Item not found' });
        }
        
        // Convert the image buffer to a base64-encoded string
        const itemWithImage = {
            ...item._doc,
            image: item.image ? item.image.toString('base64') : null, // Convert image buffer to base64 if it exists
        };

        logger.info(`Item with id ${req.params.id} retrieved successfully`);
        res.status(200).json(itemWithImage);
    } catch (error) {
        logger.error(`Error retrieving item with id ${req.params.id}`, error);
        res.status(500).json({ error: error.message });
    }
};
exports.updateItem = async (req, res) => {
    try {
        const itemToUpdate = await Item.findById(req.params.id);
        if (!itemToUpdate) {
            logger.warn(`Item with id ${req.params.id} not found for update`);
            return res.status(404).json({ message: 'Item not found' });
        }

        // Example logic to handle changing the providedBy field, which is not recommended to be mutable
        // if (req.body.providedBy && req.body.providedBy !== itemToUpdate.providedBy.toString()) {
        //     // Remove the item from the old owner's providedItems list
        //     await User.findByIdAndUpdate(itemToUpdate.providedBy, { $pull: { providedItems: itemToUpdate._id } });
        //     // Add the item to the new owner's providedItems list
        //     await User.findByIdAndUpdate(req.body.providedBy, { $push: { providedItems: itemToUpdate._id } });
        // }

        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        logger.info(`Item with id ${req.params.id} updated successfully`);
        res.status(200).json(updatedItem);
    } catch (error) {
        logger.error(`Error updating item with id ${req.params.id}`, error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            logger.warn(`Item with id ${req.params.id} not found for deletion`);
            return res.status(404).json({ message: 'Item not found' });
        }
        logger.info(`Item with id ${req.params.id} deleted successfully`);
        res.status(200).json({ message: 'Item deleted' });
    } catch (error) {
        logger.error(`Error deleting item with id ${req.params.id}`, error);
        res.status(500).json({ error: error.message });
    }
};




