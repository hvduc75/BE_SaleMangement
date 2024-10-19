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
            Order.hasOne(models.User_Infor, {
                foreignKey: 'orderId',
            });
        }
    }
    Order.init(
        {
            order_date: DataTypes.DATE,
            delivery_date: DataTypes.DATE,
            receive_date: DataTypes.DATE,
            total_price: DataTypes.DECIMAL(15, 0),
            note: DataTypes.STRING,
            transactionID: DataTypes.STRING,
            userId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Order',
        },
    );
    return Order;
};
