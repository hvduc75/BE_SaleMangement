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
      // define association here
    }
  }
  User_Product.init(
    {
      productId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      watched: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: "User_Product",
    }
  );
  return User_Product;
};
