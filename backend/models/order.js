const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [
        {
            product: {
                type: Object,
                require: true
            },
            quantity: {
                type: Number,
                require: true
            }
        }
    ],
    user: {
        email: {
            type: String,
            require: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            require: true,
            ref: 'User'
        }
    },
    address: {
        name: {
            type: String,
            require: true
        },
        street: {
            type: String,
            require: true
        },
        city: {
            type: String,
            require: true
        },
        state: {
            type: String,
            require: true
        },
        zip: {
            type: String,
            require: true
        },
        number: {
            type: String,
            require: true
        }
    },
    insertedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Order', orderSchema);