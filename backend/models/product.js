const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    ImageUrl: {
        type: String,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
    UserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Product', productSchema);