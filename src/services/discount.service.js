'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const { convertToObjectIdMongodb } = require('../utils');
const { updateDiscountById } = require('../models/repositories/discount.repo');
/* 
  Discount Service
  1 - Generate discount code [Shop | Admin]
  2 - Get discount amount [User]
  3 - Get all discounts code [User | Shop]
  4 - Verify discount code [User]
  5 - Delete discount code [Shop | Admin]
  6 - Cancel discount code [User]
*/

const discount = require('../models/discount.model');

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
    } = payload;

    console.log('Current Date:', new Date());
    console.log('Start Date:', new Date(start_date));
    console.log('End Date:', new Date(end_date));

    if (new Date() > new Date(end_date)) {
      throw new BadRequestError('Discount code has already expired');
    }

    if (new Date(start_date) > new Date(end_date)) {
      throw new BadRequestError('Start date must be less than end date');
    }

    // create index for discount code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount code already exists');
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_shopId: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids,
    });

    return newDiscount;
  }

  static updateDiscountCode(discountId, payload) {
    console.log('discountId:', discountId);
    console.log('payload:', payload);
    return updateDiscountById({ discountId, bodyUpdate: payload });
  }
}

module.exports = DiscountService;
