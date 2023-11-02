const Category = require('../models/Category');
const mapCategory = require('../mappers/category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categoriesEntity = await Category.find({});
  const categoriesDTO = categoriesEntity.map(mapCategory);

  ctx.body = {
    categories: categoriesDTO,
  };
};
