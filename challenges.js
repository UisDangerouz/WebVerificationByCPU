const crypto = require('crypto');

class Challenges {

    challenges = {}

    constructor(strength, timeout) {
        this.strength = strength;
        this.timeout = timeout;

        let self = this
        setInterval(() => self.removeTimeouts(), 5000);
    }

    get() {
        return this.challenges;
    }

    generate() {
        let id = new Date().getTime();
        this.challenges[id] = Challenges.generateHexString(this.strength);

        return [this.challenges[id], id, this.timeout];
    }

    isSolution(solution, id) {
        if (id.length !== 0 && this.challenges.hasOwnProperty(id)) {
            if (Challenges.getSha256(solution.toString()).substring(0, this.strength) === this.challenges[id]) {
                delete this.challenges[id]; 
                return true;
            }

            delete this.challenges[id]; 
        } 
        return false;
    }

    removeTimeouts() {
        for (let id in this.challenges) {
            if (this.challenges.hasOwnProperty(id) && new Date().getTime() - id > this.timeout) {
                delete this.challenges[id];
            }
        }
    }

    static generateHexString(len) {
        const hex = '0123456789ABCDEF';
        let output = '';
        for (let i = 0; i < len; ++i) {
            output += hex.charAt(Math.floor(Math.random() * hex.length));
        }
        return output;
    }
    
    static getSha256(text) {
        return crypto.createHash('sha256').update(text).digest('hex').toUpperCase();
    }
}



module.exports = Challenges;