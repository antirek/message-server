module.exports = (store) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function get(req, res) {
    const { chatId, messageId } = req.params;

    console.log('get request params', req.params);
    console.log('get request body', req.body);
    const muStatus = await store.getMessageUserStatus(chatId, messageId);

    res.json(muStatus);
  }

  get.apiDoc = {
    summary: 'get status for message by chatId, messageId',
    operationId: 'getMessageUserStatus',
    tags: ['chat'],
    produces: [
      'application/json',
    ],
    parameters: [
      {
        in: 'body',
        name: 'object',
        description: 'message json',
        schema: {
          type: 'object',
        },
      },
    ],
    responses: {
      200: {
        description: 'post message',
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
        name: 'chatId',
        in: 'path',
        type: 'string',
        required: true,
        description: 'chatId',
      },
      {
        name: 'messageId',
        in: 'path',
        type: 'string',
        required: true,
        description: 'messageId',
      },
    ],
    get,
  };
};