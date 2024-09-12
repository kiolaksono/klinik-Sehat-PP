'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Consultation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Consultation.belongsTo(models.User)
      Consultation.belongsTo(models.Desease)
      Consultation.belongsTo(models.Doctor)
    }
  }
  Consultation.init({
    UserId: DataTypes.INTEGER,
    DoctorId: DataTypes.INTEGER,
    DeseaseId: DataTypes.INTEGER,
    dateOfConsul: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Consultation',
  });
  return Consultation;
};