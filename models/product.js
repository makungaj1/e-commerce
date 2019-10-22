const Joi = require('joi');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		require: true,
		minlength: 1
	},
	category: {
		name: {
			type: String,
			require: true,
			minlength: 1
		},
		description: {
			type: String,
			require: true,
			minlength: 2
		},
		pictureUrl: {
			type: String,
			require: true,
			minlength: 10
		},
		isAvailable: {
			type: Boolean,
			require: true,
			default: true
		}
	},
	discount: {
		type: Number,
		require: false,
		minlength: 1
	},
	weight: {
		type: Number,
		require: true,
		minlength: 1
	},
	availableDiscount: {
		type: Number
	},
	note: {
		type: String,
		minlength: 5
	},
	price: {
		type: Number,
		require: true,
		minlength: 1
	},
	quantityPerUnit: {
		type: Number
	},
	date: {
		type: Date,
		default: Date.now()
	},
	addedBy: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'id'
		},
		date: {
			type: Date,
			default: Date.now()
		}
	},
	editedBy: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'id'
		},
		date: {
			type: Date,
			default: Date.now()
		}
	}
});

const Product = mongoose.model('Products', productSchema);

function validateProduct(product) {
	const schema = {
		name: Joi.string().min(1).max(255).required(),
		category: Joi.object({
			name: Joi.string().min(1).max(255).required(),
			description: Joi.string().min(5).max(255).required(),
			pictureUrl: Joi.string().min(4).max(255).required(),
			isAvailable: Joi.boolean().required()
		}).required(),
		discount: Joi.number().default(0),
		weight: Joi.number().required(),
		availableDiscount: Joi.number().required(),
		note: Joi.string().min(5).max(255).required(),
		quantityPerUnit: Joi.number().required().min(1).max(255),
		price: Joi.number().required().min(1),
		addedBy: Joi.object({
			id: Joi.string(),
			date: Joi.allow()
		}),
		editedBy: Joi.object({
			id: Joi.string(),
			date: Joi.allow()
		}),
		date: Joi.allow()
	};

	return Joi.validate(product, schema);
}

exports.Product = Product;
exports.validate = validateProduct;
