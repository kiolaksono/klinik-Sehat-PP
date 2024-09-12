'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Consultations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER,
        references:{
          model:"Users",
          key:"id"
        }
      },
      DoctorId: {
        type: Sequelize.INTEGER,
        references:{
          model:"Doctors",
          key:"id"
        }
      },
      DeseaseId: {
        type: Sequelize.INTEGER,
        references:{
          model:"Deseases",
          key:"id"
        }
      },
      dateOfConsul: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Consultations');
  }
};