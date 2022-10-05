"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tour_package extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // ? asosiasi primary key dari tabel lain
      tour_package.belongsTo(models.package_trip, {
        foreignKey: "package_tripId",
      });
      tour_package.belongsTo(models.destination, {
        foreignKey: "destinationId",
      });
    }
  }
  tour_package.init(
    {
      package_tripId: DataTypes.INTEGER,
      destinationId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "tour_package",
    }
  );
  return tour_package;
};
