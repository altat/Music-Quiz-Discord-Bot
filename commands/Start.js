const { API_KEY } = require('./yt.json');
const Game = require('../game/Game.js');
const YouTube = require('discord-youtube-api');

const youtube = new YouTube(API_KEY);

// Start is the command to start a game

module.exports = {
  name: 'start',
  description: 'Start a music guessing game',

  // execute: Attempts to create and start the game.
  //          Requires the user who invoked this command to be in a voice channel
  //          Client requires permission to connect and speak in voice channels
  // message: Discord message that is in format: !start <youtube link to video or playlist>
  async execute(message) {
    const args = message.content.split(' ');

    // get voice channel of user who invoked this command
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.channel.send('You need to be in a voice channel before starting a game!');

    // check if client has permission to join and speak in voice channels
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
      return message.channel.send('I need permission to join and speak in voice channels.');
    }

    var vid = null;
    var isPlayList = false;

    // if message does not include link
    if (args.length < 2) {
      return message.channel.send('I need music to play!');
    }

    //if url is playlist
    if (args[1].includes('playlist')) {
      // attempt to get array of videos
      try {
        vid = await youtube.getPlaylist(args[1]);
        isPlayList = true;
      } catch (error) { // invalid youtube playlist link
        console.log(error);
        return;
      }
    }
    // else
    else {
      // attempt to get youtube video
      try {
        vid = await youtube.getVideo(args[1]);
      } catch (error) { // invalid youtube link
        console.log(error);
        return;
      }
    }

    // create and setup game. 
    var nGame = new Game(message);
    nGame.setupGame(message, vid, isPlayList);
  }
}