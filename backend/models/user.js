const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Cart: {
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]

    }
})

userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.Cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedItems = [...this.Cart.items];
    if (cartProductIndex >= 0) {
        newQuantity = this.Cart.items[cartProductIndex].quantity + 1;
        updatedItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedItems.push({
            productId: product._id,
            quantity: newQuantity
        })
    }
    const updatedCart = {
        items: updatedItems
    }
    this.Cart = updatedCart;
    return this.save();
}

userSchema.methods.removeFromCart = function (productId) {
    const updatedCartItem = this.Cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    })
    this.Cart.items = updatedCartItem;
    return this.save();
}

userSchema.methods.clearCart = function () {
    this.Cart = { item: [] };
    return this.save();
}

module.exports = mongoose.model('User', userSchema);