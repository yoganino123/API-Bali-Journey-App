"use strict";
const { encryptPass } = require("../helpers/bcrypt");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // ? asosiasi key ke table lain
      user.hasOne(models.temp_image, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      user.hasMany(models.review, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      user.hasMany(models.wishlist, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      user.hasMany(models.payment, {
        foreignKey: "userId",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });
    }
  }
  user.init(
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            message: "Name must not be empty!",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            message: "Email must not be empty!",
          },
        },
      },
      level: DataTypes.STRING,
      status: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      hooks: {
        beforeCreate: function (user, options) {
          user.password = encryptPass(user.password);
          user.level = user.level || "user";
          user.status = user.status || "active";
        },
      },
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
