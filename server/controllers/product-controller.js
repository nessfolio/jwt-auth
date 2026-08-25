const fs = require('node:fs/promises');
const path = require('node:path');


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

            db.products.unshift(req.body);

            await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

            res.status(201).json(req.body);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new productController();