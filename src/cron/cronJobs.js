const cron = require('node-cron');
const db = require('../models'); 
const { Op } = require('sequelize');

cron.schedule('*/10 * * * *', async () => {
    const now = new Date();
    console.log('🔄 Cron job đang chạy...');

    try {
        // Lấy danh sách các đơn hàng hết hạn
        const expiredOrders = await db.Order.findAll({
            where: {
                payment_status: 0,
                expires_at: { [Op.lt]: now },
            },
            include: [{
                model: db.Order_Product,
            }],
        });

        if (!expiredOrders || expiredOrders.length === 0) {
            console.log('Không có đơn hàng nào hết hạn.');
            return;
        }

        // Lặp qua từng đơn hàng
        for (const order of expiredOrders) {
            if (!order.Order_Products || order.Order_Products.length === 0) {
                console.log(`Đơn hàng ${order.id} không có sản phẩm nào.`);
                continue;
            }

            // Lặp qua từng sản phẩm trong đơn hàng
            for (const orderProduct of order.Order_Products) {
                const { productId, quantity } = orderProduct;

                // Cập nhật lại số lượng sản phẩm
                const product = await db.Product.findByPk(productId);
                if (product) {
                    await product.update({
                        quantity_current: product.quantity_current + quantity,
                        quantity_sold: product.quantity_sold - quantity,
                    });
                }
            }

            // Cập nhật trạng thái đơn hàng
            await order.update({
                order_status: 3, // Đã hủy
                payment_status: 3, // Thanh toán thất bại
                expires_at: null,
            });

            console.log(`Đơn hàng ${order.id} đã được hủy và cập nhật số lượng sản phẩm.`);
        }

        console.log('Cron job đã hoàn tất!');
    } catch (error) {
        console.error('Lỗi khi chạy cron job:', error);
    }
});
