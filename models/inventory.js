const Joi = require('joi');
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
	productID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'products._id'
	},
	employeeID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'employees._id'
	},
	availableQuantity: {
		type: Number,
		required: true,
		default: 0
	},
	note: {
		type: String,
		required: true,
		minlength: 5
	},
	reorderLevel: {
		type: Number,
		default: 0
	},
	date: {
		type: Date,
		default: Date.now()
	}
});

const Inventory = mongoose.model('Inventory', inventorySchema);

function validateInventory(inventory) {
	const schema = {
		availableQuantity: Joi.number().default(0),
		note: Joi.string().required(),
		reorderLevel: Joi.number().required()
	};

	return Joi.validate(inventory, schema);
}

exports.Inventory = Inventory;
exports.validate = validateInventory;
