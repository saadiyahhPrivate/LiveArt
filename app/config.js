// Configuration of the game

var Colors = {
  GREY: "#AAAAAA",  // default tile color
  GREEN: "#7CD3A2", // highlighting
  RED: "#FA5C4F",   // hits
  YELLOW: "#FAF36F",// misses
};

// TODO: add more sounds!!!
var BIRD_SOUNDS = ["sounds/bird_trimmed1.mp3", "sounds/bird_trimmed2.mp3",
                   "sounds/bird1.mp3", "sounds/bird3.wav", "sounds/bird4.wav",
                   "sounds/bird5.mp3"];
var FROG_SOUNDS = ["sounds/frog1.mp3", "sounds/frog2.wav", "sounds/frog3.wav"];

// board stuff
var ANIMALTYPES = ["frog", "bird"];
var TILESIZE =  20;
var BOARDSIZE_WIDTH = Math.floor($(window).width() * 0.8 / TILESIZE) * TILESIZE;
var BOARDSIZE_HEIGHT = Math.floor($(window).height() * 0.9 / TILESIZE) * TILESIZE;
var MENUSIZE = Math.floor(0.9 * ($(window).height() * 0.9 / TILESIZE)) * TILESIZE;
var NUMTILES_WIDTH = Math.ceil(BOARDSIZE_WIDTH / TILESIZE);
var NUMTILES_HEIGHT = Math.ceil(BOARDSIZE_HEIGHT / TILESIZE);
var TURNDELAY = 2500;
var ANIMALSIZE = 4;
var CURSORSIZE = 20;
var TURNDELAY = 2500;

// some variables determining where we can put various AnimalSet
// frogs can be placed at heights higher than this
var FROG_PLACEMENT_HEIGHT = Math.floor(NUMTILES_HEIGHT * 0.7);

// voice stuff
var VOICEINDEX = 17; // UK British Female
var LEAPSCALE = 0.6;
var DEBUGSPEECH = true;
var SKIPSETUP = false;
