/**
 * Example Controller
 */

const logger = require('../utils/logger');

// In-memory storage (replace with database in production)
const items = [];

/**
 * Get all items
 * GET /api/v1/example
 */
exports.getAll = async (req, res, next) => {
  try {
    logger.info('Getting all items');

    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get item by ID
 * GET /api/v1/example/:id
 */
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`Getting item ${id}`);

    const item = items.find(i => i.id === id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Item with id ${id} not found`
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new item
 * POST /api/v1/example
 */
exports.create = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Name is required'
      });
    }

    const newItem = {
      id: Date.now().toString(),
      name,
      description: description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    items.push(newItem);
    logger.info(`Created item ${newItem.id}`);

    res.status(201).json({
      success: true,
      data: newItem,
      message: 'Item created successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update item
 * PUT /api/v1/example/:id
 */
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    logger.info(`Updating item ${id}`);

    const itemIndex = items.findIndex(i => i.id === id);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Item with id ${id} not found`
      });
    }

    items[itemIndex] = {
      ...items[itemIndex],
      name: name || items[itemIndex].name,
      description: description !== undefined ? description : items[itemIndex].description,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: items[itemIndex],
      message: 'Item updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove item
 * DELETE /api/v1/example/:id
 */
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`Deleting item ${id}`);

    const itemIndex = items.findIndex(i => i.id === id);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Item with id ${id} not found`
      });
    }

    items.splice(itemIndex, 1);

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
