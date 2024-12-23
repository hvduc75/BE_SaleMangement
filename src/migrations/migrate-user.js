'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('User', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            username: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
            },
            sex: {
                type: Sequelize.INTEGER,
            },
            birthDay: {
                type: Sequelize.DATE,
            },
            phone: {
                type: Sequelize.STRING,
            },
            avatar: {
                type: Sequelize.BLOB('long'),
            },
            groupId: {
                type: Sequelize.INTEGER,
            },
            refresh_token: {
                type: Sequelize.STRING,
            },
            refresh_expired: {
                type: Sequelize.DATE,
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
        await queryInterface.dropTable('User');
    },
};
