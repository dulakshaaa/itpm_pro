const Item = require('../models/item_model');

// Add item to store
const addItem = async (req, res) => {
    try {
        const { name, description, price, image } = req.body;

        if (!name || !description || !price) {
            return res.status(400).json({ message: "Name, description, and price are required." });
        }

        const newItem = new Item({ name, description, price, image });
        await newItem.save();
        res.status(201).json({ message: "Item added successfully", item: newItem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all items with optional filtering, pagination, and sorting
const getItems = async (req, res) => {
    try {
        const { name, minPrice, maxPrice, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;

        const filter = {};
        if (name) {
            filter.name = { $regex: name, $options: 'i' }; // case-insensitive search
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const skip = (Number(page) - 1) * Number(limit);
        const sortOrder = order === 'asc' ? 1 : -1;

        const items = await Item.find(filter)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(Number(limit));

        const total = await Item.countDocuments(filter);

        res.status(200).json({
            total,
            page: Number(page),
            pageSize: items.length,
            items
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get one item by ID
const getItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Item.findById(id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update item in the store
const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, image } = req.body;

        const updatedItem = await Item.findByIdAndUpdate(
            id,
            { name, description, price, image },
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json({ message: "Item updated successfully", item: updatedItem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const mongoose = require('mongoose');

// Delete item from the store
const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid item ID format" });
        }

        const deletedItem = await Item.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json({
            message: "Item deleted successfully",
            deletedItem
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    addItem,
    getItems,
    getItem,
    updateItem,
    deleteItem,
};
