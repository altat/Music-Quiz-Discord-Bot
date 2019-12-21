const ytdl = require('ytdl-core');
const Player = require('./Player')

module.exports = class Game {
  constructor(message) {
    this.guild = message.guild;
    this.host = message.author.id;
    this.players = new Map();
    this.players.set(this.host, new Player(message.author.username));
    this.gameChannel = message.channel;
    this.voiceChannel = message.member.voiceChannel;
    this.connection = null;
    this.songs = [];
    this.volume = 5;
    this.playing = true;
  }

  async setupGame(message, vid, isPlayList) {
    const games = message.client.games;
    const serverGame = games.get(this.guild.id);

    if (!serverGame) {
      games.set(message.guild.id, this);

      if (isPlayList) {
        this.songs.push(...vid);
      }
      else {
        this.songs.push(vid);
      }

      try {
        this.connection = await this.voiceChannel.join();
        this.startGame(message, this.songs[0]);
      } catch (err) {
        console.log(err);
        games.delete(message.guild.id);
        return message.channel.send(err);
      }
    }
    else {
      // send error saying game already exists
      return message.channel.send('There is already an ongoing game in this server!');
    }
  }

  async startGame(message, song) {
    if (!song) {
      return this.endGame(message);
    }

    const dispatcher = this.connection.playStream(ytdl(song.url));
    dispatcher.on('end', () => {
      console.log('Song ended!');
      this.songs.shift();
      this.startGame(message, this.songs[0]);
    });
    dispatcher.on('error', error => {
      console.log(error);
    });

    dispatcher.setVolumeLogarithmic(this.volume / 5);
  }

  async endGame(message) {
    const games = message.client.games;
    this.voiceChannel.leave();
    let winner = this.getWinner();
    message.channel.send(`Winner: ${winner.user}, Score: ${winner.score}`);
    games.delete(this.guild.id);
  }

  givePoints(player) {
    player.increaseScore();
  }

  getScore(message) {
    // get mentioned user
    const member = message.mentions.members.first();
    const user = member.user;
    const player = this.players.get(user.id);

    // send a message of the user's score if they joined the game
    if (player) {
      message.channel.send(`${user.username} score is ` + player.score);
    }
    else {
      return message.channel.send(`${user.username} is not playing this game.`);
    }
  }

  // adds author of message to Game as a Player
  addPlayer(message) {
    this.players.set(message.author.id, new Player(message.author.username));
    message.react('👍');
  }

  getWinner() {
    let winner = this.players.get(this.host);
    for (const player of this.players) {
      if (player.score < winner.score) {
        winner = player;
      }
    }

    return winner;
  }
}