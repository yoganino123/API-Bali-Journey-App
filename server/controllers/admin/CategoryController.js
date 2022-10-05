const { category } = require("../../models");

class CategoryController {
  static async getCategory(req, res) {
    try {
      let result = await category.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] } });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async getCategoryId(req, res) {
    try {
      const { id } = req.params;
      const result = await category.findOne({ attributes: { exclude: ["createdAt", "updatedAt"] }, where: { id } });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async addCategory(req, res) {
    try {
      const { name } = req.body;
      const valName = await category.findOne({ where: { name } });
      if (valName) {
        res.status(404).json({ message: `Category already exist!` });
      } else {
        let addCategory = await category.create({ name });
        res.status(201).json(addCategory);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      const result = await category.destroy({ where: { id } });
      if (result !== 0) {
        res.status(200).json({ message: `Category with id ${id} has been deleted` });
      } else {
        res.status(404).json({ message: `Category can't be deleted` });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const categoryOld = await category.findOne({ where: { id } });
      const valName = await category.findOne({ where: { name } });
      if (valName && categoryOld.name !== name) {
        res.status(404).json({ message: `Category already exist!` });
      } else {
        const result = await category.update({ name }, { where: { id } });
        if (result[0] !== 0) {
          res.status(200).json({ message: `Category with id ${id} has been updated` });
        } else {
          res.status(404).json({ message: `Category can't be updated` });
        }
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

module.exports = CategoryController;
