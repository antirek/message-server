module.exports = (store) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function get(req, res) {
    const {chatId} = req.params;
    console.log('get request params', req.params);
    const users = await store.getChatsByUserId(chatId);
    res.json(users);
  }

  get.apiDoc = {
    summary: 'get chats by userId',
    operationId: 'getChats',
    tags: ['user'],
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