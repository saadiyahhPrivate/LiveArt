// Configuration of the game

var Colors = {
  GREY: "#AAAAAA",  // default tile color
  GREEN: "#7CD3A2", // highlighting
  RED: "#FA5C4F",   // hits
  YELLOW: "#FAF36F",// misses
};
// var ROWNAMES = ["A", "B", "C", "D", "E", "F", "G", "H"];
// var COLNAMES = ["1", "2", "3", "4", "5", "6", "7", "8"];

// board stuff

var ANIMALTYPES = ["frog", "bird"];
var BOARDSIZE_WIDTH = 1200;
var BOARDSIZE_HEIGHT = 660;
var TILESIZE =  20;
var NUMTILES_WIDTH = Math.ceil(BOARDSIZE_WIDTH / TILESIZE);
var NUMTILES_HEIGHT = Math.ceil(BOARDSIZE_HEIGHT / TILESIZE);
var TURNDELAY = 2500;
var ANIMALSIZE = 4;
var CURSORSIZE = 20;
var TURNDELAY = 2500;

// voice stuff
var VOICEINDEX = 17; // UK British Female
var LEAPSCALE = 0.6;
var DEBUGSPEECH = true;
var SKIPSETUP = false;
