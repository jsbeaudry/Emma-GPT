const ffmpeg = require("../Emma3-GPT/node_modules/fluent-ffmpeg");
const ffmpegPath =
  require("../Emma3-GPT/node_modules/@ffmpeg-installer/ffmpeg/types").path;
const ffprobePath =
  require("../Emma3-GPT/node_modules/@ffprobe-installer/ffprobe/types").path;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

module.exports = ffmpeg;
