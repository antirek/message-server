module.exports = (store) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function post(req, res) {
    const { chatId, messageId } = req.params;
    const { status } = req.body;

    console.log('get request params', req.params);
    console.log('get request body', req.body);
    const muStatus = await store.setMessageUserStatus(chatId, req.user.userId, messageId, status);

    res.json(muStatus);
  }

  post.apiDoc = {
    summary: 'set status for message by chatId, userId',
    operationId: 'postMessage',
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
    post: post,
  };
};