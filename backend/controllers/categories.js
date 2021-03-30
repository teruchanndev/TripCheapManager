const Category = require("../models/category");

exports.createCategory = (req, res, next) => {
  const category = new Category({
    name: req.body.name,
    categoryItem: req.body.categoryItem
  });
  category.save().then(createCategory => {
    res.status(201).json({
      message: "Category added successfully",
      categoryId: createCategory._id
    });
  });
}

exports.updateCategory = (req, res, next) => {
  const category = new Category({
    _id: req.body.id,
    name: req.body.name,
    categoryItem: req.body.categoryItem
  });
  Category.updateOne({ _id: req.params.id }, category).then(result => {
    res.status(200).json({ message: "Update successful!" });
  });
}

exports.getAllCategory = (req, res, next) => {
  Category.find().then(documents => {
    res.status(200).json({
      message: "Category fetched successfully!",
      category: documents
    });
  });
}

exports.getOneCategory = (req, res, next) => {
  Category.findById(req.params.id).then(category => {
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: "Category not found!" });
    }
  });
}

exports.deleteCategoryItem = (req, res, next) => {
  Category.updateOne({ _id: req.params.id },{ $pullAll: { categoryItem : [req.params.ItemInCategoryItem]} }).then(result => {
    console.log(result);
    res.status(200).json({
       message: "Category service deleted!" ,
       result: result
      });
  });
}

exports.createCategoryItem = (req, res, next) => {
  Category.updateOne({_id: req.params.id}, { $push: {categoryItem: [req.body.ItemInCategoryItem]} }).then(
    result => {
      res.status(200).json({
        message: "Category service add successfully!" ,
        result: result
       });
    }
  )
}
