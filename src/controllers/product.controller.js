'use strict';
const ProductService = require('../services/product.service');
const { SuccessResponse } = require('../core/success.response');

class ProductController {
  createProduct = async (req, res, next) => {
    // console.log(req.user);

    new SuccessResponse({
      message: 'Create product success',
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  //QUERY//
  /**
   * @desc Get all Draft for shop
   * @param {Number} limit
   * @param {Number} skip
   * @param {JSON}
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list Draft success!',
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  //END  QUERY//
}

module.exports = new ProductController();
