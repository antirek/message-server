module.exports = (store, websocketServer, firebaseClient) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function post(req, res) {
    const { chatId } = req.params;
    const { data, type } = req.body;
    console.log(' ------------ test new message ------------------- ');
    console.log('req user', req.user);
    console.log('get request params', req.params);
    console.log('get request body', req.body);

    data.chatId = chatId;
    await firebaseClient.sendMessage(req.user.userId, {data: JSON.stringify(data), type});

    res.json(data);
  }

  post.apiDoc = {
    summary: 'post message to chatId',
    operationId: 'testMessage',
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
          example: {
            data: {              
              type: "text",
              content: 'sample content',
              sender: {
                  userId: '79135292926',
                  name: 'Vasya',
                  avatarUrl: '',
              },
              messageId: 'messageId',
              date: '',
            },
            type: "message",              
          },
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
    ],
    post: post,
  };
};