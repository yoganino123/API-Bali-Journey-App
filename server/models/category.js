"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // ? asosiasi key ke table lain
      category.hasMany(models.destination, {
        foreignKey: "categoryId",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });
    }
  }
  category.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "category",
    }
  );
  return category;
};
