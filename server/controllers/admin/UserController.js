const { user, temp_image } = require("../../models");

class UserController {
  static async getUser(req, res) {
    try {
      let users = await user.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] } });
      let data = [];
      for (let i in users) {
        let image = await temp_image.findOne({ where: { userId: users[i].id } });
        data.push({ ...users[i].dataValues, img: image.img });
      }
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async getUserByStatus(req, res) {
    try {
      const { status } = req.query;
      let users = await user.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] }, where: { status } });
      let data = [];
      for (let i in users) {
        let image = await temp_image.findOne({ where: { userId: users[i].id } });
        data.push({ ...users[i].dataValues, img: image.img });
      }
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async getUserId(req, res) {
    try {
      const id = +req.params.id;
      let getUser = await user.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { id },
      });
      if (getUser) {
        let image = await temp_image.findOne({ where: { userId: getUser.id } });
        let data = { ...getUser.dataValues, img: image.img };
        res.status(200).json(data);
      } else {
        res.status(404).json({ msg: `Not found` });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async addUser(req, res) {
    try {
      const { name, email, password } = req.body;
      const valEmail = await user.findOne({ where: { email } });
      if (valEmail) {
        res.status(200).json({ msg: `Email sudah terdaftar!` });
      } else {
        const addUser = await user.create({ name, email, password });
        await temp_image.create({ userId: addUser.id, img: "images/default-profil.jpg" });
        res.status(201).json(addUser);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async deleteUser(req, res) {
    try {
      const id = +req.params.id;
      const delUser = await user.destroy({ where: { id } });
      delUser === 1 ? res.status(200).json(`User with id ${id} Deleted!`) : res.status(404).json({ msg: "User Not found!" });
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async updateUser(req, res) {
    try {
      const id = +req.params.id;
      const { level, status } = req.body;
      const updUser = await user.update({ level, status }, { where: { id } });
      updUser[0] === 1
        ? res.status(200).json(`User with id ${id} Updated!`)
        : res.status(404).json(`User with id ${id} Not found!`);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

module.exports = UserController;
