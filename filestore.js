const path = require('path');
const fs = require('fs');

class Filestore {
  path;
  
  constructor ({path}) {
      this.path = path;
  }

  getPathAvatarByUserId (userId) {
    // console.log(this.path, userId);
    return path.join(this.path, userId, 'avatar.png');
  }

  async addAvatarForUserId (file, userId) {
    fs.mkdirSync(path.join(this.path, userId));
    return new Promise((resolve, reject) => {
      file.mv(this.getPathAvatarByUserId(userId), (err) => {
        if(err) {reject()}
        resolve();
      })
    })
  }
}

module.exports = {Filestore};