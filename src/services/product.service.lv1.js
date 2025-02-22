'use strict';

const { product, clothing, electronic } = require('../models/product.model');
const { BadRequestError, ForbiddenError } = require('../core/error.response');

//define Factory class to create product
class ProductFactory {
  /* 
    type: 'Clothing' | 'Electronics' | 'Furniture',
    payload 
  */
  //create product
  static async createProduct(type, payload) {
    switch (type) {
      case 'Clothing':
        return await new Clothing(payload).createProduct();
      case 'Electronics':
        return await new Electronics(payload).createProduct();
      case 'Furniture':
        return await new Furniture(payload).createProduct();
      default:
        throw new ForbiddenError(`Invalid product type ${type}`);
    }
  }
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
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing) {
      throw new BadRequestError('Failed to create clothing');
    }

    const newProduct = await super.createProduct();
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

module.exports = ProductFactory;
