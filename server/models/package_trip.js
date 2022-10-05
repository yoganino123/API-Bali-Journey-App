"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class package_trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // ? asosiasi key ke table lain
      package_trip.hasMany(models.temp_image, {
        foreignKey: "package_tripId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      package_trip.hasMany(models.review, {
        foreignKey: "package_tripId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      package_trip.hasMany(models.wishlist, {
        foreignKey: "package_tripId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      package_trip.hasMany(models.tour_package, {
        foreignKey: "package_tripId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      package_trip.hasMany(models.cart_item, {
        foreignKey: "package_tripId",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });
    }
  }
  package_trip.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.BIGINT,
      rating: DataTypes.FLOAT,
    },
    {
      hooks: {
        beforeCreate: (package_trip, options) => {
          package_trip.rating = 0;
        },
      },
      sequelize,
      modelName: "package_trip",
    }
  );
  return package_trip;
};
