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

//remove empty value
const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] == null || obj[k] === '') {
      // Đúng logic
      delete obj[k];
    }
  });
  return obj;
};

//update nested object
const updateNestedObjectParser = (obj) => {
  console.log('[1]::', obj);
  const newObject = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const response = updateNestedObjectParser(obj[key]);
      Object.keys(response).forEach((k) => {
        newObject[`${key}.${k}`] = response[k];
      });
    } else {
      newObject[key] = obj[key];
    }
  });
  console.log('[2]::', newObject);
  return newObject;
};

module.exports = {
  getInfoData,
  getSelectData,
  getUnSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
};
