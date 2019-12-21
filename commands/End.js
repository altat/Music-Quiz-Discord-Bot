// !End is the command to end a game

module.exports = {
    name: 'end',
    description: 'End a music guessing game',

    // execute: Attempts to end a game if one exists
    async execute(message) {
        const games = message.client.games;
        const serverGame = games.get(message.guild.id);

        // game exists
        if (serverGame) {
            serverGame.songs = []; // clear song queue
            serverGame.connection.dispatcher.end(); // end audio stream
        }
        else  { // game doesn't exist
            message.channel.send('There is no ongoing game to end.');
        }
    }
}