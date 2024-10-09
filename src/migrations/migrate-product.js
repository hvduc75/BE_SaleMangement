'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Product', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DECIMAL(15,0)
      },
      price_current: {
        type: Sequelize.DECIMAL(15,0)
      },
      sale: {
        type: Sequelize.INTEGER
      },
      image: {
        type: Sequelize.BLOB('long'),
      },
      background: {
        type: Sequelize.BLOB('long'),
      },
      quantity_current: {
        type: Sequelize.INTEGER
      },
      quantity_sold: {
        type: Sequelize.INTEGER
      },
      categoryId: {
        type: Sequelize.INTEGER
      },
      orderId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Product');
  }
};