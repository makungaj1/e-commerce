const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const _ = require('lodash');
const { validateAuth, Customer } = require('../models/customer');
const { Employee } = require('../models/employee');

// @Auth

router.post('/', async (req, res) => {
	// Check for error
	const { error } = validateAuth(req.body);
	if (error) return res.status(400).json({ msg: error.details[0].message });

	// Check if employee or customer exists
	const employee = await Employee.findOne({ email: req.body.email });
	const customer = await Customer.findOne({ email: req.body.email });
	if (!customer && !employee) return res.status(400).json({ msg: 'Invalid email or password' });

	const isboth = employee && customer ? true : false;

	const validPassword = await bcrypt.compare(req.body.password, employee.password);
	const validCustomerPassword = await bcrypt.compare(req.body.password, customer.password);
	if (!validPassword && !validCustomerPassword) return res.status(400).json({ msg: 'Invalid email or password' });

	const token = isboth && validPassword ? employee.generateAuthToken() : customer.generateAuthToken();
	res.header('x-auth-token', token).json({ token });
});

module.exports = router;
