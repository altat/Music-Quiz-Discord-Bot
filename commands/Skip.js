module.exports = {
    name: 'skip',
    description: 'Skips the current round (song)',

    // execute: Skips the current round by ending playback of current song
    async execute(message) {
        const games = message.client.games;
        const serverGame = games.get(message.guild.id);
        if (serverGame) {
            serverGame.connection.dispatcher.end();
        }
        else {
            return message.channel.send('There is no ongoing game.');
        }
    }
}