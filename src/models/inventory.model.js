'use strict';

const { model, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventorys';

// Declare the Schema of the Mongo model
var inventorySchema = new Schema(
  {
    inven_productId: {
      type: Types.ObjectId,
      ref: 'Product',
    },
    inven_location: {
      type: String,
      default: 'unknown',
    },
    inven_stock: {
      type: Number,
      required: true,
    },
    inven_shopId: {
      type: Types.ObjectId,
      ref: 'Shop',
    },
    inven_reservation: {
      type: Array,
      default: [],
    }, //Dat hang truoc
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

//Export the model
module.exports = model(DOCUMENT_NAME, inventorySchema);
