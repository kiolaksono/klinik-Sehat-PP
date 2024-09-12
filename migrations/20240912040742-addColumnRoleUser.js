'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn('Users', 'role', Sequelize.STRING);

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'role');
  }
};
