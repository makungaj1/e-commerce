const express = require('express');
const router = express.Router();
const _ = require('lodash');
const auth = require('../middleware/auth');
const { Inventory, validate } = require('../models/inventory');

// @Get Inventories
// @Access Private employee only
router.get('/', auth, async (req, res) => {
	try {
		const { isEmployee } = req.employee;
		// res.json(req.employee);
		if (!isEmployee) return res.status(401).json({ msg: 'Access denied' });

		const inventories = await Inventory.find().sort();
		if (inventories.length === 0) return res.json({ msg: 'No Inventory' });

		res.json(inventories);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});
// @Get Inventory with a given id
// @Get one inventory
// @Access Private
router.get('/:id', auth, async (req, res) => {
	try {
		const { isEmployee } = req.employee;
		// res.json(req.employee);
		if (!isEmployee) return res.status(401).json({ msg: 'Access denied' });
		// res.json(req.params.id);

		const inventory = await Inventory.findById(req.params.id);
		if (!inventory) return res.status(400).json({ msg: 'Inventory not found.' });

		res.json(inventory);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});
// @Add Inventory
// @Add one inventory
// @Access Private
router.post('/', auth, async (req, res) => {
	try {
		const { id, isEmployee } = req.employee;
		// res.json(req.employee);
		if (!isEmployee) return res.status(401).json({ msg: 'Access denied' });

		// Check for error
		const { error } = validate(req.body);
		if (error) return res.status(400).json({ msg: error.details[0].message });

		let inventory = new Inventory(_.pick(req.body, [ 'note', 'availableQuantity', 'reorderLevel' ]));
		inventory.employeeID = id;

		//Save inventory to the database
		await inventory.save();
		res.send(inventory);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

// @Delete Product with a given id
// @delete one product
// @Access Private
router.delete('/:id', auth, async (req, res) => {
	try {
		const { isEmployee } = req.employee;
		// res.json(req.employee);
		if (!isEmployee) return res.status(401).json({ msg: 'Access denied' });

		// Check if the product already exist
		let product = await Product.findById(req.params.id);
		if (!product) return res.status(400).json({ msg: 'Product not found' });

		// Find and delete
		await Product.findByIdAndRemove(req.params.id);
		res.json({ msg: 'Product deleted' });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

// @Put Product with a given id
// @Update one product
// @Access Private
router.put('/:id', auth, async (req, res) => {
	try {
		const { isEmployee } = req.employee;
		// res.json(req.employee);
		if (!isEmployee) return res.status(401).json({ msg: 'Access denied' });

		// Find the product
		let product = await Product.findById(req.params.id);
		if (!product) returnres.status(400).json({ msg: 'Product not found' });

		const { name, category, weight, availableDiscount, note, quantityPerUnit } = req.body;
		// Build product object
		let productObject = {};
		if (name) productObject.name = name;
		if (weight) productObject.weight = weight;
		if (availableDiscount) productObject.availableDiscount = availableDiscount;
		if (note) productObject.note = note;
		if (quantityPerUnit) productObject.quantityPerUnit = quantityPerUnit;
		productObject.category = category;
		if (category.name) productObject.category.name = category.name;
		if (category.description) productObject.category.description = category.description;
		if (category.pictureUrl) productObject.category.pictureUrl = category.pictureUrl;
		if (category.isAvailable) productObject.category.isAvailable = category.isAvailable;
		// res.json(category);

		// Find and update
		product = await Product.findByIdAndUpdate(req.params.id, { $set: productObject }, { new: true });
		res.json(product);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

module.exports = router;
