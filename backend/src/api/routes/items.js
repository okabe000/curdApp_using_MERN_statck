const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// POST request to create a new item
router.post('/', itemController.createItem);

// GET request to retrieve all items
router.get('/', itemController.getAllItems);

// GET request to retrieve a single item by ID
router.get('/:id', itemController.getItemById);

// PUT request to update an item by ID
router.put('/:id', itemController.updateItem);

// DELETE request to delete an item by ID
router.delete('/:id', itemController.deleteItem);

module.exports = router;
