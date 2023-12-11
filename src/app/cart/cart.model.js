const mongoose = require('mongoose');
const { string } = require('zod');

const CartSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Types.ObjectId,
        ref: 'Order',
        default: null
    },
    buyerId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    productId:{
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true
    },
    detail: {
        title: String,
        price: Number,
        image: String
    },
    qty: {
        type: Number,
        require: true,
        min: 1
    },
    rate: {
        type: Number,
        require: true,
        min: 1
    },
    amount: {
        type: Number,
        require: true,
        min: 1
    },
    seller: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        require: true
    },
    status: {
        type: String,
        enum: ['new', 'verified', 'cancelled', 'completed'],
        default: 'new'
    }

})

const CartModel = mongoose.model('Cart', CartSchema)
module.exports = CartModel