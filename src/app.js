const express = require('express');
const compression = require('compression');
const { default: helmet } = require('helmet');
const app = express();
const morgan = require('morgan');
require('dotenv').config();

//init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//init db
require('./dbs/init.mongodb');
const { checkOverload } = require('./helper/check.connect');
// checkOverload();

//int routes
app.use('/', require('./routes'));

//handling errors
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  return next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error',
  });
});

module.exports = app;
