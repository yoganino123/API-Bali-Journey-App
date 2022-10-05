"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // ? asosiasi key ke table lain
      payment.hasMany(models.cart_item, {
        foreignKey: "paymentId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      // ? asosiasi primary key dari tabel lain
      payment.belongsTo(models.user, {
        foreignKey: "userId",
      });
    }
  }
  payment.init(
    {
      userId: DataTypes.INTEGER,
      payment_code: DataTypes.STRING,
      total: DataTypes.BIGINT,
      status: DataTypes.STRING,
      responseMidtrans: DataTypes.TEXT,
    },
    {
      hooks: {
        beforeCreate: (payment, options) => {
          payment.responseMidtrans = null;
        },
      },
      sequelize,
      modelName: "payment",
    }
  );
  return payment;
};
