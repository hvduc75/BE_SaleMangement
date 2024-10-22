import db from '../models';

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

module.exports = {
    createOrder,
    createOrderDetail,
    getOrdersByUserId,
};
