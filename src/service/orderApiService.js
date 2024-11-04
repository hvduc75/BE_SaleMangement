import db from '../models';
const { Op, literal } = require('sequelize');

const createOrder = async (data) => {
    try {
        if (!data.totalPrice || !data.userId || !data.products || !data.transactionID || !data.userInfoId) {
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
                order_status: 'Chờ Xác Nhận',
                userId: data.userId,
                total_price: data.totalPrice,
                transactionID: data.transactionID,
                userInfoId: data.userInfoId,
            });

            const orderProducts = data.products.map((product) => ({
                orderId: order.id,
                productId: product.id,
                quantity: product.quantity,
                price: product.price,
            }));

            await db.Order_Product.bulkCreate(orderProducts);

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

const getOrdersByUserId = async (userId) => {
    try {
        let offset = (page - 1) * limit;
        const queryOptions = {
            offset: offset,
            limit: limit,
            attributes: ['id', 'order_date', 'delivery_date', 'receive_date', 'order_status', 'total_price'],
            order: [['id', 'DESC']],
        };

        // Kiểm tra nếu condition có giá trị hợp lệ thì thêm điều kiện vào where
        if (condition !== undefined && condition !== null) {
            queryOptions.where = { order_status: condition };
        }

        const { count, rows } = await db.Order.findAndCountAll(queryOptions);

        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            orders: rows,
        };

        return {
            EM: 'Ok',
            EC: 0,
            DT: data,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'somethings wrongs with services',
            EC: 1,
            DT: [],
        };
    }
};

const getAllOrderPaginate = async (page, limit, date = null) => {
    try {
        let offset = (page - 1) * limit;
        let whereCondition;
        if (date) {
            whereCondition = literal(`DATE(order_date) = '${date}'`);
        }

        const { count, rows } = await db.Order.findAndCountAll({
            where: whereCondition,
            offset: offset,
            limit: limit,
            attributes: ['id', 'order_date', 'delivery_date', 'receive_date', 'order_status', 'total_price'],
            order: [['id', 'DESC']],
        });

        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            orders: rows,
        };

        return {
            EM: 'Ok',
            EC: 0,
            DT: data,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'somethings wrongs with services',
            EC: 1,
            DT: [],
        };
    }
};

const getAllOrderConfirmPaginate = async (page, limit, condition, date = null) => {
    try {
        console.log(date, condition);
        let offset = (page - 1) * limit;

        const whereCondition = {
            order_status: condition,
        };

        if (date) {
            whereCondition[Op.and] = literal(`DATE(order_date) = '${date}'`);
        }

        const { count, rows } = await db.Order.findAndCountAll({
            where: whereCondition,
            offset: offset,
            limit: limit,
            attributes: ['id', 'order_date', 'delivery_date', 'receive_date', 'order_status', 'total_price'],
            order: [['id', 'DESC']],
        });

        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            orders: rows,
        };

        return {
            EM: 'Ok',
            EC: 0,
            DT: data,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'somethings wrongs with services',
            EC: 1,
            DT: [],
        };
    }
};

const confirmOrder = async (data) => {
    try {
        if (!data.id) {
            return {
                EM: 'Error with empty Input',
                EC: 1,
                DT: '',
            };
        }
        let order = await db.Order.findOne({
            where: {
                id: data.id,
            },
        });

        if (order) {
            await order.update({
                order_status: 'Đang Vận Chuyển',
                delivery_date: new Date(),
            });

            return {
                EM: 'Update order succeeds',
                EC: 0,
                DT: '',
            };
        } else {
            return {
                EM: 'Order not found',
                EC: 0,
                DT: '',
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'somethings wrongs with services',
            EC: 1,
            DT: [],
        };
    }
};

module.exports = {
    createOrder,
    createOrderDetail,
    getOrdersByUserId,
    getAllOrderPaginate,
    getAllOrderConfirmPaginate,
    confirmOrder,
};
