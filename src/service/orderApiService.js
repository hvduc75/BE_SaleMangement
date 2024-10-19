import db from '../models';
import { Op } from 'sequelize';

const createOrder = async (data) => {
    try {
        if (!data.totalPrice || !data.userId || !data.products || !data.transactionID) {
            return {
                EM: 'Error with empty Input',
                EC: 1,
                DT: '',
            };
        }
        const checkTransactionID = await db.Order.findOne({
            where: { transactionID: data.transactionID },
        });

        if (checkTransactionID) {
            return {
                EM: 'TransactionID existed',
                EC: 1,
                DT: '',
            };
        } else {
            const currentDate = new Date();
            const order = await db.Order.create({
                order_date: currentDate,
                userId: data.userId,
                total_price: data.totalPrice,
                transactionID: data.transactionID,
            });

            const orderProducts = data.products.map((product) => ({
                orderId: order.id,
                productId: product.id,
                quantity: product.quantity,
                price: product.price,
            }));

            await db.Order_Product.bulkCreate(orderProducts);

            let userInfo = await db.User_Infor.findone({
                where: { [Op.and]: [{ userId: data.userId }, { isDefault: true }] },
            });

            if (userInfo) {
                await userInfo.update({
                    orderId: order.id,
                });
            }

            return {
                EM: 'Create Order succeeds',
                EC: 0,
                DT: '',
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: "Something's wrong with services",
            EC: 1,
            DT: [],
        };
    }
};

const createOrderDetail = async (data) => {
    try {
        if (!data.totalPrice || !data.userId) {
            return {
                EM: 'Error with empty Input',
                EC: 1,
                DT: '',
            };
        }
        const currentDate = new Date();
        await db.Order.create({
            order_date: currentDate,
            userId: data.userId,
            total_price: data.totalPrice,
        });

        return {
            EM: 'Create Order succeeds',
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

module.exports = {
    createOrder,
    createOrderDetail,
};
