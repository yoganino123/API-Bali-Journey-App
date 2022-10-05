const { destination, category, temp_image } = require("../../models");
class DestinationController {
  static async getDestination(req, res) {
    try {
      let result = [];

      let destinations = await destination.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [category],
      });

      for (let i in destinations) {
        const { id, name, categoryId, rating, description, address, open_day, open_time, map_link, category } =
          destinations[i];
        let destinationId = destinations[i].id;
        let images = await temp_image.findAll({ attributes: ["id", "destinationId", "img"], where: { destinationId } });
        let data = {
          id,
          name,
          categoryId,
          rating,
          description,
          address,
          open_day,
          open_time,
          map_link,
          category,
          images,
        };
        result.push(data);
      }

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async getDestinationId(req, res) {
    try {
      const { id } = req.params;
      let dataDestination = await destination.findOne({
        include: [category],
        where: { id },
      });
      if (dataDestination) {
        let images = await temp_image.findAll({
          attributes: ["id", "destinationId", "img"],
          where: { destinationId: dataDestination.id },
        });
        let data = { ...dataDestination.dataValues, images };
        res.status(200).json(data);
      } else {
        res.status(404).json({ msg: `Not found` });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async addDestination(req, res) {
    try {
      const { name, categoryId, description, address, open_day, open_time, map_link } = req.body;
      const img = req.file.path;
      let addDestination = await destination.create({
        name,
        categoryId,
        description,
        address,
        open_day,
        open_time,
        map_link,
      });
      await temp_image.create({ destinationId: addDestination.id, img });
      res.status(201).json(addDestination);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async deleteDestination(req, res) {
    try {
      const { id } = req.params;
      const result = await destination.destroy({ where: { id } });
      if (result !== 0) {
        res.status(200).json({ message: `Destination with id ${id} has been deleted` });
      } else {
        res.status(404).json({ message: `Destination can't be deleted` });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async updateDestination(req, res) {
    try {
      const { id } = req.params;
      const { name, categoryId, description, address, open_day, open_time, map_link } = req.body;
      const result = await destination.update(
        {
          name,
          categoryId,
          description,
          address,
          open_day,
          open_time,
          map_link,
        },
        { where: { id } }
      );
      if (result[0] !== 0) {
        res.status(200).json({ message: `Destination with id ${id} has been updated` });
      } else {
        res.status(404).json({ message: `Destination can't be updated` });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

module.exports = DestinationController;
