const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST request to create a new user
router.post('/', userController.createUser);
// POST request for user login
router.post('/login', userController.loginUser); // Add this line for login

// GET request to retrieve users
router.get('/', userController.getAllUsers);

// GET request to retrieve a single user by ID
router.get('/:id', userController.getUserById);

// PUT request to update a user by ID
router.put('/:id', userController.updateUser);

// DELETE request to delete a user by ID
router.delete('/:id', userController.deleteUser);

module.exports = router;
