'use strict';

const { model, Schema, Types } = require('mongoose'); // Erase if already required
const slugify = require('slugify');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Furniture'],
    },
    product_shop: { type: Types.ObjectId, ref: 'Shop', required: true },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    //more fields
    product_ratingsAvg: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
      set: (v) => Math.round(v * 10) / 10,
    },
    product_variations: { type: Array, default: [] },
    // không cần select ra thì không cần để tiền tố "product_"
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  },
);

//Create index for search
productSchema.index({ product_name: 'text', product_description: 'text' });

//Document middleware runs before .save() and .create()...
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

//define the product type = clothing

const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Types.ObjectId, ref: 'Shop', required: true },
  },
  {
    collection: 'clothes',
    timestamps: true,
  },
);

//define the product type = clothing

const electronicSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: Types.ObjectId, ref: 'Shop', required: true },
  },
  {
    collection: 'electronics',
    timestamps: true,
  },
);

const furnitureSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Types.ObjectId, ref: 'Shop', required: true },
  },
  {
    collection: 'furnitures',
    timestamps: true,
  },
);

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model('Clothing', clothingSchema),
  electronic: model('Electronics', electronicSchema),
  furniture: model('Furnitures', furnitureSchema),
};
