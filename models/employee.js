const config = require('config');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50
	},
	lastName: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50
	},
	sex: {
		type: String,
		required: true,
		minlength: 1,
		maxlength: 10
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	phoneNumber: {
		type: Number,
		required: true,
		minlength: 10,
		maxlength: 15
	},
	address: {
		street: {
			type: String,
			require: true,
			minlength: 2
		},
		city: {
			type: String,
			require: true,
			minlength: 2
		},
		county: {
			type: String,
			require: true,
			minlength: 2
		},
		state: {
			type: String,
			require: true,
			minlength: 2
		},
		zipcode: {
			type: Number,
			require: true,
			minlength: 2
		},
		country: {
			type: String,
			minlength: 2,
			default: 'United States'
		}
	},
	birth: {
		month: {
			type: String,
			minlength: 2,
			require: true
		},
		day: {
			type: Number,
			minlength: 2,
			require: true
		},
		year: {
			type: Number,
			minlength: 2,
			require: true
		},
		place: {
			city: {
				type: String,
				require: true,
				minlength: 2
			},
			country: {
				type: String,
				require: true,
				minlength: 2
			}
		}
	},
	password: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	isEmployee: {
		type: Boolean,
		default: true
	},
	isCustomer: {
		type: Boolean,
		default: false
	}
});

employeeSchema.methods.generateAuthToken = function() {
	// const paylod = { id: this._id, name: this.name }; the token will have id and name
	const paylod = { id: this._id, isCustomer: this.isCustomer, isEmployee: this.isEmployee };
	const token = jwt.sign(paylod, config.get('jwtPrivateKey'));
	return token;
};

const employee = mongoose.model('employees', employeeSchema);

function validateEmployee(employee) {
	const schema = {
		firstName: Joi.string().min(5).max(255).required(),
		lastName: Joi.string().min(5).max(255).required(),
		sex: Joi.string().required(),
		email: Joi.string().min(5).max(255).required().email(),
		phoneNumber: Joi.number().min(10).required(),
		password: Joi.string().min(5).max(255).required(),
		address: Joi.object({
			street: Joi.string().min(5).max(255).required(),
			city: Joi.string().min(5).max(255).required(),
			zipcode: Joi.number().min(4).required(),
			county: Joi.string().min(2).max(255).required(),
			state: Joi.string().min(2).max(255).required(),
			country: Joi.string().min(2).max(255)
		}),
		birth: Joi.object({
			month: Joi.string().min(2).max(255).required(),
			day: Joi.number().min(1).max(255).required(),
			year: Joi.number().min(4).required(),
			place: Joi.object({
				city: Joi.string().min(2).max(255),
				country: Joi.string().min(2).max(255)
			})
		}),
		isCustomer: Joi.boolean(),
		isEmployee: Joi.boolean()
	};

	return Joi.validate(employee, schema);
}

exports.Employee = employee;
exports.validate = validateEmployee;
