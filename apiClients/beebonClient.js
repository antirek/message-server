const axios = require('axios');

class BeebonClient {
  url;
  source;

  constructor ({url, source}) {
    this.url = url;
    this.source = source;
  }

  async sendSms(number, text) {
    const url = this.url + '/api/task/sms';
    const response = await axios.post(url, {
      number,
      source: this.source,
      text,
    });
    return response;
  }
}

module.exports = {BeebonClient};