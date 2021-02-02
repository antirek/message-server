
class TokenChecker {
  Token;
  User;

  constructor ({Token, User}) {
    this.Token = Token;
    this.User = User;
  }

  async check (req) {
    const token = req.headers['x-api-key'];

    const userToken = await this.Token.findOne({token});
    if (!userToken) {
      console.log('no token');
      return false;
    }

    const user = await this.User.findOne({userId: userToken.userId});
    if (!user) {
      console.log('no user');
      return false;
    }

    req.user = user.toObject();
    return true;
  }
}

module.exports = {TokenChecker};