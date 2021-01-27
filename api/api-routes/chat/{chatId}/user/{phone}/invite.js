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
    let isNewUser = false;
    user = await store.getUserByPhone(phone);
    if(!user) {
      user = await store.addUser(phone);
      isNewUser = true;
    }

    // check user in chat
    if (!isNewUser) {
      const isUserInChat = await store.isUserInChat(user.userId, chatId);
      if (isUserInChat) {
        console.log('user', user.phone, 'already in chat', chatId);
        return res.json({status:'OK', message: 'user already in chat'});
      }
    }

    const invite = await store.addInvite(chatId, user.userId);

    if (!isNewUser) {
      // send to firebase and websocket
    }

    if (isNewUser) {
      const smsText = 'invite: download app and accept invite';
      const resp = await beebonClient.sendSms(phone, smsText);
      console.log('beebon response, send invite', resp);
    }

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