const uuidv4 = require('uuid').v4;

class MessageServerStore {
    User;
    Chat;
    Message;
    ChatUser;
    MessageUserStatus;
    Bot;
    ChatBot;
    Registration;
    PhoneCode;
    Token;

    constructor ({User, Chat, Message, ChatUser, Token,
        MessageUserStatus, Bot, ChatBot, Registration, PhoneCode, }) {
        this.User = User;
        this.Chat = Chat;
        this.Token = Token;
        this.ChatBot = ChatBot;
        this.Bot = Bot;
        this.ChatUser = ChatUser;
        this.Message = Message;
        this.MessageUserStatus = MessageUserStatus;
        this.Registration = Registration;
        this.PhoneCode = PhoneCode;
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

    async getBots () {
        return await this.Bot.find();
    }

    async getUser (userId) {
        return await this.User.findOne({userId});
    }

    async getChatByChatId (chatId) {
        return await this.Chat.findOne({chatId});
    }

    async getUsersByChatId(chatId) {
        const chatUserIds = await this.ChatUser.find({chatId});
        const userIds = chatUserIds.map(chid => chid.userId);
        console.log('userIds array', userIds);
        const userProfiles = await this.User.find({userId:{$in:userIds}});        
        const userProfilesHash = {}; 
        userProfiles.map(userProfile => { userProfilesHash[userProfile.userId] = userProfile; });
        const users = chatUserIds.map(chatUserId => {
            return userProfilesHash[chatUserId.userId] ? 
                userProfilesHash[chatUserId.userId] : 
                { userId: chatUserId.userId, name: null, avatarUrl: null};
        });
        return users;
    }

    async getBotsByChatId (chatId) {
        const chatBotIds = await this.ChatBot.find({chatId});
    }

    async getChatsByUserId (userId) {
        const chatUserIds = await this.ChatUser.find({userId});
        const chatIds = chatUserIds.map(chid => chid.chatId);
        const chats = await this.Chat.find({chatId: {$in: chatIds}});    
        return chats;
    }

    //// перенести код? start
    async updateUserRegistration(userId, token) {
        const data = {
            userId,
            token,
            date: (new Date()).toString(),
        }
        return await this.Registration.findOneAndUpdate({userId}, data, {upsert: true, });
    }

    async updateAuthToken(userId, token) {
        const data = {
            userId,
            token,
        }
        return await this.Token.findOneAndUpdate({userId}, data, {upsert: true, });
    }

    async updatePhoneCode(phone, code) {
        const data = {
            phone,
            code,
        };
        return await this.PhoneCode.findOneAndUpdate({phone}, data, {upsert: true, });
    }

    async getCodeForPhone(phone) {
        return await this.PhoneCode.findOne({phone});
    }
    //// end



    async getMessagesByChatId(chatId) {
        const messages = await this.Message.find({chatId}).sort({"_id": -1}).limit(10);
        return messages.reverse();
    }

    async appendUserToChat (userId, chatId) {
        return await this.ChatUser.insertMany([{userId, chatId}]);
    }

    async deleteUserFromChat (userId, chatId) {
        return await this.ChatUser.remove({userId, chatId});
    }

    async addChat (name = null, ownerId = null) {
        const chatId = uuidv4();
        const chat = new this.Chat({chatId, name, ownerId});
        return await chat.save();
    }

    async appendMessage (chatId, sender, content, type) {
        const date = new Date();
        const messageId = uuidv4();
        const newMessage = {
            messageId, chatId, sender, content, type, date: date.toString()};
            //console.log('new message', newMessage)
        const message = new this.Message(newMessage);
        return await message.save();
    }

    async addUser (userId, name, avatarUrl) {
        return await this.User.insertMany([{userId, name, avatarUrl}]);
    }

    async getMessageUserStatusNotViewed(chatId, userId) {
        return await this.MessageUserStatus.find({chatId, userId, viewed: false});
    }

    async getMessageUserStatusNotViewedCount(chatId, userId) {
        return await this.MessageUserStatus.find({chatId, userId, viewed: false}).countDocuments();
    }

    async setMessageUserStatus(chatId, userId, messageId, status) {
        let muStatus = await this.MessageUserStatus.findOne({chatId, userId, messageId});
        if (!muStatus) {
            muStatus = new this.MessageUserStatus({chatId, userId, messageId});
        }
        console.log(muStatus);
        switch (status) {
            case 'sended':
                muStatus.sended = true;
                break;
            case 'received':
                muStatus.sended = true;
                muStatus.received = true;
                break;
            case 'viewed':
                muStatus.sended = true;
                muStatus.received = true;
                muStatus.viewed = true;
                break;
            default:
                break;
        }
        await muStatus.save();
        return muStatus;
    }

    async setAllMessageUserStatusViewed(chatId, userId) {
        const muStatuses = await this.getMessageUserStatusNotViewed(chatId, userId);
        for (const muStatus of muStatuses) {
            await this.setMessageUserStatus(chatId, userId, muStatus.messageId, 'viewed');
        }
    }

    async getMessageUserStatus(chatId, messageId) {
        const statuses = await this.MessageUserStatus.find({chatId, messageId});
        return statuses;
    }

    async getMessageUserStatusesNotViewed(chatId, userId, messageIds) {
        const statuses = await this.MessageUserStatus.find({
            chatId,
            userId,
            viewed: false,
            messageId: {$in :messageIds},
        });
        return statuses;
    }
}

module.exports = {MessageServerStore};