const {nanoid} = require('nanoid');

module.exports = (store) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function get(req, res) {
    const {phone, code} = req.params;
    console.log('get request params', req.params);

    const phoneCode = await store.getCodeForPhone(phone);
    if (phoneCode && (code !== phoneCode.code)) {
      console.log('get code not equal stored code', phoneCode.code);
      res.sendStatus(401);
      return;
    }

    const token = nanoid();
    let user = await store.getUserByPhone(phone);
    if (!user) {
      // @todo: придумать механику с именем
      user = await store.addUser(phone, 'Unknown', '');
    }

    const userId = user.userId;
    await store.updateAuthToken(userId, token);

    res.json({status: 'OK', token});
  }

  get.apiDoc = {
    summary: 'exchange code to token for auth',
    operationId: 'sendTokenForAuth',
    tags: ['auth'],
    produces: [
      'application/json',
    ],
    security: [],
    responses: {
      200: {
        description: 'requested messages',
      },
      default: {
        description: 'Unexpected error',
        schema: {
          $ref: '#/definitions/Error',
        },
      },
    },
  };

  return {
    parameters: [
      {
        name: 'phone',
        in: 'path',
        type: 'string',
        required: true,
        description: 'phone',
      },
      {
        name: 'code',
        in: 'path',
        type: 'string',
        required: true,
        description: 'code',
      },
    ],
    get,
  };
};