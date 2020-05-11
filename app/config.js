// Configuration of the game

// TODO: add more sounds!!!
var BIRD_SOUNDS = ["sounds/chickadee0.m4a", "sounds/chickadee1.m4a",
                   "sounds/chickadee2.m4a", "sounds/chickadee3.m4a",
                   "sounds/chickadee4.m4a", "sounds/chickadee5.m4a"];
var FROG_SOUNDS = ["sounds/frog1.mp3", "sounds/frog2.wav", "sounds/frog3.wav"];
var WOLF_SOUNDS = ["sounds/wolf0.m4a", "sounds/wolf1.m4a", "sounds/wolf2.m4a",
				   "sounds/wolf3.m4a", "sounds/wolf4.m4a", "sounds/wolf5.m4a",
				   "sounds/wolf6.m4a"];
var BEAR_SOUNDS = ["sounds/bear0.m4a", "sounds/bear1.m4a", "sounds/bear2.m4a"];

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
