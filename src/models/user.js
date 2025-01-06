'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.belongsToMany(models.Product, {
                through: models.User_Product,
                foreignKey: 'userId',
            });
            User.hasMany(models.User_Product, {
                foreignKey: 'userId',
            });
            User.belongsTo(models.Group);
            User.hasOne(models.Cart, {
                foreignKey: 'userId',
            });
            User.hasMany(models.User_Infor, {
                foreignKey: 'userId',
            });
            User.hasMany(models.Order, {
                foreignKey: 'userId',
            });
        }
    }
    User.init(
        {
            username: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            type: { type: DataTypes.STRING, defaultValue: 'LOCAL' },
            address: DataTypes.STRING,
            sex: DataTypes.INTEGER,
            birthDay: DataTypes.DATE,
            phone: DataTypes.STRING,
            avatar: DataTypes.BLOB('long'),
            groupId: DataTypes.INTEGER,
            refresh_token: DataTypes.TEXT,
            refresh_expired: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'User',
        },
    );
    return User;
};
