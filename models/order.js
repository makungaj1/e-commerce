const Joi = require('joi');
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
	productID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'products._id'
	},
	customerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'customers._id'
	},
	date: {
		type: Date,
		default: Date.now()
	},
	salesTaxe: {
		type: Number,
		minlength: 1
	},
	status: {
		type: String,
		default: 'In progress'
	},
	isCanseled: {
		type: Boolean,
		default: false
	},
	isPaid: {
		status: {
			type: Boolean,
			default: false
		},
		payment: {
			type: {
				type: String,
				required: true
			},
			isAllowed: {
				type: Boolean,
				default: false
			},
			date: {
				type: Date,
				default: Date.now()
			}
		},
		detail: {
			quantity: {
				type: Number,
				minlength: 1,
				required: true
			},
			price: {
				type: Number,
				required: true
			},
			discount: {
				type: Number,
				default: 0
			}
		}
	}
});

const Order = mongoose.model('Orders', orderSchema);

function validateOrder(order) {
	const schema = {
		productID: Joi.string(),
		customerId: Joi.string(),
		date: Joi.allow(),
		salesTaxe: Joi.number().min(1),
		status: Joi.string(),
		isCanseled: Joi.boolean(),
		isPaid: Joi.object({
			status: Joi.boolean(),
			payment: Joi.object({
				type: Joi.string(),
				isAllowed: Joi.boolean(),
				date: Joi.allow()
			}).required(),
			detail: Joi.object({
				quantity: Joi.number().min(1),
				price: Joi.number().min(1),
				discount: Joi.number()
			}).required()
		}).required()
	};

	return Joi.validate(order, schema);
}

exports.Order = Order;
exports.validate = validateOrder;
