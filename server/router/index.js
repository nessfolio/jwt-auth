const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const productController = require('../controllers/product-controller');
const router =  Router();
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware');

// auth
router.post('/registration',
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min: 8, max: 32}).withMessage('Password must be 8-32 characters'),
    userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);

// product
router.get('/products', productController.getProducts);
router.post('/create', productController.createProduct);


module.exports = router;