'use strict';

const mongoose = require('mongoose');

const connectString = 'mongodb://localhost:27019/mihi-shop';

mongoose
  .connect(connectString)
  .then((result) => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

//dev
if (1 === 1) {
  mongoose.set('debug', true);
  mongoose.set('debug', { color: true });
}

module.exports = mongoose;
