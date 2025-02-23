'use strict';

const _ = require('lodash');

const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};

//['a', 'b', 'c'] => { a: 1, b: 1, c: 1 }
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 1]));
};

//['a', 'b', 'c'] => { a: 0, b: 0, c: 0 }
const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 0]));
};

module.exports = {
  getInfoData,
  getSelectData,
  getUnSelectData,
};
