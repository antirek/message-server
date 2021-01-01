module.exports = (store) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function get(req, res) {
    const {chatId, userId} = req.params;
    console.log('get request params', req.params);
    const users = await store.deleteUserFromChat(userId, chatId);
    res.json(users);
  }

  get.apiDoc = {
    summary: 'delete userId from chatId',
    operationId: 'deleteUserFromChat',
    tags: ['chat'],
    produces: [
      'application/json',
    ],
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
        name: 'chatId',
        in: 'path',
        type: 'string',
        required: true,
        description: 'chatId',
      },
      {
        name: 'userId',
        in: 'path',
        type: 'string',
        required: true,
        description: 'userId',
      },
    ],
    get: get,
  };
};