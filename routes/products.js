const express = require('express');
const router = express.Router();
const _ = require('lodash');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const { Product, validate } = require('../models/product');
const { Item } = require('../models/itemsDeleted');

// @Get Products
// @Get all product
// @Access Public
router.get('/', async (req, res) => {
	try {
		const products = await Product.find().sort();
		if (products.length === 0) return res.json({ msg: 'No Products' });
		res.json(products);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});
// @Get Product with a given id
// @Get one product
// @Access Public
router.get('/:id', async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) return res.status(400).json({ msg: 'Product not found.' });

		res.json(product);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});
// @Add Products
// @Add one product
// @Access Private, employee admin only
router.post('/', auth, async (req, res) => {
	try {
		const { id, isEmployee } = req.employee;
		// res.json(req.employee);
		if (!isEmployee) return res.status(401).json({ msg: 'Access denied' });
		// Check for error
		const { error } = validate(req.body);
		if (error) return res.status(400).json({ msg: error.details[0].message });

		// Check if the product already exist
		let product = await Product.findOne({ name: req.body.name });
		if (product) return res.status(400).json({ msg: 'Product always exists' });

		product = new Product(
			_.pick(req.body, [
				'name',
				'category',
				'discount',
				'weight',
				'availableDiscount',
				'pictureUrl',
				'note',
				'price',
				'quantityPerUnit'
			])
		);
		product.addedBy.id = id;

		//Save product to the database
		await product.save();
		res.send(product);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

// @Delete Product with a given id
// @delete one product
// @Access Private employee admin only
router.delete('/:id', [ auth, isAdmin ], async (req, res) => {
	try {
		const { id, isEmployee } = req.employee;
		// res.json(req.employee);
		if (!isEmployee) return res.status(401).json({ msg: 'Access denied' });

		// Check if the product already exist
		let product = await Product.findById(req.params.id);
		if (!product) return res.status(400).json({ msg: 'Product not found' });

		// Find and delete
		await Product.findByIdAndRemove(req.params.id);
		res.json({ msg: 'Product deleted' });

		// Get record
		const record = new Item({
			itemId: req.params.id,
			deletedBy: id
		});

		await record.save();
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

// @Put Product with a given id
// @Update one product
// @Access Private employee admin only
router.put('/:id', auth, async (req, res) => {
	try {
		const { id, isEmployee } = req.employee;
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
		// res.json(category.name);
		productObject.editedBy = product.editedBy;
		productObject.editedBy.id = id;

		// Find and update
		product = await Product.findByIdAndUpdate(req.params.id, { $set: productObject }, { new: true });
		res.json(product);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

module.exports = router;
