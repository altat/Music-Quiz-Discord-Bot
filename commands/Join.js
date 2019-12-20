module.exports = {
    name: 'join',
    description: 'Join a music guessing game',

    async execute(message) {
        const games = message.client.games;
        const serverGame = games.get(message.guild.id);
        if (serverGame) {
            return serverGame.addPlayer(message);
        }
        else {
            return message.channel.send('A game must be started before you can join.');
        }
    }
}