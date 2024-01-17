const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST request to create a new user
router.post('/', userController.createUser);

// GET request to retrieve users
router.get('/', userController.getAllUsers);

// GET request to retrieve a single user by ID
router.get('/:id', userController.getUserById);

// PUT request to update a user by ID
router.put('/:id', userController.updateUser);

// DELETE request to delete a user by ID
router.delete('/:id', userController.deleteUser);

module.exports = router;