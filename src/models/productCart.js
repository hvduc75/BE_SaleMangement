'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product_Cart extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Product_Cart.belongsTo(models.Cart);
            Product_Cart.belongsTo(models.Product);
        }
    }
    Product_Cart.init(
        {
            quantity: DataTypes.INTEGER,
            cartId: DataTypes.INTEGER,
            productId: DataTypes.INTEGER,
            isChecked: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'Product_Cart',
        },
    );
    return Product_Cart;
};
