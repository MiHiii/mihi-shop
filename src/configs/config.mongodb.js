'use strict';

//lv0
// const config = {
//   app: {
//     port: 3000,
//   },

//   db: {
//     host: 'localhost',
//     port: 27019,
//     name: 'mihi-shop',
//   },
// };

//lv1
// const dev = {
//   app: {
//     port: 3000,
//   },

//   db: {
//     host: 'localhost',
//     port: 27019,
//     name: 'mihi-dbDev',
//   },
// };

// const pro = {
//   app: {
//     port: 3000,
//   },

//   db: {
//     host: 'localhost',
//     port: 27019,
//     name: 'mihi-shop-dbProduct',
//   },
// };

//lv2

const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3055,
  },

  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: process.env.DEV_DB_PORT || 27019,
    name: process.env.DEV_DB_NAME || 'mihi-shop',
    user: process.env.DEV_DB_USER || 'root',
    password: process.env.DEV_DB_PASSWORD || '123456',
  },
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 3000,
  },

  db: {
    host: process.env.PRO_DB_HOST || 'localhost',
    port: process.env.PRO_DB_PORT || 27019,
    name: process.env.PRO_DB_NAME || 'mihi-shop-pro',
  },
};

const config = { dev, pro };
const env = process.env.NODE_ENV || 'dev';

module.exports = config[env];
