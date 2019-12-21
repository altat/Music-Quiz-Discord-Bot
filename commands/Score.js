module.exports = {
    name: 'score',
    description: 'Get the score of the mentioned player',

    // execute: Displays score of player in game
    async execute(message) {
        const games = message.client.games;
        const serverGame = games.get(message.guild.id);
        if (serverGame) {
            return serverGame.getScore(message);
        }
        else {
            return message.channel.send('There is no ongoing game.');
        }
    }
}