"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class temp_image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // ? asosiasi primary key dari tabel lain
      temp_image.belongsTo(models.user, {
        foreignKey: "userId",
      });
      temp_image.belongsTo(models.review, {
        foreignKey: "reviewId",
      });
      temp_image.belongsTo(models.destination, {
        foreignKey: "destinationId",
      });
      temp_image.belongsTo(models.package_trip, {
        foreignKey: "package_tripId",
      });
    }
  }
  temp_image.init(
    {
      userId: DataTypes.INTEGER,
      destinationId: DataTypes.INTEGER,
      package_tripId: DataTypes.INTEGER,
      reviewId: DataTypes.INTEGER,
      img: DataTypes.STRING,
    },
    {
      hooks: {
        beforeCreate: (temp_image, options) => {
          temp_image.userId = temp_image.userId || null;
          temp_image.destinationId = temp_image.destinationId || null;
          temp_image.package_tripId = temp_image.package_tripId || null;
          temp_image.reviewId = temp_image.reviewId || null;
        },
      },
      sequelize,
      modelName: "temp_image",
    }
  );
  return temp_image;
};
