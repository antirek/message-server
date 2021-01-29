module.exports = (store) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function get(req, res) {
    const {chatId} = req.params;
    console.log('get request params', req.params);
    const messages = await store.getMessagesByChatId(chatId);

    const messageIds = messages.map(m => m.messageId);
    const userId = req.user.userId;
    const statuses = await store.getMessageUserStatusesNotViewed(chatId, userId, messageIds);
    const notViewed = {};
    statuses.map(status => notViewed[status.messageId] = true);
    const messagesFormated = messages.map(message => {
      const m = message.toObject();
      m.viewed = notViewed[message.messageId] ? false : true;
      return m;
    });

    res.json(messagesFormated);
  }

  get.apiDoc = {
    summary: 'get messages by chatId',
    operationId: 'getMessages',
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
    get,
  };
};