const express = require("express");

const CategoriesController = require('../controllers/categories');
const router = express.Router();

//create 1 category
router.post("", CategoriesController.createCategory);

//update
router.put("/:id", CategoriesController.updateCategory);

//lấy danh sách category
router.get("", CategoriesController.getAllCategory);

router.get("/:id", CategoriesController.getOneCategory);


//xóa 1 phần tử trong mảng categoryItem
router.delete("/:id/:ItemInCategoryItem", CategoriesController.deleteCategoryItem );

//thêm 1 phần tử vào mảng categoryItem
router.post("/:id", CategoriesController.createCategoryItem);

module.exports = router;
