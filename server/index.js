require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router =  require('./router/index')
const errorMiddleWare = require('./middlewares/error-middleware')
const productsConnection = require('./db/products-db');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: process.env.CLIENT_URL}));
app.use('/api', router);
app.use(errorMiddleWare);

const start = async () => {
    await Promise.all([
        mongoose.connect(process.env.DB_URL),
        productsConnection.asPromise()
    ])

    app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
}

start().catch((e) => {
    console.log(e);
    process.exit(1);
})