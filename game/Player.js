// Player represents a player in a game of music quiz
// Stores a user's username and score in game

module.exports = class Player {
    constructor(user) {
        this.score = 0;
        this.user = user;
    }

    // increaseScore: Increases this player's score by 5
    increaseScore() {
        this.score += 5;
    }
}