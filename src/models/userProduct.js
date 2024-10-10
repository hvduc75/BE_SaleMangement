"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User_Product.belongsTo(models.User, { foreignKey: "userId" });
      User_Product.belongsTo(models.Product, { foreignKey: "productId" });
    }
  }
  User_Product.init(
    {
      productId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      viewNum: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User_Product",
    }
  );
  return User_Product;
};
