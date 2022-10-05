"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class cart_item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // ? asosiasi primary key dari tabel lain
      cart_item.belongsTo(models.payment, {
        foreignKey: "paymentId",
      });
      cart_item.belongsTo(models.package_trip, {
        foreignKey: "package_tripId",
      });
    }
  }
  cart_item.init(
    {
      paymentId: DataTypes.INTEGER,
      date: DataTypes.STRING,
      package_tripId: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "cart_item",
    }
  );
  return cart_item;
};
