'use strict';
const AccessService = require('../services/access.service');
const { Created } = require('../core/success.response');

class AccessController {
  signUp = async (req, res, next) => {
    // return res.status(201).json(await AccessService.signUp(req.body));

    new Created({
      message: 'Created',
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };
}

module.exports = new AccessController();
