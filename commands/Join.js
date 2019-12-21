module.exports = {
    name: 'join',
    description: 'Join a music guessing game',

    // execute: Adds the user to a game if one exists
    async execute(message) {
        // retrieve server's game
        const games = message.client.games;
        const serverGame = games.get(message.guild.id);

        // if game was successfully retrieved
        if (serverGame) {
            return serverGame.addPlayer(message);
        }
        else {
            return message.channel.send('A game must be started before you can join.');
        }
    }
}