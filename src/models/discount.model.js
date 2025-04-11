'use strict';

const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts';

// Declare the Schema of the Mongo model
var apiKeySchema = new Schema(
  {
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: 'fixed_amount' }, // percentage, fixed_amount
    discount_value: { type: Number, required: true }, // 10000, 10%
    discount_code: { type: String, required: true },
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    discount_max_uses: { type: Number, required: true }, //số lần sử dụng tối đa
    discount_uses_count: { type: Number, required: true }, //số lần đã sử dụng
    discount_users_used: { type: Array, default: [] }, //mảng chứa id của user đã sử dụng
    discount_max_uses_per_user: { type: Number, required: true }, //số lần sử dụng tối đa của 1 user
    discount_min_order_value: { type: Number, required: true }, //giá trị đơn hàng tối thiểu để sử dụng mã
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    discount_is_active: { type: Boolean, default: true }, //active, inactive
    discount_applies_to: {
      type: String,
      required: true,
      enum: ['all', 'specific'],
    }, // all, specific_products
    discount_product_ids: { type: Array, default: [] }, //mảng chứa id của product
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

//Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema);
