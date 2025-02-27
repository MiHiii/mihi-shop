const inventory = require('../inventory.model');
const { Types } = require('mongoose');

const createInventory = async ({
  productId,
  shopId,
  stock,
  location = 'unknown',
}) => {
  // console.log('createInventory received:', { productId, shopId, stock }); // Debug
  // // Kiểm tra nếu productId và shopId không phải là ObjectId hợp lệ
  // if (!Types.ObjectId.isValid(productId)) {
  //   throw new Error(`Invalid productId: ${productId}`);
  // }
  // if (!Types.ObjectId.isValid(shopId)) {
  //   throw new Error(`Invalid shopId: ${shopId}`);
  // }

  return await inventory.create({
    inven_productId: new Types.ObjectId(productId),
    inven_shopId: new Types.ObjectId(shopId),
    inven_stock: stock,
    inven_location: location,
  });
};

module.exports = {
  createInventory,
};
