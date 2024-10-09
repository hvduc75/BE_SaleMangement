"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.ProductDetail, {
        foreignKey: 'productId'
      })
      Product.hasMany(models.ProductImage, {
        foreignKey: 'productId'
      })
      Product.belongsToMany(models.User, {
        through: "User_Product",
        foreignKey: 'productId'
      })
      Product.belongsTo(models.Category)
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      price: DataTypes.DECIMAL(15, 0),
      price_current: DataTypes.DECIMAL(15, 0),
      sale: DataTypes.INTEGER,
      image: DataTypes.BLOB('long'),
      background: DataTypes.BLOB('long'),
      quantity_current: DataTypes.INTEGER,
      quantity_sold: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
      orderId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
