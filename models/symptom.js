'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Symptom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Symptom.belongsTo(models.Desease)
    }
  }
  Symptom.init({
    firstSymp: DataTypes.STRING,
    secondSymp: DataTypes.STRING,
    thirdSymp: DataTypes.STRING,
    fourthSymp: DataTypes.STRING,
    DeseaseId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Symptom',
  });
  return Symptom;
};