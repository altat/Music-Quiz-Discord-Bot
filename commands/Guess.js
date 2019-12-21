const Game = require('../game/Game.js');

// Guess is the command for submitting a guess

module.exports = {
    name: 'guess',
    description: 'Guess the name of the song',

    // execute: Reads and verifies guess. Gives point to Player if correct
    async execute(message) {
        // first 7 characters of message is '!guess ' so
        // everything after first 7 characters is player's guess
        const guess = message.content.slice(7);
        guess = guess.toLowerCase();
        const games = message.client.games;
        const serverGame = games.get(message.guild.id);

        // Game does not exist in server
        if (!serverGame) {
            return message.channel.send('There is no ongoing game.');
        }

        // check if player has joined game
        const player = serverGame.players.get(message.author.id);
        if (!player) {
            return message.reply('You must join a game before guessing.');
        }

        // get the title of the song
        // title is usually formatted as <song title> - <artist/source>
        // or <artist/source> - <song title>
        const song = serverGame.songs[0];
        const title = song.title.toLowerCase;
        title = title.split(' - ');

        // if the guess matches the title
        if (this.checkGuess(guess, title)) {
            serverGame.givePoints(player); // award points
            message.reply('Correct! +5 Points.');
            serverGame.connection.dispatcher.end(); // end current song
        }
        else {
            return;
        }
    },

    // checkGuess: Compares the user's guess to the actual title
    // returns true if guess matches, false otherwise
    checkGuess(guess, title) {
        return (guess === title[0] || guess === title[1]);
    }
}