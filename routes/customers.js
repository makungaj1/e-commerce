const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const _ = require('lodash');
const auth = require('../middleware/auth');
const { Customer, validate } = require('../models/customer');

// @Get the information about the logged in customer. Private route
router.get('/me', auth, async (req, res) => {
	try {
		const { id, isCustomer } = req.employee;
		if (!isCustomer) return res.status(401).json({ msg: 'Access denied' });

		const customer = await Customer.findById(id).select('firstName lastName sex phoneNumber1 phoneNumber2');
		res.json(customer);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

// @Register a customer
router.post('/', async (req, res) => {
	try {
		// Check for error
		const { error } = validate(req.body);
		if (error) return res.status(400).json({ msg: error.details[0].message });

		// Check if customer already exist
		let customer = await Customer.findOne({ email: req.body.email });
		if (customer) return res.status(400).json({ msg: 'customer already exists.' });

		customer = new Customer(
			_.pick(req.body, [
				'firstName',
				'lastName',
				'sex',
				'email',
				'phoneNumber1',
				'phoneNumber2',
				'address1',
				'address2',
				'birth',
				'password',
				'payment',
				'billingAddress',
				'shippingAddress'
			])
		);

		// Hash password
		const salt = await bcrypt.genSalt(10);
		customer.password = await bcrypt.hash(customer.password, salt);
		//Save customer to the database
		await customer.save();

		const token = customer.generateAuthToken();
		res.header('x-auth-token', token).json({ token });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

module.exports = router;
