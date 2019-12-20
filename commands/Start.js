const { API_KEY } = require('./yt.json');
const Game = require('../game/Game.js');
const YouTube = require('discord-youtube-api');

const youtube = new YouTube(API_KEY);

module.exports = {
  name: 'start',
  description: 'Start a music guessing game',

  async execute(message) {
    const args = message.content.split(' ');

    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.channel.send('You need to be in a voice channel before starting a game!');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
      return message.channel.send('I need permission to join and speak in voice channels.');
    }

    var vid = null;
    var isPlayList = false;

    if (args.length < 2) {
      return message.channel.send('I need music to play!');
    }

    //if url is playlist
    if (args[1].includes('playlist')) {
      // get video array
      try {
        vid = await youtube.getPlaylist(args[1]);
        isPlayList = true;
      } catch (error) {
        console.log(error);
        return;
      }
    }
    // else
    else {
      // get video
      try {
        vid = await youtube.getVideo(args[1]);
      } catch (error) {
        console.log(error);
        return;
      }
    }

    var nGame = new Game(message);
    nGame.setupGame(message, vid, isPlayList);
  }
}