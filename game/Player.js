module.exports = class Player {
    constructor(user) {
        this.score = 0;
        this.user = user;
    }

    increaseScore() {
        this.score += 5;
    }
}