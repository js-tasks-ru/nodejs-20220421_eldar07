const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find({}).populate('subcategories');
  ctx.body = {categories};
};
