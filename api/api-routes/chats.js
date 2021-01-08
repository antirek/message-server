module.exports = (store) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function get(req, res) {
    const userId = req.user.userId;
    console.log('get request params', req.params);
    const chats = await store.getChatsByUserId(userId);
    const chatsInfo = [];
    for (const chat of chats) {
      const count = await store.getMessageUserStatusNotViewedCount(chat.chatId, userId);
      const info = chat.toObject();
      console.log('info', info, count);
      info.countNotViewed = count || 0;
      chatsInfo.push(info);
    }
    console.log(chatsInfo);
    res.json(chatsInfo);
  }

  get.apiDoc = {
    summary: 'get chats current user',
    operationId: 'getChats',
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
    get,
  };
};