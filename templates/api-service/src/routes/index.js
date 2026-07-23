/**
 * API Routes
 */

const express = require('express');
const router = express.Router();

// Import controllers
const exampleController = require('../controllers/example');

// Example routes
router.get('/example', exampleController.getAll);
router.get('/example/:id', exampleController.getById);
router.post('/example', exampleController.create);
router.put('/example/:id', exampleController.update);
router.delete('/example/:id', exampleController.remove);

// TODO: Add your routes here

module.exports = router;
