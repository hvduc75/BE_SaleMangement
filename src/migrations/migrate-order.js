'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Order', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            order_date: {
                type: Sequelize.DATE,
            },
            delivery_date: {
                type: Sequelize.DATE,
            },
            order_status: {
                type: Sequelize.INTEGER,
            },
            receive_date: {
                type: Sequelize.DATE,
            },
            note: {
                type: Sequelize.STRING,
            },
            transactionID: {
                type: Sequelize.STRING,
            },
            payment_method: {
                type: Sequelize.STRING,
            },
            userId: {
                type: Sequelize.INTEGER,
            },
            userInfoId: {
                type: Sequelize.INTEGER,
            },
            total_Price: {
                type: Sequelize.DECIMAL(15, 0),
            },
            delivered_Image: {
              type: Sequelize.BLOB('long'),
            },
            expires_at: { 
                type: Sequelize.DATE,
                allowNull: true,
            },
            payment_status: {
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
        await queryInterface.dropTable('Order');
    },
};
