import db from '../models';
import { Op } from 'sequelize';

const createFunc = async (userId) => {
    try {
        let cart = await db.Cart.findOne({
            where: { userId: userId },
        });
        if (cart) {
            return {
                EM: 'shopping cart already exists',
                EC: 1,
                DT: '',
            };
        }
        await db.Cart.create({
            userId: userId,
        });
        return {
            EM: 'Create Cart succeeds',
            EC: 0,
            DT: '',
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "Something's wrong with services",
            EC: 1,
            DT: [],
        };
    }
};

const readFunc = async (userId) => {
    try {
        if (!userId) {
            return {
                EM: 'Input is Empty',
                EC: 1,
                DT: [],
            };
        }
        let cart = await db.Cart.findOne({
            where: { userId: userId },
        });
        if (!cart) {
            return {
                EM: 'Cart not found!',
                EC: 1,
                DT: [],
            };
        }
        return {
            EM: 'Ok',
            EC: 0,
            DT: cart,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "Something's wrong with services",
            EC: 1,
            DT: [],
        };
    }
};

const getAllProductByCartId = async (cartId) => {
    try {
        let products = await db.Cart.findAll({
            where: { id: cartId },
            attributes: ['userId'],
            include: [
                {
                    model: db.Product,
                    attributes: [
                        'id',
                        'name',
                        'price',
                        'sale',
                        'image',
                        'price_current',
                        'background',
                        'quantity_current',
                        'quantity_sold',
                    ],
                    through: { attributes: ['quantity'] },
                },
            ],
        });
        return {
            EM: 'Get data success',
            EC: 0,
            DT: products,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "Something's wrong with services",
            EC: 1,
            DT: [],
        };
    }
};

const addToCart = async (data) => {
    try {
        if (!data.cartId || !data.productId || !data.quantity) {
            return {
                EM: 'Input is Empty',
                EC: 1,
                DT: [],
            };
        }
        let productCart = await db.Product_Cart.findOne({
            where: {
                [Op.and]: [{ cartId: data.cartId }, { productId: data.productId }],
            },
        });
        if (productCart) {
            await productCart.update({
                quantity: productCart.quantity + data.quantity,
            });
            return {
                EM: 'Update Quantity Product Success',
                EC: 0,
                DT: [],
            };
        }
        await db.Product_Cart.create({
            cartId: data.cartId,
            productId: data.productId,
            quantity: data.quantity,
        });
        return {
            EM: 'Create Cart Product Success',
            EC: 0,
            DT: [],
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "Something's wrong with services",
            EC: 1,
            DT: [],
        };
    }
};

module.exports = {
    createFunc,
    readFunc,
    addToCart,
    getAllProductByCartId,
};
