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
  
      // добавить проверку на отзыв инвайта, только  если есть право, 
      // например является owner чата
    
      invite.status = 'rejected';
      await invite.save();
  
      res.json(invite);
    }
  
    get.apiDoc = {
      summary: 'reject not accepted invite in controlled chat',
      operationId: 'rejectInvite',
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