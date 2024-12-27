'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Order.belongsToMany(models.Product, {
                through: models.Order_Product,
                foreignKey: 'orderId',
            });
            Order.hasMany(models.Order_Product, {
                foreignKey: 'orderId',
            });
            Order.belongsTo(models.User),
                Order.belongsTo(models.User_Infor, {
                    foreignKey: 'userInfoId',
                });
        }
    }
    Order.init(
        {
            order_date: DataTypes.DATE,
            delivery_date: DataTypes.DATE,
            order_status: DataTypes.INTEGER, // 0: Processing, 1: Shipping, 2: Delivered, 3: Canceled
            receive_date: DataTypes.DATE,
            total_price: DataTypes.DECIMAL(15, 0),
            note: DataTypes.STRING,
            transactionID: DataTypes.STRING,
            payment_method: DataTypes.STRING,
            userId: DataTypes.INTEGER,
            userInfoId: DataTypes.INTEGER,
            delivered_Image: DataTypes.BLOB('long'),
            expires_at: DataTypes.DATE,
            payment_status: DataTypes.INTEGER, // 0: Pending, 1: completed, 2: Refunded, 3: canceled
        },
        {
            sequelize,
            modelName: 'Order',
        },
    );
    return Order;
};
