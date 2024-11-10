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
        let orders = await db.Order.findAll({
            where: { userId: userId },
            attributes: ["id", "order_date", "total_price"],
            include: [{
                model: db.Product,
                attributes: ['id', 'name', 'price', 'price_current', 'sale', 'quantity_current', 'image'],
                through: { attributes: ['id', "quantity", "price", "productId", "orderId"] },
            }],
            order: [['id', 'DESC']],
        });
        return {
            EM: 'Get Data succeeds',
            EC: 0,
            DT: orders,
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

const getAllOrderInDay = async () => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        let orders = await db.Order.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startOfDay, endOfDay], 
                },
            },
            attributes: ['id', 'order_date', 'delivery_date', 'receive_date', 'order_status', 'total_price'],
            order: [['id', 'DESC']],
            include: {
                model: db.User, 
                attributes: ['username'], 
            }
        });
        return {
            EM: 'Ok',
            EC: 0,
            DT: orders,
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

const getAllOrderInWeek = async (startDate) => {
    try {
        // Đặt lại thời gian cho ngày bắt đầu tuần
        const startOfWeek = new Date(startDate);
        startOfWeek.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00:00

        // Tính toán ngày kết thúc của tuần
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Tính 7 ngày tiếp theo (chủ nhật)
        endOfWeek.setHours(23, 59, 59, 999); // Đặt thời gian về 23:59:59

        // Truy vấn tất cả đơn hàng trong tuần này
        let orders = await db.Order.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startOfWeek, endOfWeek], // Lọc các đơn hàng trong khoảng thời gian này
                },
            },
            attributes: ['id', 'order_date', 'delivery_date', 'receive_date', 'order_status', 'total_price'],
            order: [['id', 'DESC']],
            include: {
                model: db.User, 
                attributes: ['username'], 
            },
        });

        return {
            EM: 'Ok',
            EC: 0,
            DT: orders,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something went wrong with services',
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
    getAllOrderInDay,
    getAllOrderInWeek
};
