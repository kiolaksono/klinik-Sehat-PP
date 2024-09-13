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

    get formatDate() {
      const options = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
      }
      return this.dateOfConsul.toLocaleDateString('id-ID',options)
    }

  }
  Consultation.init({
    UserId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull:{
          msg:"Mohon Login terlebih dahulu!"
        },
        notEmpty:{
          msg:"Mohon Login terlebih dahulu!"
        }
      }
    },
    DoctorId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull:{
          msg:"Mohon pilih dokter terlebih dahulu!"
        },
        notEmpty:{
          msg:"Mohon pilih dokter terlebih dahulu!"
        }
      }
    },
    DeseaseId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull:{
          msg:"Dokter belum melakukan input data ke dalam sistem. Mohon Bersabar!"
        },
        notEmpty:{
          msg:"Dokter belum melakukan input data ke dalam sistem"
        }
      }
    },
    dateOfConsul: {
      type:DataTypes.DATE,
      allowNull:false,
      validate:{
        notNull:{
          msg:"Mohon pilih tanggal terlebih dahulu!"
        },
        notEmpty:{
          msg:"Mohon pilih tanggal terlebih dahulu!"
        },
      }
    },
    notes:{
      type:DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'Consultation',
  });

  Consultation.beforeValidate(async consul=>{
    consul.DeseaseId = Math.floor(Math.random() * 5)+1;
  })

  return Consultation;
};