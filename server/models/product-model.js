const {Schema} = require('mongoose');
const productsConnection =  require('../db/products-db');

const ProductSchema = new Schema({
    title: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    img: {type: [String], default: []}
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
            return ret;
        }
    }
})

module.exports = productsConnection.model("Product",  ProductSchema, "products");