const mongoose = require('mongoose');
const Products = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const productsEntity = await Products.find({subcategory: subcategory});
  const productsDTO = productsEntity.map(mapProduct);

  ctx.body = {
    products: productsDTO,
  };
};

module.exports.productList = async function productList(ctx, next) {
  const productsEntity = await Products.find({});
  const productsDTO = productsEntity.map(mapProduct);

  ctx.body = {
    products: productsDTO,
  };
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.throw(400, 'invalid id');
  }

  const productEntity = await Products.findById(id);
  if (!productEntity) {
    ctx.throw(404, 'product not found');
  }

  const productDTO = mapProduct(productEntity);

  ctx.body = {
    product: productDTO,
  };
};

