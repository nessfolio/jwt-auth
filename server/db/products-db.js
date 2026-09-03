const mongoose = require('mongoose');

const productsConnection = mongoose.createConnection(process.env.DB_URL_2, {
    dbName: 'productsData'
})

module.exports = productsConnection;