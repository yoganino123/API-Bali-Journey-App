"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // ? asosiasi primary key dari tabel lain
      wishlist.belongsTo(models.user, {
        foreignKey: "userId",
      });
      wishlist.belongsTo(models.package_trip, {
        foreignKey: "package_tripId",
      });
      wishlist.belongsTo(models.destination, {
        foreignKey: "destinationId",
      });
    }
  }
  wishlist.init(
    {
      userId: DataTypes.INTEGER,
      destinationId: DataTypes.INTEGER,
      package_tripId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "wishlist",
    }
  );
  return wishlist;
};
