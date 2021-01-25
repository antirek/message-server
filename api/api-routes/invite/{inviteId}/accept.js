module.exports = (store) => {
  /**
    *
    * @param {Object} req
    * @param {Object} res
    */
  async function get(req, res) {
    const userId = req.user.userId;
    console.log('get request params', req.params);
    const {inviteId}  = req.params;

    const invite = await store.getActiveInviteById(inviteId);
    
    if (!invite) {
      console.log('no invite with inviteId', inviteId);
      return res.sendStatus(404)
    }

    if(invite.userId !== userId) {
      console.log('invite.userId not for current user', inviteId);
      return res.sendStatus(403);
    }

    const isUserInChat = await store.isUserInChat(userId, invite.chatId);
    if (isUserInChat) {
      console.log('user already in chat');
    } else {
      console.log('add user in chat');
      await store.appendUserToChat(invite.userId, invite.chatId);
    }

    invite.status = 'accepted';
    await invite.save();

    res.json(invite);
  }

  get.apiDoc = {
    summary: 'accept invite by current user',
    operationId: 'acceptInvite',
    tags: ['invite'],
    produces: [
      'application/json',
    ],
    responses: {
      200: {
        description: 'invite',
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
        name: 'inviteId',
        in: 'path',
        type: 'string',
        required: true,
        description: 'inviteId',
      },
    ],
    get,
  };
};