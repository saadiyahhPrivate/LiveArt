// Import Famo.us dependencies
var Engine = famous.core.Engine;
var Modifier = famous.core.Modifier;
var Transform = famous.core.Transform;
var Surface = famous.core.Surface;
var ImageSurface = famous.surfaces.ImageSurface;
var CanvasSurface = famous.surfaces.CanvasSurface;
var StateModifier = famous.modifiers.StateModifier;
var Draggable = famous.modifiers.Draggable;
var GridLayout = famous.views.GridLayout;
var EventHandler = famous.core.EventHandler;

var tiles = [];
var tileModifiers = [];
var gridOrigin = [200, 35];

var background, speechFeedback;
var mainContext = Engine.createContext();

// USER INTERFACE SETUP
var setupUserInterface = function() {
  background = new Surface({
    content: "<h1>LiveArt</h1>",
    properties: {
      backgroundColor: "rgb(27, 140, 70)",
      color: "white",
    }
  });
  mainContext.add(background);

  speechFeedback = new Surface({
    content: "",
    size: [undefined, 50],
    properties: {
      backgroundColor: "rgb(34, 34, 34)",
      color: "white"
    }
  });
  var otherModifier = new StateModifier({
    origin: [0.0, 1.0],
    align: [0.0, 1.0]
  })
  mainContext.add(otherModifier).add(speechFeedback);

  // Draw the board
  for (var row = 0; row < NUMTILES_HEIGHT; row++) {
    for (var col = 0; col < NUMTILES_WIDTH; col++) {
      var tile = new Surface({
          size: [TILESIZE, TILESIZE],
          properties: {
              backgroundColor: Colors.GREY,
              color: "white",
              border: "solid 1px black",
          },
      });
      var transformModifier = new StateModifier({
        transform: Transform.translate(gridOrigin[0] + col*TILESIZE, gridOrigin[1] + row*TILESIZE, 0)
      });
      var tileModifier = new Modifier({
        opacity: 1,
      });
      mainContext.add(transformModifier).add(tileModifier).add(tile);
      tiles.push(tile);
      tileModifiers.push(tileModifier);
    }
  }

  // add image behind board
  var imageBgView = new ImageSurface({
      size: [BOARDSIZE_WIDTH, BOARDSIZE_HEIGHT],
      content: 'img/background.png',
  });
  var BgTransformModifier = new StateModifier({
    transform: Transform.translate(gridOrigin[0], gridOrigin[1], 0)
  });
  var BgImgModifier = new Modifier({
    opacity: 0.95
  });
  mainContext.add(BgTransformModifier).add(BgImgModifier).add(imageBgView);


    // Draw the cursor
    var cursorSurface = new Surface({
      size : [CURSORSIZE, CURSORSIZE],
      properties : {
          backgroundColor: 'white',
          borderRadius: CURSORSIZE/2 + 'px',
          pointerEvents : 'none',
          zIndex: 1
      }
    });
    var cursorOriginModifier = new StateModifier({origin: [0.5, 0.5]});
    var cursorModifier = new Modifier({
      transform : function(){
        var cursorPosition = this.get('screenPosition');
        return Transform.translate(cursorPosition[0], cursorPosition[1], 0);
      }.bind(cursor)
    });
    mainContext.add(cursorOriginModifier).add(cursorModifier).add(cursorSurface);
};


var addFrogFeatures = function(frog) {
  // define a frog and add it to this
  var frogView = new ImageSurface({
      size: [ANIMALSIZE * TILESIZE, ANIMALSIZE * TILESIZE],
      content: 'img/frog.png',
  });
  frogView.addClass("frog")
  var frogTranslateModifier = new Modifier({
    transform : function() {
      var animalPosition = this.get('screenPosition').slice(0);
      return Transform.translate(animalPosition[0], animalPosition[1], 0);
    }.bind(frog)
  });

  mainContext.add(frogTranslateModifier).add(frogView);
  frog.set('view', frogView);
};

var addBirdFeatures = function(bird) {
  var birdView = new ImageSurface({
      size: [ANIMALSIZE * TILESIZE, ANIMALSIZE * TILESIZE],
      content: 'img/bird-compressed.png',
  });
  birdView.addClass("bird");

  var birdTranslateModifier = new Modifier({
    transform : function(){
      var animalPosition = this.get('screenPosition').slice(0);
      return Transform.translate(animalPosition[0], animalPosition[1], 0);
    }.bind(bird)
  });

  mainContext.add(birdTranslateModifier).add(birdView);
  bird.set('view', birdView);
};
