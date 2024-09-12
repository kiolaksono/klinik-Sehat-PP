'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = require('../data/doctor.json')
    .map(el => {

      el.createdAt = el.updatedAt = new Date();

      return el;
    })

   await queryInterface.bulkInsert('Doctors', data)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Doctors', null);
  }
};
