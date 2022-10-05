"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class destination extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // ? asosiasi key ke table lain
      destination.hasMany(models.review, {
        foreignKey: "destinationId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      destination.hasMany(models.wishlist, {
        foreignKey: "destinationId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      destination.hasMany(models.temp_image, {
        foreignKey: "destinationId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      destination.hasMany(models.tour_package, {
        foreignKey: "destinationId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      // ? asosiasi primary key dari tabel lain
      destination.belongsTo(models.category, {
        foreignKey: "categoryId",
      });
    }
  }
  destination.init(
    {
      name: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
      rating: DataTypes.FLOAT,
      description: DataTypes.TEXT,
      address: DataTypes.STRING,
      open_day: DataTypes.STRING,
      open_time: DataTypes.STRING,
      map_link: DataTypes.STRING,
    },
    {
      hooks: {
        beforeCreate: (destination, options) => {
          destination.rating = 0;
        },
      },
      sequelize,
      modelName: "destination",
    }
  );
  return destination;
};
