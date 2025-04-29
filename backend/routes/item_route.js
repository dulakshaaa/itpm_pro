const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item_controller');

// Routes for items
router.post('/items_add', itemController.addItem);
router.get('/items_get', itemController.getItems);
router.get('/item_get/:id', itemController.getItem);
router.put('/items_update/:id', itemController.updateItem);
router.delete('/items_delete/:id', itemController.deleteItem);

module.exports = router;
