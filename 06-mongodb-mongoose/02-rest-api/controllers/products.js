const {default: mongoose} = require('mongoose');
const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const products = await Product.find({subcategory});
  ctx.body = {products};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({});
  ctx.body = {products};
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;

  try {
    if (!mongoose.isValidObjectId(id)) throw new Error('Invalid ID');

    const product = await Product.findById(id);

    if (!product) throw new Error('Not found');

    ctx.body = {product};
  } catch (error) {
    switch (error.message) {
      case 'Invalid ID':
        ctx.throw(400);
        break;
      case 'Not found':
        ctx.throw(404);
        break;
      default:
        ctx.throw(500);
        break;
    }
    return next();
  }
};

