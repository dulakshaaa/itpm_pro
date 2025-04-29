const Item = require('../models/item_model');

// Add item to store
const addItem = async (req, res) => {
    try {
        const { name, description, price, image } = req.body;
    
        // Validate required fields
        if (!name?.trim() || !description?.trim() || price === undefined) {
            return res.status(400).json({
                message: "Name, description, and price are required."
            });
        }
    
        // Validate price as a number
        if (isNaN(price) || Number(price) < 0) {
            return res.status(400).json({
                message: "Price must be a non-negative number."
            });
        }
    
        const newItem = new Item({
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            image: image?.trim() || ""
        });
    
        await newItem.save();
        res.status(201).json({
            message: "Item added successfully",
            item: newItem
        });
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

// Filter by name (case-insensitive, trimmed)
if (name?.trim()) {
    filter.name = { $regex: name.trim(), $options: 'i' };
}

// Filter by price range if any values are provided
const min = Number(minPrice);
const max = Number(maxPrice);

if (!isNaN(min) || !isNaN(max)) {
    filter.price = {};
    if (!isNaN(min)) filter.price.$gte = min;
    if (!isNaN(max)) filter.price.$lte = max;
}


// Validate and sanitize pagination parameters
const page = parseInt(req.query.page, 10);
const limit = parseInt(req.query.limit, 10);

const pageNumber = isNaN(page) || page < 1 ? 1 : page;
const pageLimit = isNaN(limit) || limit < 1 ? 10 : limit;

const skip = (pageNumber - 1) * pageLimit;

// Validate and apply sort field and order
const allowedSortFields = ['name', 'price', 'createdAt', 'updatedAt'];
const requestedSortField = req.query.sortBy?.trim() || 'createdAt';
const requestedOrder = req.query.order?.toLowerCase();

const sortOrder = requestedOrder === 'asc' ? 1 : -1;

if (!allowedSortFields.includes(requestedSortField)) {
    return res.status(400).json({
        message: "Invalid sort field provided.",
        allowedFields: allowedSortFields,
        received: requestedSortField
    });
}

const sortOptions = { [requestedSortField]: sortOrder };



// If no valid sort field is provided, use the default
const sortField = allowedSortFields.includes(sortBy) ? sortBy : defaultSortField;



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
