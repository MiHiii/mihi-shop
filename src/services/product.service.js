'use strict';

const {
  product,
  clothing,
  electronic,
  furniture,
} = require('../models/product.model');
const { BadRequestError, ForbiddenError } = require('../core/error.response');
const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require('../models/repositories/product.repo');
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils');
const { createInventory } = require('../models/repositories/inventory.repo');

//define Factory class to create product
class ProductFactory {
  /* 
    type: 'Clothing' | 'Electronics' | 'Furniture',
    payload 
  */

  static productRegistry = {}; //key - class

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  //create product
  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new ForbiddenError(`Invalid product type ${type}`);

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new ForbiddenError(`Invalid product type ${type}`);

    return new productClass(payload).updateProduct(productId);
  }

  /// PUT ///
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }
  ///END PUT ///

  //QUERY//
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }

  static async searchProducts({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ['product_name', 'product_price', 'product_thumb'],
    });
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ['__v'] });
  }
  //END QUERY//
}

//define base product class

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_type,
    product_shop,
    product_quantity,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_quantity = product_quantity;
    this.product_attributes = product_attributes;
  }

  //create product
  async createProduct(product_id) {
    // console.log('product_id received:', product_id); // Debug
    const newProduct = await product.create({ ...this, _id: product_id });
    if (newProduct) {
      // console.log('newProduct._id:', newProduct._id); // Debug
      await createInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
    }
    return newProduct;
  }
  // update product
  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({ productId, bodyUpdate, model: product });
  }
}

//Define sub-class for different product types Clothing
class Clothing extends Product {
  //create product
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) {
      throw new BadRequestError('Failed to create clothing');
    }

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new BadRequestError('Failed to create product');
    }

    return newProduct;
  }

  //update product
  async updateProduct(productId) {
    /* 
    {
      a: undefined,
      b: null
    }
    */
    // #1 remove all undefined and null values
    const objectParams = removeUndefinedObject(this);
    // #2 check value update
    if (objectParams.product_attributes) {
      // #3 update child element
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: clothing,
      });
    }

    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams),
    );
    return updateProduct;
  }
}

//Define sub-class for different product types Electronics
class Electronics extends Product {
  //create product
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) {
      throw new BadRequestError('Failed to create electronic');
    }

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError('Failed to create product');
    }

    return newProduct;
  }
}

//Define sub-class for different product types Electronics
class Furniture extends Product {
  //create product
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) {
      throw new BadRequestError('Failed to create furnitiure');
    }

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) {
      throw new BadRequestError('Failed to create product');
    }

    return newProduct;
  }
}

//register product type
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Furniture', Furniture);

// ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
