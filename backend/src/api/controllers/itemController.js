const Item = require('../../models/item');
const logger = require('../../utils/logger'); // Ensure you have a logger utility



exports.createItem = async (req, res) => {
    try {
        // Construct new item data from the request body
        const newItemData = {
            name: req.body.name,
            description: req.body.description,
            location: req.body.location,
            providedBy: req.body.providedBy,
            tags: req.body.tags,
            // Add more fields as needed
        };

        // Check if there's an image file in the request and add it to the item data
        if (req.file) {
            // Store the image buffer directly if the image is sent as a file
            newItemData.image = req.file.buffer;
        }

        // Create a new Item instance with the provided data
        const newItem = new Item(newItemData);

        // Save the new item to the database
        const savedItem = await newItem.save();

        logger.info('Item created successfully', savedItem);
        res.status(201).json(savedItem);
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
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            logger.warn(`Item with id ${req.params.id} not found for update`);
            return res.status(404).json({ message: 'Item not found' });
        }
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




