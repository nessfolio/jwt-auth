const fs = require('node:fs/promises');
const path = require('node:path');
const r2Service = require('../service/r2-service'); 


const dbPath = path.join(process.cwd(), 'controllers', 'db.json');

class productController {
    async getProducts(req, res, next) {
        try {
            const db = JSON.parse(await fs.readFile(dbPath, 'utf8'));

            res.json(db.products);
        }
        catch (e) {
            console.log(e)
            next(e)
        }
    }

    async createProduct(req, res, next) {
        try {
            const db = JSON.parse(await fs.readFile(dbPath, 'utf8'));

            if (req.files && req.files.length > 0) {
                const uploadedImagesNames = [];

                for (const file of req.files) {
                    const fileName = await r2Service.uploadImage(
                        file.buffer,
                        file.originalname,
                        file.mimetype
                    );
                    uploadedImagesNames.push(fileName);
                }

                req.body.img = uploadedImagesNames;
            }

            // Convert FormData strings back to numbers for the DB
            if (req.body.price) req.body.price = Number(req.body.price);
            if (req.body.id) req.body.id = Number(req.body.id);


            db.products.unshift(req.body);
            await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

            res.status(201).json(req.body);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new productController();