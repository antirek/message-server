const axios = require('axios');
const config = require('config');

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

    const url = config.beebonUrl + '/api/task/sms';
    const response = await axios.post(url, {
      number: phone,
      source: '89830500208',
      text: `${code}`,
    });
    console.log('beebon response', response);
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