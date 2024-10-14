'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Cart.belongsTo(models.User);
            Cart.belongsToMany(models.Product, {
                through: models.Product_Cart,
                foreignKey: 'cartId',
            });
            Cart.hasMany(models.Product_Cart, {
                foreignKey: 'cartId',
            });
        }
    }
    Cart.init(
        {
            userId: DataTypes.INTEGER,
            totalPrice: DataTypes.DECIMAL(15, 0),
        },
        {
            sequelize,
            modelName: 'Cart',
        },
    );
    return Cart;
};
