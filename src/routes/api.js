import express from 'express';
import userController from '../controllers/userController';
import bannerController from '../controllers/bannerController';
import authController from '../controllers/authController';
import groupController from '../controllers/groupController';
import categoryController from '../controllers/categoryController';
import productController from '../controllers/productController';
import productDetailController from '../controllers/productDetailController';
import cartController from '../controllers/cartController';
import userInforController from '../controllers/userInforController';
import paymentController from '../controllers/paymentcontroller';
import roleController from '../controllers/roleController';
import orderController from '../controllers/orderController';
import multer from 'multer';

import { checkUserJWT, checkUserPermission } from '../middleware/JWTAction';

// config form data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

const initApiRoutes = (app) => {
    // check permission and authorization
    router.all('*', checkUserJWT, checkUserPermission);

    // user routes
    router.post('/create-user', upload.single('image'), userController.createFunc);
    router.get('/get-All-User', userController.readFunc);
    router.get('/get-All-User-By-Week', userController.getAllUserByWeek);
    router.get('/get-user-by-id', userController.getUserById);
    router.put('/update-user', upload.single('image'), userController.updateFunc);
    router.put('/update-profile', upload.single('avatar'), userController.updateProfile);
    router.delete('/delete-user', userController.deleteFunc);

    // user Infor routes
    router.post('/user_infor/create', userInforController.createFunc);
    router.get('/user_infor/read', userInforController.getUserInforDefault);
    router.get('/user_infor/getListUserInfo', userInforController.getListUserInfo);
    router.put('/user_infor/updateUserInfo', userInforController.updateUserInfo);

    //banner routes
    router.post('/create-banner', upload.single('image'), bannerController.createFunc);
    router.get('/get-All-Banner', bannerController.readFunc);
    router.put('/update-banner', upload.single('image'), bannerController.updateFunc);
    router.delete('/delete-banner', bannerController.deleteFunc);

    //auth routes
    router.post('/auth/login', authController.handleLogin);
    router.post('/auth/register', authController.handleRegister);
    router.post('/auth/logout', authController.handleLogout);
    router.post('/auth/refresh_token', authController.handleRefreshToken);

    // group routes
    router.get('/group/read', groupController.readFunc);

    // role routes
    router.get('/role/read', roleController.readFunc);
    router.get("/role/by-group:groupId", roleController.getRoleByGroup)
    router.post('/role/create', roleController.createFunc);
    router.post("/role/assign-to-group", roleController.assignRoleToGroup)
    router.put('/role/update', roleController.updateFunc);
    router.delete('/role/delete', roleController.deleteFunc);

    // category routes
    router.post('/create-category', upload.single('image'), categoryController.createFunc);
    router.get('/get-All-Category', categoryController.readFunc);
    router.put('/update-category', upload.single('image'), categoryController.updateFunc);
    router.delete('/delete-category', categoryController.deleteFunc);

    // product routes
    router.get('/product/read', productController.readFunc);
    router.get('/product/getAllProduct', productController.getAllProducts);
    router.get('/product/getProductById', productController.getProductById);
    router.get('/product/getProductsByCategoryId', productController.getProductsByCategoryId);
    router.post(
        '/product/create',
        upload.fields([
            { name: 'image', maxCount: 10 },
            { name: 'background', maxCount: 10 },
        ]),
        productController.createFunc,
    );
    router.post('/product/create-user-product', productController.createUserProduct);
    router.put(
        '/product/update',
        upload.fields([
            { name: 'image', maxCount: 1 },
            { name: 'background', maxCount: 1 },
        ]),
        productController.updateFunc,
    );
    router.delete('/product/delete', productController.deleteFunc);

    // product detail routes
    router.post('/product_detail/create-or-update', productDetailController.createUpdateFunc);
    router.get('/product_detail/read', productDetailController.readFunc);

    // cart routes
    router.post('/cart/create', cartController.createFunc);
    router.post('/cart/add-to-cart', cartController.addToCart);
    router.get('/cart/read', cartController.readFunc);
    router.get('/cart/getAllProductByCartId', cartController.getAllProductByCartId);
    router.put('/cart/update-quantity', cartController.updateFunc);
    router.put('/cart/update-isChecked', cartController.updateIsChecked);
    router.delete('/cart/delete-product', cartController.deleteFunc);
    router.delete('/cart/delete-cart-product', cartController.deleteCartProduct);

    // payment routes
    router.post('/payment/vnpay', paymentController.checkout);
    router.get('/vnpay_return', paymentController.vnpReturn);
    router.post('/vnpay/refund', paymentController.refund)

    // order routes
    router.post('/order/create', orderController.createFunc);
    router.get('/order/getOrdersByUserId', orderController.getOrdersByUserId);
    router.get('/order/getAllOrderPaginate', orderController.getAllOrderPaginate);
    router.get('/order/getAllOrderInDay', orderController.getAllOrderInDay);
    router.get('/order/getAllOrderByCondition', orderController.getAllOrderByCondition);
    router.get('/order/getOrderDetail', orderController.getOrderDetail);
    router.get('/order/getOrderBySearchText', orderController.getOrderBySearchText);
    router.get('/order/getAllOrderInWeek', orderController.getAllOrderInWeek);
    router.put('/order/confirmOrder', orderController.confirmOrder);
    router.put('/order/cancelOrder', orderController.cancelOrder);
    router.put('/order/ConfirmDeliveredOrder', upload.single('image'), orderController.ConfirmDeliveredOrder);

    return app.use('/api/v1', router);
};

export default initApiRoutes;
