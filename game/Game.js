const ytdl = require('ytdl-core');
const Player = require('./Player')

// Game represents a game of music quiz and contains

module.exports = class Game {
  constructor(message) {
    this.guild = message.guild; // server game is being played in
    this.host = message.author.id; // user who started the game
    this.players = new Map(); // collection of all players
    this.players.set(this.host, new Player(message.author.username));
    this.gameChannel = message.channel; // channel where game was started
    this.voiceChannel = message.member.voiceChannel; // voice channel to play music in
    this.connection = null;
    this.songs = []; // song list
    this.volume = 5;
    this.playing = true;
  }

  // setupGame: Creates a new game and adds it the client's collection of games
  //            Will not create a game if server already has one
  // message: The message that invoked this function
  // vid: Video object or array of Videos to play in voice channel
  // isPlayList: boolean value that describes whether vid is array (Playlist) or not.
  async setupGame(message, vid, isPlayList) {
    // client's collection of games
    const games = message.client.games;
    // attempt to retrieve this server's game
    const serverGame = games.get(this.guild.id);

    // if game could not be retrieved
    if (!serverGame) {
      // add this game to client's collection.
      games.set(message.guild.id, this);

      if (isPlayList) {
        this.songs.push(...vid);
      }
      else {
        this.songs.push(vid);
      }

      // attempt to join the voice channel and start the game
      try {
        this.connection = await this.voiceChannel.join();
        this.startGame(message, this.songs[0]);
      } catch (err) {
        console.log(err);
        games.delete(message.guild.id);
        return message.channel.send(err);
      }
    }

    // otherwise send error saying game already exists
    else {
      return message.channel.send('There is already an ongoing game in this server!');
    }
  }

  // startGame: starts the game by playing audio from songs (property)
  async startGame(message, song) {
    // if there isn't a valid song, end the game
    if (!song) {
      return this.endGame(message);
    }

    // play the song (parameter)
    const dispatcher = this.connection.playStream(ytdl(song.url));
    // when the song ends, remove the first song from queue and recurse
    dispatcher.on('end', () => {
      console.log('Song ended!');
      this.songs.shift(); // remove first element and shift left
      this.startGame(message, this.songs[0]); // play next song
    });
    dispatcher.on('error', error => {
      console.log(error);
    });

    dispatcher.setVolumeLogarithmic(this.volume / 5);
  }

  // endGame: ends the game and remove's it from the client's collection
  async endGame(message) {
    this.voiceChannel.leave();

    let winner = this.getWinner(); // get and display winner
    message.channel.send(`Winner: ${winner.user}, Score: ${winner.score}`);

    const games = message.client.games;
    games.delete(this.guild.id); // remove game from client's collection
  }

  // givePoints: Rewards player (parameter) with points
  givePoints(player) {
    player.increaseScore();
  }

  // getScore: Displays the score of the mentioned user
  getScore(message) {
    // get mentioned user from message
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

  // addPlayer: Adds author of message to Game as a Player
  addPlayer(message) {
    this.players.set(message.author.id, new Player(message.author.username));
    message.react('👍');
  }

  // getWinner: returns Player with highest score.
  getWinner() {
    let winner = this.players.get(this.host);
    
    for (const player of this.players) {
      if (player.score > winner.score) {
        winner = player;
      }
    }

    return winner;
  }
}