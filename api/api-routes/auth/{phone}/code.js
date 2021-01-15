module.exports = (store) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function get(req, res) {
    const {phone} = req.params;
    console.log('get request params', req.params);

    const code = Math.floor(Math.random() * 999) + 1000;
    console.log('code', code);

    await store.updatePhoneCode(phone, code);
    // beebonClient.sendSMS(code, phone);
    res.json({status: 'OK'});
  }

  get.apiDoc = {
    summary: 'send code by sms to phone',
    operationId: 'requestCode',
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
    ],
    get,
  };
};