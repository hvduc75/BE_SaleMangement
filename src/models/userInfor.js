"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_Infor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User_Infor.belongsTo(models.User);
      User_Infor.belongsTo(models.Order);
    }
  }
  User_Infor.init(
    {
      province: DataTypes.STRING,
      district: DataTypes.STRING,
      commune: DataTypes.STRING,
      address: DataTypes.STRING,
      typeAddress: DataTypes.STRING,
      orderId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "User_Infor",
    }
  );
  return User_Infor;
};
