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
      User_Infor.hasMany(models.Order, {
        foreignKey: 'userInfoId',
      });
    }
  }
  User_Infor.init(
    {
      province: DataTypes.STRING,
      district: DataTypes.STRING,
      commune: DataTypes.STRING,
      address: DataTypes.STRING,
      typeAddress: DataTypes.STRING,
      userName: DataTypes.STRING,
      phone: DataTypes.STRING,
      isDefault: DataTypes.BOOLEAN,
      isDeleted: DataTypes.BOOLEAN,
      userId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "User_Infor",
    }
  );
  return User_Infor;
};
