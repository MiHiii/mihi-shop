'use strict';

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';
// !dmbg
// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    privateKey: {
      type: String,
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    refreshTokensUsed: {
      type: Array,
      default: [],
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  },
);

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);
