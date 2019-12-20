const Game = require('../game/Game.js');

module.exports = {
    name: 'end',
    description: 'End a music guessing game',

    async execute(message) {
        const games = message.client.games;
        const serverGame = games.get(message.guild.id);
        serverGame.endGame(games);
    }
}