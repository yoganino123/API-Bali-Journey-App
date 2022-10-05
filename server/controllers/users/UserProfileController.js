const { encryptPass } = require("../../helpers/bcrypt");
const { user, temp_image } = require("../../models");

class UserProfileController {
  static async getProfile(req, res) {
    try {
      const id = +req.user.id;
      let result = await user.findOne({ attributes: { exclude: ["createdAt", "updatedAt", "password"] }, where: { id } });
      let image = await temp_image.findOne({ where: { userId: result.id } });
      let data = { ...result.dataValues, img: image.img };
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async updateProfile(req, res) {
    try {
      const id = +req.user.id;
      const { name, email, password } = req.body;
      const dataUser = await user.findOne({ attributes: { exclude: ["createdAt", "updatedAt"] }, where: { id } });
      const valEmail = await user.findOne({ where: { email } });
      if (valEmail && dataUser.email !== email) {
        res.status(200).json({ msg: "Email already registered!" });
      } else {
        const encrPw = encryptPass(password);
        const result = await user.update({ name, email, password: encrPw }, { where: { id } });
        if (result[0] !== 0) {
          res.status(201).json({ message: `Successfully Updated!` });
        } else {
          res.status(404).json({ message: `Update Failed!` });
        }
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async updateProfilePicture(req, res) {
    try {
      const userId = +req.user.id;
      const img = req.file.path;
      await temp_image.update({ img }, { where: { userId } });
      await user.update({ img }, { where: { id: userId } });
      res.status(201).json({ msg: "Image successfully updated!" });
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

module.exports = UserProfileController;
