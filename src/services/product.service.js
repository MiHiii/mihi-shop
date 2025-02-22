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
} = require('../models/repositories/product.repo');

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

  /// PUT ///
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
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
    return await product.create({ ...this, _id: product_id });
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
