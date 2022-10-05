const { temp_image, destination, package_trip, review } = require("../../models");

class TempImageController {
  static async getImagesByDest(req, res) {
    try {
      const id = +req.params.id;
      const valDest = await destination.findOne({ where: { id } });
      if (valDest) {
        let result = await temp_image.findAll({ attributes: ["id", "destinationId", "img"], where: { destinationId: id } });
        res.status(200).json(result);
      } else {
        res.status(404).json({ msg: "Destination not found!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async getImagesByPack(req, res) {
    try {
      const id = +req.params.id;
      const valDest = await package_trip.findOne({ where: { id } });
      if (valDest) {
        let result = await temp_image.findAll({
          attributes: ["id", "package_tripId", "img"],
          where: { package_tripId: id },
        });
        res.status(200).json(result);
      } else {
        res.status(404).json({ msg: "Package trip not found!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async addImgDest(req, res) {
    try {
      const id = +req.params.id;
      const img = req.file.path;
      const valDest = await destination.findOne({ where: { id } });
      if (valDest) {
        let result = await temp_image.create({ destinationId: id, img });
        res.status(201).json(result);
      } else {
        res.status(404).json({ msg: "Destination not found!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async addImgPack(req, res) {
    try {
      const id = +req.params.id;
      const img = req.file.path;
      const valPack = await package_trip.findOne({ where: { id } });
      if (valPack) {
        let result = await temp_image.create({ package_tripId: id, img });
        res.status(201).json(result);
      } else {
        res.status(404).json({ msg: "Package trip not found!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async addImgRevDest(req, res) {
    try {
      const id = +req.params.id;
      const img = req.file.path;
      const userId = req.user.id;
      const valRev = await review.findOne({ where: { id, userId } });
      if (valRev && valRev.package_tripId === null) {
        let result = await temp_image.create({ reviewId: id, img });
        res.status(201).json(result);
      } else {
        res.status(404).json({ msg: "Review not found!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async addImgRevPack(req, res) {
    try {
      const id = +req.params.id;
      const img = req.file.path;
      const userId = req.user.id;
      const valPack = await review.findOne({ where: { id, userId } });
      if (valPack && valPack.destinationId === null) {
        let result = await temp_image.create({ reviewId: id, img });
        res.status(201).json(result);
      } else {
        res.status(404).json({ msg: "Review not found!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async deleteImage(req, res) {
    try {
      const { id } = req.params;
      const result = await temp_image.destroy({ where: { id } });
      if (result !== 0) {
        res.status(200).json({ msg: `Image with id ${id} has been deleted` });
      } else {
        res.status(404).json({ msg: `Image not found!` });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
module.exports = TempImageController;
