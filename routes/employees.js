const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const auth = require('../middleware/auth');
const _ = require('lodash');
const { Employee, validate } = require('../models/employee');

// @Get information about the logged in employee. Private route
router.get('/me', auth, async (req, res) => {
	try {
		const { id, isEmployee } = req.employee;
		if (!isEmployee) return res.status(401).json({ msg: 'Access denied' });

		const employee = await Employee.findById(id).select('firstName lastName sex phoneNumber1 phoneNumber2');
		res.json(employee);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

// @Register a employee
router.post('/', async (req, res) => {
	try {
		// Check for error
		const { error } = validate(req.body);
		if (error) return res.status(400).json({ msg: error.details[0].message });

		// Check if employee already exist
		let employee = await Employee.findOne({ email: req.body.email });
		if (employee) return res.status(400).json({ msg: 'employee already exists.' });

		employee = new Employee(
			_.pick(req.body, [ 'firstName', 'lastName', 'sex', 'email', 'phoneNumber', 'address', 'birth', 'password' ])
		);

		// Hash password
		const salt = await bcrypt.genSalt(10);
		employee.password = await bcrypt.hash(employee.password, salt);
		//Save employee to the database
		await employee.save();

		const token = employee.generateAuthToken();
		res.header('x-auth-token', token).json({ token });
		// res.json({ token });
		// res.send(employee);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
	}
});

module.exports = router;
