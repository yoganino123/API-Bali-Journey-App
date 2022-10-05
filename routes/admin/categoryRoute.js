const categoryRoutes = require("express").Router();
const { CategoryController } = require("../../controllers");

categoryRoutes.get("/", CategoryController.getCategory);
categoryRoutes.get("/:id", CategoryController.getCategoryId);
categoryRoutes.post("/", CategoryController.addCategory);
categoryRoutes.delete("/:id", CategoryController.deleteCategory);
categoryRoutes.put("/:id", CategoryController.updateCategory);

module.exports = categoryRoutes;
