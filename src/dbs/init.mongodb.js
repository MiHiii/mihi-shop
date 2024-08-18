'use strict';

const mongoose = require('mongoose');
const {
  db: { host, name, port, user, password },
} = require('../configs/config.mongodb');

const connectString = `mongodb://${user}:${password}@${host}:${port}/${name}?authSource=admin`;
// console.log(connectString);

const { countConnect } = require('../helper/check.connect');

class Database {
  constructor() {
    this.connect();
  }

  //connect to the database
  connect(type = 'mongodb') {
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }
    mongoose
      .connect(connectString, { maxPoolSize: 50 })
      .then((result) => {
        console.log('Connected to MongoDB');
        countConnect();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // Đóng kết nối cơ sở dữ liệu
  async close() {
    try {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    } catch (err) {
      console.error('Error while disconnecting from MongoDB', err);
    }
  }

  static getInsatnce() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInsatnce();

module.exports = instanceMongodb;
