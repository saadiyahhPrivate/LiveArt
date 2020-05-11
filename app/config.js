// Configuration of the game

// TODO: add more sounds!!!
var BIRD_SOUNDS = ["sounds/chickadee0.mp3", "sounds/chickadee1.mp3",
                   "sounds/chickadee2.mp3", "sounds/chickadee3.mp3",
                   "sounds/chickadee4.mp3", "sounds/chickadee5.mp3"];
var FROG_SOUNDS = ["sounds/frog1.mp3", "sounds/frog2.wav", "sounds/frog3.wav"];
var WOLF_SOUNDS = ["sounds/wolf0.mp3", "sounds/wolf1.mp3", "sounds/wolf2.mp3",
				   "sounds/wolf3.mp3", "sounds/wolf4.mp3", "sounds/wolf5.mp3",
				   "sounds/wolf6.mp3"];
var BEAR_SOUNDS = ["sounds/bear0.mp3", "sounds/bear1.mp3", "sounds/bear2.mp3"];

// board stuff
var ANIMALTYPES = ["frog", "bird", "wolf", "bear"];
var TILESIZE =  20;
var BOARDSIZE_WIDTH = Math.floor($(window).width() / TILESIZE) * TILESIZE;
var BOARDSIZE_HEIGHT = Math.floor($(window).height() / TILESIZE) * TILESIZE;
var MENUSIZE = Math.floor(0.9 * ($(window).height() * 0.9 / TILESIZE)) * TILESIZE;
var NUMTILES_WIDTH = Math.ceil(BOARDSIZE_WIDTH / TILESIZE);
var NUMTILES_HEIGHT = Math.ceil(BOARDSIZE_HEIGHT / TILESIZE);
var TURNDELAY = 2500;
var ANIMALSIZE = 2;
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
