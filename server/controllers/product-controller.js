const r2Service = require('../service/r2-service');
const ProductModel = require('../models/product-model');

class productController {
    async getProducts(req, res, next) {
        try {
            const products = await ProductModel.find().sort({createdAt: -1})

            res.json(products);
        }
        catch (e) {
            console.log(e)
            next(e)
        }
    }

    async createProduct(req, res, next) {
        try {
            const img = [];

            if (req.files && req.files.length > 0) {
                for (const file of req.files) {
                    const url = await r2Service.uploadImage(
                        file.buffer,
                        file.originalname,
                        file.mimetype
                    );
                    img.push(url);
                }
            }

            const product = await ProductModel.create({
                title: req.body.title,
                price: req.body.price,
                description: req.body.description,
                img
            })

            res.status(201).json(req.body);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new productController();