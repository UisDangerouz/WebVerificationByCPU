const path = require('path');

const dataPath = path.resolve(__dirname + '/userdata/cat.jpg');
const accessDeniedPath = path.resolve(__dirname + '/userdata/accessDenied.png');

class DataManager {

    tokens = {};

    constructor(tokenTimeout) {
        this.tokenTimeout = tokenTimeout;

        let self = this
        setInterval(() => self.removeTimeouts(), 5000);
    }

    generateToken() {
        let id = new Date().getTime();
        this.tokens[id] = DataManager.generateHexString(20);
        return this.tokens[id];
    }

    removeTimeouts() {
        for (let id in this.tokens) {
            if (this.tokens.hasOwnProperty(id) && new Date().getTime() - id > this.timeout) {
                delete this.tokens[id];
            }
        }
    }

    getData(token) {
        for (let id in this.tokens) {
            if (this.tokens.hasOwnProperty(id) && this.tokens[id] === token) {
                delete this.tokens[id];
                return dataPath;
            }
        }
        return accessDeniedPath;
    }

    static generateHexString(len) {
        const hex = '0123456789ABCDEF';
        let output = '';
        for (let i = 0; i < len; ++i) {
            output += hex.charAt(Math.floor(Math.random() * hex.length));
        }
        return output;
    }
}

module.exports = DataManager;