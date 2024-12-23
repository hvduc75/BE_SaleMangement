import cron from 'node-cron'; // Dùng 'import' thay vì 'require'
import db from '../models';

// Cron job chạy mỗi 10 phút
cron.schedule('*/10 * * * *', async () => {
    const now = new Date();
    console.log('Cron job đang chạy...');

    // Ví dụ cập nhật các đơn hàng quá hạn
    await db.Order.update(
        {
            order_status: 3,
            payment_status: 3,
            expires_at: null,
        },
        { where: { payment_status: 0, expires_at: { [db.Sequelize.Op.lt]: now } } },
    );
    console.log('Đơn hàng quá hạn đã bị hủy');
});
