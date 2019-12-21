module.exports = {
    name: 'end',
    description: 'End a music guessing game',

    async execute(message) {
        const games = message.client.games;
        const serverGame = games.get(message.guild.id);
        if (serverGame) {
            serverGame.songs = [];
            serverGame.connection.dispatcher.end();
        }
        else  {
            message.channel.send('There is no ongoing game to end.');
        }
    }
}