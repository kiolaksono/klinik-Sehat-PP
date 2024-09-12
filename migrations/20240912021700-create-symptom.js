'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Symptoms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstSymp: {
        type: Sequelize.STRING
      },
      secondSymp: {
        type: Sequelize.STRING
      },
      thirdSymp: {
        type: Sequelize.STRING
      },
      fourthSymp: {
        type: Sequelize.STRING
      },
      DeseaseId: {
        type: Sequelize.INTEGER,
        references:{
          model:"Deseases",
          key:"id"
        }
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Symptoms');
  }
};