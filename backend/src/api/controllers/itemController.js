const Item = require('../../models/item');
const logger = require('../../utils/logger'); // Ensure you have a logger utility

exports.createItem = async (req, res) => {
    try {
        const newItem = new Item(req.body);
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
        logger.info('Items retrieved successfully');
        res.status(200).json(items);
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
        logger.info(`Item with id ${req.params.id} retrieved successfully`);
        res.status(200).json(item);
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
