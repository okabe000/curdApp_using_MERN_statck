const express = require('express');
const multer = require('multer');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Set up multer for storing uploaded files
const storage = multer.memoryStorage(); // Storing files in memory
const upload = multer({ storage: storage });

// Corrected POST request to create a new item
// Now using multer to handle the image file
router.post('/', upload.single('image'), itemController.createItem);

// Other routes remain unchanged
router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
