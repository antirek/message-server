module.exports = (store) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function get(req, res) {
    const {chatId} = req.params;
    console.log('get request params', req.params);
    const users = await store.getUsersByChatId(chatId);
    const usersData = users.map(user => {
      return {
        userId: user.userId,
        avatarUrl: user.avatarUrl,
        name: user.name,
      };
    })
    res.json(usersData);
  }

  get.apiDoc = {
    summary: 'get users by chatId',
    operationId: 'getUsers',
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
    ],
    get: get,

  };
};