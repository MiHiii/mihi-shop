const express = require('express');
const compression = require('compression');
const { default: helmet } = require('helmet');
const app = express();
const morgan = require('morgan');

//init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

//init db

//int routes
app.get('/', (req, res, next) => {
  return res.status(200).json({
    message: 'Welcome to the API',
  });
});
//handling errors

module.exports = app;
