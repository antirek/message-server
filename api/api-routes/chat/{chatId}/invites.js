module.exports = (store) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function get(req, res) {
    const {chatId} = req.params;
    const invites = await store.getActiveInvitesByChatId(chatId);
    
    console.log('invites', invites);
    res.json(invites);
  }

  get.apiDoc = {
    summary: 'get invites by chatId',
    operationId: 'getInvites',
    tags: ['chat', 'invite'],
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
    get,
  };
};