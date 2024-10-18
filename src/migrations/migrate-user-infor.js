'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('user_infor', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            province: {
                type: Sequelize.STRING,
            },
            district: {
                type: Sequelize.STRING,
            },
            commune: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
            },
            typeAddress: {
                type: Sequelize.STRING,
            },
            isDefault: {
                type: Sequelize.BOOLEAN,
            },
            orderId: {
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.INTEGER,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('user_infor');
    },
};
