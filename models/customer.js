const config = require('config');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
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
	phoneNumber1: {
		type: Number,
		required: true,
		minlength: 10,
		maxlength: 15
	},
	phoneNumber2: {
		type: Number,
		required: false,
		minlength: 10,
		maxlength: 15
	},
	address1: {
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
			minlength: 4
		},
		country: {
			type: String,
			minlength: 2,
			default: 'United States'
		},
		primary: {
			type: Boolean,
			require: true,
			default: true
		}
	},
	address2: {
		street: {
			type: String,
			require: false,
			minlength: 2
		},
		city: {
			type: String,
			require: false,
			minlength: 2
		},
		county: {
			type: String,
			require: false,
			minlength: 2
		},
		state: {
			type: String,
			require: false,
			minlength: 2
		},
		zipcode: {
			type: Number,
			require: false,
			minlength: 4
		},
		country: {
			type: String,
			require: false,
			minlength: 2,
			default: 'United States'
		},
		primary: {
			type: Boolean,
			require: false,
			default: false
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
		}
	},
	password: {
		type: String,
		require: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	payment: {
		creditCardNumber: {
			type: Number,
			require: true,
			minlength: 14
		},
		cardType: {
			type: String,
			require: true,
			minlength: 2
		},
		cardExpiration: {
			month: {
				type: Number,
				require: true,
				minlength: 2
			},
			year: {
				type: Number,
				require: true,
				minlength: 4
			}
		}
	},
	billingAddress: {
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
			minlength: 4
		},
		country: {
			type: String,
			minlength: 2,
			default: 'United States'
		}
	},
	shippingAddress: {
		street: {
			type: String,
			require: false,
			minlength: 2
		},
		city: {
			type: String,
			require: false,
			minlength: 2
		},
		county: {
			type: String,
			require: false,
			minlength: 2
		},
		state: {
			type: String,
			require: false,
			minlength: 2
		},
		zipcode: {
			type: Number,
			require: false,
			minlength: 4
		},
		country: {
			type: String,
			require: false,
			minlength: 2,
			default: 'United States'
		}
	},
	isEmployee: {
		type: Boolean,
		default: false
	},
	isCustomer: {
		type: Boolean,
		default: true
	}
});

customerSchema.methods.generateAuthToken = function() {
	// const paylod = { id: this._id, name: this.name }; the token will have id and name
	const paylod = { id: this._id, isCustomer: this.isCustomer, isEmployee: this.isEmployee };
	const token = jwt.sign(paylod, config.get('jwtPrivateKey'));
	return token;
};

const Customer = mongoose.model('Customers', customerSchema);

function validatecustomer(customer) {
	const schema = {
		firstName: Joi.string().min(5).max(255).required(),
		lastName: Joi.string().min(5).max(255).required(),
		sex: Joi.string().required(),
		email: Joi.string().min(5).max(255).required().email(),
		phoneNumber1: Joi.number().min(10).required(),
		phoneNumber2: Joi.number().min(10),
		password: Joi.string().min(5).max(255).required(),
		address1: Joi.object({
			street: Joi.string().min(5).max(255).required(),
			city: Joi.string().min(5).max(255).required(),
			zipcode: Joi.number().min(4).required(),
			county: Joi.string().min(2).max(255).required(),
			state: Joi.string().min(2).max(255).required(),
			country: Joi.string().min(2).max(255),
			primary: Joi.boolean()
		}).required(),
		address2: Joi.object({
			street: Joi.string().min(5).max(255).required(),
			city: Joi.string().min(5).max(255).required(),
			zipcode: Joi.number().min(4).required(),
			county: Joi.string().min(2).max(255).required(),
			state: Joi.string().min(2).max(255).required(),
			country: Joi.string().min(2).max(255).required(),
			primary: Joi.boolean().required()
		}),
		birth: Joi.object({
			month: Joi.string().min(2).max(255).required(),
			day: Joi.number().min(1).max(255).required(),
			year: Joi.number().min(4).required(),
			place: Joi.object({
				city: Joi.string().min(2).max(255),
				country: Joi.string().min(2).max(255)
			}).required()
		}).required(),
		payment: Joi.object({
			creditCardNumber: Joi.number().required().min(14),
			cardType: Joi.string().required().min(2),
			cardExpiration: Joi.object({
				month: Joi.number().required().min(2),
				year: Joi.number().required().min(4)
			}).required()
		}).required(),
		billingAddress: Joi.object({
			street: Joi.string().min(5).max(255).required(),
			city: Joi.string().min(5).max(255).required(),
			zipcode: Joi.number().min(4).required(),
			county: Joi.string().min(2).max(255).required(),
			state: Joi.string().min(2).max(255).required(),
			country: Joi.string().min(2).max(255),
			primary: Joi.boolean()
		}).required(),
		shippingAddress: Joi.object({
			street: Joi.string().min(5).max(255).required(),
			city: Joi.string().min(5).max(255).required(),
			zipcode: Joi.number().min(4).required(),
			county: Joi.string().min(2).max(255).required(),
			state: Joi.string().min(2).max(255).required(),
			country: Joi.string().min(2).max(255),
			primary: Joi.boolean()
		}).required(),
		isCustomer: Joi.boolean(),
		isEmployee: Joi.boolean()
	};

	return Joi.validate(customer, schema);
}

function validateAuth(customer) {
	const schema = {
		email: Joi.string().min(5).max(255).required().email(),
		password: Joi.string().min(5).max(255).required()
	};

	return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validatecustomer;
exports.validateAuth = validateAuth;
