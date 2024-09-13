'use strict';
const {
  Model
} = require('sequelize');

const { hashPass } = require('../helpers/hash');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.UserProfile)
      User.hasMany(models.Consultation)
    }
  }
  User.init({
    username: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:{
          msg:"Mohon untuk masukkan Username dengan benar!"
        },
        notNull:{
          msg:"Mohon untuk masukkan Username dengan benar!"
        }
      }
    },
    password: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:{
          msg:"Mohon untuk masukkan Password dengan benar!"
        },
        notNull:{
          msg:"Mohon untuk masukkan Password dengan benar!"
        }
      }
    },
    email: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:{
          msg:"Mohon untuk masukkan Email dengan benar!"
        },
        notNull:{
          msg:"Mohon untuk masukkan Email dengan benar!"
        }
      }
    },
    role: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:{
          msg:"Mohon untuk masukkan role dengan benar!"
        },
        notNull:{
          msg:"Mohon untuk masukkan role dengan benar!"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeValidate(async user=>{
    user.role = "user"
  })

  User.beforeCreate(async (user) => {
    user.password = await hashPass(user.password);
  })

  return User;
};