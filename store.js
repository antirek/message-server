class MessageServerStore {
    User;
    Chat;
    Message;
    ChatUser;

    constructor ({User, Chat, Message, ChatUser}) {
        this.User = User;
        this.Chat = Chat;
        this.ChatUser = ChatUser;
        this.Message = Message;
    }

    async getChatsByOwnerId(ownerId) {
        return await this.Chat.find({ownerId});
    }

    async getUserIdsByChatId(chatId) {
        return await this.ChatUser.find({chatId});
    }

    async getUsers () {
        return await this.User.find();
    }

    async getUser (userId) {
        return await this.User.findOne({userId});
    }

    async getUsersByChatId(chatId) {
        const chatUserIds = await this.ChatUser.find({chatId});
        const userIds = chatUserIds.map(chid => chid.userId);
        console.log('userIds array', userIds);
        const userProfiles = await this.User.find({userId:{$in:userIds}});        
        const userProfilesHash = {}; 
        userProfiles.map(userProfile => {userProfilesHash[userProfile.userId] = userProfile; });
        const users = chatUserIds.map(chatUserId => {
            return userProfilesHash[chatUserId.userId] ? 
                userProfilesHash[chatUserId.userId] : 
                { userId: chatUserId.userId, name: null, avatarUrl: null};
        });
        return users;
    }

    async getChatsByUserId (userId) {
        return await this.ChatUser.find({userId});
    }

    async getMessagesByChatId(chatId) {
        return await this.Message.find({chatId}).sort({"_id": -1}).limit(10);
    }

    async appendUserToChat (userId, chatId) {
        return await this.ChatUser.insertMany([{userId, chatId}]);
    }

    async deleteUserFromChat (userId, chatId) {
        return await this.ChatUser.remove({userId, chatId});
    }

    async addChat (chatId, ownerId) {
        if (!chatId) {
            return;
        }
        return await this.Chat.insertMany([{chatId, ownerId}]);
    }

    async appendMessage (chatId, sender, content, type) {
        const date = new Date();
        const message = new this.Message({
            chatId, sender, content, type, date: date.toString()});
        message.save();
    }

    async addUser (userId, name, avatarUrl) {
        return await this.User.insertMany([{userId, name, avatarUrl}]);
    }
}

module.exports = {MessageServerStore};