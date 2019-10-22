const mongoose = require('mongoose');

const itemsDeletedSchema = new mongoose.Schema({
	itemId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'id'
	},
	deletedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'id'
	},
	date: {
		type: Date,
		default: Date.now()
	}
});

const Item = mongoose.model('ItemsDeleted', itemsDeletedSchema);

exports.Item = Item;
