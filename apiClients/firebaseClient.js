const firebaseAdmin = require('firebase-admin');
// const serviceAccount = require('../config/serviceAccountKey.json');

class FirebaseClient {
  firebaseAdminApp;

  constructor ({serviceAccount, Registration}) {
    this.firebaseAdminApp = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
    });

    this.Registration = Registration;
  }

  async getRegistration (userId) {
    const registration = await this.Registration.findOne({userId});
    if(!registration) {
      throw new Error(`no registration for userId ${userId}`);
    }
    return registration;
  }

  async sendMessage (userId, messageData) {
    const registration = await this.getRegistration(userId);
    const token = registration.token;
    if (!token || token === '') {
      throw new Error(`no token for userId ${userId}`);
    }

    const message = {
      data: messageData,
      token,
    }
    const response = await this.firebaseAdminApp.messaging().send(message);
    console.log('sent message', response);
  }
}

module.exports = {FirebaseClient};