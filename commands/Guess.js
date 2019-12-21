const Game = require('../game/Game.js');

module.exports = {
    name: 'guess',
    description: 'Guess the name of the song',

    async execute(message) {
        const guess = message.content.slice(7);
        const games = message.client.games;
        const serverGame = games.get(message.guild.id);

        if (!serverGame) {
            return message.channel.send('There is no ongoing game.');
        }

        const player = serverGame.players.get(message.author.id);
        if (!player) {
            return message.reply('You must join a game before guessing.');
        }

        const song = serverGame.songs[0];
        const title = song.title.split(' - ');

        if (this.checkGuess(guess, title)) {
            serverGame.givePoints(player);
            message.reply('Correct! +5 Points.');
            serverGame.connection.dispatcher.end();
        }
        else {
            return;
        }
    },

    checkGuess(guess, title) {
        return (guess === title[0] || guess === title[1]);
    }
}