'use strict';

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

const _SECONDS = 5000;

//count connection
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log('Number of connection: ', numConnection);
};

//check overload
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    //Ex max 5 connection per core
    const maxConnection = 5 * numCores;

    console.log('Active connection: ', numConnection);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
    if (numConnection > maxConnection) {
      console.log('Connection overload');
    }
  }, _SECONDS); //Monitor every 5 seconds
};

module.exports = { countConnect, checkOverload };
