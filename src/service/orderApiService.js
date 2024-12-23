import db from '../models';
const { Op, literal } = require('sequelize');
const moment = require('moment-timezone');

const createOrder = async (data) => {
    try {
        if (!data.totalPrice || !data.userId || !data.products || !data.userInfoId) {
            return {
                EM: 'Error with empty Input',
                EC: 1,
                DT: '',
            };
        }

        // Lấy thời gian hiện tại theo múi giờ Việt Nam
        const vietnamDate = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
        const expiresAt = moment().tz('Asia/Ho_Chi_Minh').add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss');

        const order = await db.Order.create({
            order_date: vietnamDate,
            expires_at: expiresAt,
            userId: data.userId,
            total_price: data.totalPrice,
            userInfoId: data.userInfoId,
            payment_status: 0,
            payment_method: 'NCB',
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
            DT: order,
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

const updateFunc = async (orderId, paymentStatus, transactionId = null) => {
    console.log(orderId, transactionId, paymentStatus);
    try {
        if (!orderId || !paymentStatus) {
            return {
                EM: 'Missing required parameters',
                EC: 1,
                DT: '',
            };
        }

        // let orderStatus;
        // if (paymentStatus === 'success') {
        //     orderStatus = 'Đã Thanh Toán';
        // } else if (paymentStatus === 'failed') {
        //     orderStatus = 'Thanh Toán Thất Bại';
        // } else {
        //     return {
        //         EM: 'Invalid payment status',
        //         EC: 1,
        //         DT: '',
        //     };
        // }

        const updatedOrder = await db.Order.update(
            {
                payment_status: paymentStatus,
                order_status: 0,
                transactionID: transactionId,
                expires_at: null,
            },
            {
                where: {
                    id: orderId,
                },
            },
        );

        if (updatedOrder[0] === 0) {
            return {
                EM: 'Order not found or no changes made',
                EC: 1,
                DT: '',
            };
        }

        return {
            EM: 'Order updated successfully',
            EC: 0,
            DT: updatedOrder,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "Something's wrong with the service",
            EC: 1,
            DT: '',
        };
    }
};

// const createOrder = async (data) => {
//     try {
//         if (!data.totalPrice || !data.userId || !data.userInfoId) {
//             return {
//                 EM: 'Error with empty Input',
//                 EC: 1,
//                 DT: '',
//             };
//         }

//         const currentDate = new Date();
//         const vietnamDate = new Date(currentDate.getTime() + 7 * 60 * 60 * 1000); // Múi giờ Việt Nam
//         const expiresAt = new Date(vietnamDate.getTime() + 10 * 60 * 1000); // Thêm 10 phút

//         const order = await db.Order.create({
//             order_date: vietnamDate,
//             expires_at: expiresAt,
//             order_status: 'Chờ Thanh Toán',
//             userId: data.userId,
//             total_price: data.totalPrice,
//             userInfoId: data.userInfoId,
//         });

//         return {
//             EM: 'Create Order succeeds',
//             EC: 0,
//             DT: order,
//         };
//     } catch (error) {
//         console.log(error);
//         return {
//             EM: "Something's wrong with services",
//             EC: 1,
//             DT: [],
//         };
//     }
// };

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

const getOrdersByUserId = async (userId, condition) => {
    let orderStatus, paymentStatus;
    if (condition === 'Payment') {
        paymentStatus = 0;
    } else if (condition === 'All') {
        paymentStatus = { [Op.ne]: 0 };
    } else if (condition === 'Shipping') {
        orderStatus = 1;
    } else if (condition === 'Processing') {
        orderStatus = 0;
    } else if (condition === 'Delivered') {
        orderStatus = 2;
    } else if (condition === 'Canceled') {
        orderStatus = 3;
    }

    // Xây dựng điều kiện where
    let whereCondition = { userId: userId };

    if (orderStatus !== undefined) {
        whereCondition.order_status = orderStatus;
    }

    if (paymentStatus !== undefined) {
        whereCondition.payment_status = paymentStatus;
    }
    console.log(whereCondition);

    try {
        let orders = await db.Order.findAll({
            where: whereCondition,
            attributes: ['id', 'order_date', 'total_price', 'payment_method', 'order_status', 'payment_status'],
            include: [
                {
                    model: db.Product,
                    attributes: ['id', 'name', 'price', 'price_current', 'sale', 'quantity_current', 'image'],
                    through: { attributes: ['id', 'quantity', 'price', 'productId', 'orderId'] },
                },
            ],
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

const getAllOrderByCondition = async (page, limit, condition) => {
    try {
        let offset = (page - 1) * limit;
        let orderStatus, paymentStatus;
        if (condition === 'Payment') {
            paymentStatus = 0;
        } else if (condition === 'Shipping') {
            orderStatus = 1;
        } else if (condition === 'Processing') {
            orderStatus = 0;
        } else if (condition === 'Delivered') {
            orderStatus = 2;
        } else if (condition === 'Canceled') {
            orderStatus = 3;
        }

        let whereCondition = {};

        if (orderStatus !== undefined) {
            whereCondition.order_status = orderStatus;
        }

        if (paymentStatus !== undefined) {
            whereCondition.payment_status = paymentStatus;
        }

        const { count, rows } = await db.Order.findAndCountAll({
            where: whereCondition,
            offset: offset,
            limit: +limit,
            attributes: ['id', 'order_date', 'total_price', 'payment_method', 'order_status', 'payment_status'],
            include: [
                {
                    model: db.Product,
                    attributes: ['id', 'name', 'price', 'price_current', 'sale', 'quantity_current', 'image'],
                    through: { attributes: ['id', 'quantity', 'price', 'productId', 'orderId'] },
                },
            ],
            order: [['id', 'DESC']],
        });

        let totalPages = Math.ceil(count / +limit);
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

const getOrderDetail = async (orderId) => {
    if (!orderId) {
        return {
            EM: 'Error with empty Input',
            EC: 0,
            DT: '',
        };
    }

    try {
        let orders = await db.Order.findOne({
            where: { id: orderId },
            attributes: ['id', 'order_date', 'total_price', 'payment_method', 'order_status', 'payment_status'],
            include: [
                {
                    model: db.Product,
                    attributes: ['id', 'name', 'price', 'price_current', 'sale', 'quantity_current', 'image'],
                    through: { attributes: ['id', 'quantity', 'price', 'productId', 'orderId'] },
                },
                {
                    model: db.User_Infor,
                    attributes: ['id', 'province', 'district', 'commune', 'address'],
                },
            ],
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
                order_status: 1,
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

const cancelOrder = async (data) => {
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

        if (order.order_status !== 0) {
            let message = '';
            if (order.order_status === 1) {
                message = 'Orders in progress cannot be canceled';
            } else {
                message = 'Delivered orders cannot be canceled';
            }
            return {
                EM: message,
                EC: 1,
                DT: '',
            };
        }

        if (order) {
            await order.update({
                order_status: 3,
            });

            return {
                EM: 'Cancel order succeeds',
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

const checkRefundOrder = async (orderId) => {
    try {
        if (!orderId) {
            return {
                EM: 'Error with empty Input',
                EC: 1,
                DT: '',
            };
        }
        let order = await db.Order.findOne({
            where: {
                id: orderId,
            },
        });

        if (order) {
            let message = '';
            if (order.order_status !== 3) {
                message = 'Không thể hoàn tiền do đơn hàng chưa được hủy';
                return {
                    EM: message,
                    EC: 1,
                    DT: '',
                };
            }
    
            if (order.payment_status !== 1 || order.payment_method !== 'NCB') {
                message =
                    'Không thể hoàn tiền vì trạng thái thanh toán chưa hoàn tất hoặc phương thức thanh toán không hợp lệ';
                return {
                    EM: message,
                    EC: 1,
                    DT: '',
                };
            }

            return {
                EM: 'Order Valid',
                EC: 0,
                DT: '',
            };
        } else {
            return {
                EM: 'Order not found',
                EC: 1,
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

const refundOrder = async (orderId) => {
    try {
        if (!orderId) {
            return {
                EM: 'Error with empty Input',
                EC: 1,
                DT: '',
            };
        }
        let order = await db.Order.findOne({
            where: {
                id: orderId,
            },
        });

        if (order) {
            await order.update({
                payment_status: 2,
            });

            return {
                EM: 'Refund order succeeds',
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
    cancelOrder,
    refundOrder,
    getAllOrderInDay,
    getAllOrderInWeek,
    updateFunc,
    getAllOrderByCondition,
    getOrderDetail,
    checkRefundOrder
};
