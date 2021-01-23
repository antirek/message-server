module.exports = (store, beebonClient) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function get(req, res) {
    const {chatId, phone} = req.params;
    console.log('get request params', req.params);
    
    let user;
    user = await store.getUserByPhone(phone);
    if(!user) {
      user = await store.addUser(phone);
    }
    const invite = await this.store.addInvite(chatId, user.userId);

    const resp = await beebonClient.sendSms(phone, 'invite');
    console.log('beebon response, send invite', resp);
    
    res.json(invite);
  }

  get.apiDoc = {
    summary: 'invite to chatId user via sms to phone',
    operationId: 'inviteUserToChat',
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
      {
        name: 'phone',
        in: 'path',
        type: 'string',
        required: true,
        description: 'phone',
      },
    ],
    get: get,
  };
};