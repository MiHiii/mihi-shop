'use strict';

const { Types } = require('mongoose');
const discount = require('../discount.model');

const updateDiscountById = async ({ discountId, bodyUpdate, isNew = true }) => {
  return await discount.findByIdAndUpdate(discountId, bodyUpdate, {
    new: isNew,
  });
};

module.exports = {
  updateDiscountById,
};
