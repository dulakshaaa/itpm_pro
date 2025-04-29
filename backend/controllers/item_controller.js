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
        let {
            name,
            minPrice,
            maxPrice,
            sortBy = 'createdAt',
            order = 'desc',
            page = 1,
            limit = 10
        } = req.query;

        page = Number(page);
        limit = Number(limit);
        if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
            return res.status(400).json({ message: "Invalid page or limit value" });
        }

        const filter = {};
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const skip = (page - 1) * limit;
        const sortOrder = order === 'asc' ? 1 : -1;

        // Optional: whitelist of allowed sort fields
        const allowedSortFields = ['name', 'price', 'createdAt', 'updatedAt'];
        if (!allowedSortFields.includes(sortBy)) {
            return res.status(400).json({ message: `Invalid sort field. Allowed: ${allowedSortFields.join(', ')}` });
        }

        const items = await Item.find(filter)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit);

        const total = await Item.countDocuments(filter);

        res.status(200).json({
            total,
            page,
            pageSize: items.length,
            items
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const mongoose = require('mongoose');

// Get one item by ID
const getItem = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid item ID format" });
        }

        const item = await Item.findById(id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const mongoose = require('mongoose');

// Update item in the store
const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid item ID format" });
        }

        // Ensure updateData has at least one updatable field
        const allowedFields = ['name', 'description', 'price', 'image'];
        const hasValidFields = Object.keys(updateData).some(field => allowedFields.includes(field));

        if (!hasValidFields) {
            return res.status(400).json({ message: "No valid fields provided for update" });
        }

        const updatedItem = await Item.findByIdAndUpdate(
            id,
            updateData,
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

        // Validate MongoDB ObjectId format before attempting deletion
if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid item ID format. Please provide a valid MongoDB ObjectId." });
}

const deletedItem = await Item.findByIdAndDelete(id);

if (!deletedItem) {
    return res.status(404).json({ message: `No item found with ID: ${id}. Deletion could not be performed.` });
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
