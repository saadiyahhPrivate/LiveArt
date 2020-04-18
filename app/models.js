var Cursor = Backbone.Model.extend({
  defaults: {
    screenPosition: [0, 0]
  },
  setScreenPosition: function(position) {
    this.set('screenPosition', position.slice(0));
  }
});

function shuffle(o){ //v1.0
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

var Animal = Backbone.Model.extend({
  defaults: {
    length: 4, // length: ANIMALSIZE,
    isRemoved: false,
    position: {row: 0, col: 0},
    screenPosition: [0, 0],
    startPosition: [0, 0],
  },

  initialize: function() {
    this.eventOutput = new EventHandler();
    this.eventInput = new EventHandler();
    EventHandler.setInputHandler(this, this.eventInput);
    EventHandler.setOutputHandler(this, this.eventOutput);

    this.eventInput.on('sing', function() {
      if (this.get("isBird")) {
        console.log("bird singing triggered");
      } else {
          console.log("frog singing triggered");
      }
    }.bind(this));
  },

  setScreenPosition: function(screenposition, tileposition) {
    this.set('screenPosition', screenposition.slice(0));
    this.set('position', {row:tileposition.row, col:tileposition.col});
  },

  getEndpoints: function() {
    var endpoint = {
      row: this.get('position').row,
      col: this.get('position').col
    };
    endpoint.col += this.get('length') - 1;
    endpoint.row += this.get('length') - 1;
    return {start: this.get('position'), end: endpoint};
  },

  getScreenOrigin: function() {
    var origin = this.get('screenPosition').slice(0);
    return origin;
  },

  overlaps: function(otherAnimal) {
    var a = this.getEndpoints();
    var b = otherAnimal.getEndpoints();

    return (a.start.row <= b.end.row
            && a.end.row >= b.start.row
            && a.start.col <= b.end.col
            && a.end.col >= b.start.col);
  },

  overlapsCursor: function(cursortileposition) {
    var a = this.getEndpoints();
    return (a.start.row <= cursortileposition.row
            && a.end.row >= cursortileposition.row
            && a.start.col <= cursortileposition.col
            && a.end.col >= cursortileposition.col);
  }
});
var AnimalSet = Backbone.Collection.extend({model: Animal});

var AnimalBoard = Backbone.Model.extend({
  initialize: function() {
    var animals = new AnimalSet();
    this.set('animals', animals);

    this.eventOutput = new EventHandler();
    this.eventInput = new EventHandler();
    EventHandler.setInputHandler(this, this.eventInput);
    EventHandler.setOutputHandler(this, this.eventOutput);

    this.eventInput.on('sing', function(){
      this.get("animals").forEach(function(animal) {
        animal.trigger('sing');
      })
    }.bind(this));
  },

  makeAllSing: function() {
    this.trigger("sing");
  },

  addAnimal: function(animalType, cursorPosition, tilespostion) {
    //TODO: add checking for positions etc

    if (animalType === "") {
      return;
    }

    var newAnimal = new Animal({
      type: animalType,
      screenPosition: cursorPosition,
      position: tilespostion,
      startPosition:cursorPosition,
    });

    var overlap = false;
    this.get('animals').forEach(function(otherAnimal) {
      if (!overlap) {
        overlap = otherAnimal.overlaps(newAnimal);
      }
    });

    // No overlaps and not out of bounds, so deploy
    if (overlap) {
      console.log("overlap detected");
      return;
    }

    if (animalType === "bird") {
      addBirdFeatures(newAnimal);
      newAnimal.set("isFrog", false);
      newAnimal.set("isBird", true);
    } else {
      addFrogFeatures(newAnimal);
      newAnimal.set("isFrog", true);
      newAnimal.set("isBird", false);
    }

    this.get("animals").add(newAnimal);

    console.log("new number of animals = " + this.get("animals").length);
    // TODO: how do i bind the sprite/ image for the actual animal on the screen
  },

  outOfBounds: function(animal) {
    var endpoints = animal.getEndpoints();
    var start = endpoints.start;
    var end = endpoints.end;
    return (start.row < 0 || start.row >= NUMTILES_HEIGHT
      || start.col < 0 || start.col >= NUMTILES_WIDTH
      || end.row < 0 || end.row >= NUMTILES_HEIGHT
      || end.col < 0 || end.col >= NUMTILES_WIDTH);
  },

  findAnimalAtPosition: function(cursortileposition) {
    // compute the relevant tile here first!!!
    var animalFound = false;
    this.get("animals").forEach(function(animal) {
      if (!animalFound) {
          if (animal.overlapsCursor(cursortileposition)) {
            animalFound = animal;
          } else {
            console.log("DID NOT MATCH");
            console.log("Cursor position was = " + cursortileposition);
            console.log("animal position = " + animal.get("screenPosition"));
          }
      }
    });
    return animalFound;
  },

  removeAnimal: function(animal, animalType) {
    //console.log("removeAnimal");
    if (animal == "") {
      animals = this.get("animals");
      for (var i = 0; i < animals.length; i++) {
        thisAnimal = animals[i];
        var isMatch = false;
        if (animalType === "") {
          isMatch = true;
        } else {
          isMatch = (thisAnimal.type == animalType);
        }

        if (isMatch) {
          thisAnimal.isRemoved = true;
        }
      }
    } else {
      //console.log("remove single animal");
      animal.isRemoved = true;
      //console.log("single removed");
    }
  }
});


// OLD code to scrap!!
// var GameState = Backbone.Model.extend({
//   defaults: {
//     state: "setup", // setup, playing, end
//     turn: "player",  // player, cpu
//     boards: [],
//     waiting: true
//   },
//
//   initialize: function() {
//     _.bindAll(this, 'waitingForPlayer', 'nextTurn');
//     var shotSequence = [];
//     for (var row = 0; row < NUMTILES; row++) {
//       for (var col = 0; col < NUMTILES; col++) {
//         shotSequence.push({row: row, col: col});
//       }
//     }
//     shuffle(shotSequence);
//     var shots = shotSequence.map(function(pos) { return new Shot({position: pos}); });
//     this.set('cpuShots', new ShotSet(shots));
//   },
//
//   waitingForPlayer: function() {
//     return this.get('waiting');
//   },
//
//   startGame: function() {
//     if (this.get('state') == 'setup')
//       this.set('state', 'playing');
//     else
//       alert("Not in setup mode, so can't start game");
//   },
//
//   endGame: function(winner) {
//     if (this.get('state') == 'playing') {
//       this.set('state', 'end');
//       this.set('winner', winner);
//     }
//     else
//       alert("Not playing, so can't end game");
//   },
//
//   nextTurn: function() {
//     if (this.get('state') == 'playing') {
//       this.set('turn', this.isPlayerTurn() ? "cpu" : "player");
//       // At beginning of CPU turn, generate shot
//       // At beginning of Player turn, waiting for player to fire
//       this.set('waiting', this.isPlayerTurn());
//     }
//   },
//
//   isCpuTurn: function() {
//     return this.get('turn') == 'cpu';
//   },
//
//   isPlayerTurn: function() {
//     return this.get('turn') == 'player';
//   },
//
//   getCpuShot: function() {
//     return this.get('cpuShots').shift();
//   },
//
//   getTurnHTML: function() {
//     var turnName = this.isPlayerTurn() ? "your" : "CPU";
//     var boardName = this.isPlayerTurn() ? "CPU" : "your";
//
//     return "<h3>"+turnName+" turn<h3><h3 style='color: #7CD3A2;'>"+boardName+" board <span class='glyphicon glyphicon-arrow-right'></span></h3>";
//   },
// });
//
// var Shot = Backbone.Model.extend({
//   defaults: {
//     position: {row: 0, col: 0},
//     isHit: false
//   }
// });
// var ShotSet = Backbone.Collection.extend({model: Shot});
//
// var Ship = Backbone.Model.extend({
//   defaults: {
//     length: 0,
//     isDeployed: false,
//     position: {row: 0, col: 0},
//     screenPosition: [0, 0],
//     startPosition: [0, 0],
//     screenRotation: 0,
//     isVertical: false,
//     health: 0
//   },
//
//   initialize: function() {
//     this.set("health", this.get("length"));
//   },
//
//   setScreenPosition: function(position) {
//     this.set('screenPosition', position.slice(0));
//   },
//
//   setScreenRotation: function(rotation) {
//     this.set('screenRotation', rotation);
//   },
//
//   setBoardPosition: function(position) {
//     this.set('position', position);
//   },
//
//   resetShip: function() {
//     this.set('screenPosition', this.get('startPosition').slice(0));
//     this.set('screenRotation', 0);
//     this.set('isVertical', false);
//   },
//
//   // snapRotation: function() {
//   //   var rotation = this.get('screenRotation');
//   //   var diff1 = Math.abs( rotation - Math.PI/2 );
//   //   var diff2 = Math.abs( rotation + Math.PI/2 );
//   //   var isVertical = (diff1 < Math.PI/4 || diff2 < Math.PI/4);
//   //   this.set('screenRotation', isVertical ? Math.PI/2 : 0);
//   //   this.set('isVertical', isVertical);
//   // },
//
//   getEndpoints: function() {
//     var endpoint = {
//       row: this.get('position').row,
//       col: this.get('position').col
//     };
//     if (this.get('isVertical'))
//       endpoint.row += this.get('length') - 1;
//     else
//       endpoint.col += this.get('length') - 1;
//     return {start: this.get('position'), end: endpoint};
//   },
//
//   getScreenOrigin: function() {
//     var origin = this.get('screenPosition').slice(0);
//     if (this.get('isVertical')) {
//       // Get vertical origin
//       origin[0] += this.get('length') * TILESIZE/2;
//       origin[1] -= this.get('length') * TILESIZE/2;
//     }
//     return origin;
//   },
//
//   overlaps: function(otherShip) {
//     var a = this.getEndpoints();
//     var b = otherShip.getEndpoints();
//
//     return (a.start.row <= b.end.row
//             && a.end.row >= b.start.row
//             && a.start.col <= b.end.col
//             && a.end.col >= b.start.col);
//   }
// });
// var ShipSet = Backbone.Collection.extend({model: Ship});
//
// //
//
// var Board = Backbone.Model.extend({
//   initialize: function() {
//     this.set('shots', new ShotSet());
//
//     var ships = new ShipSet();
//     var shipLengths = {
//       battleship: 3,
//       //destroyer: 3,
//       patrolBoat: 2
//     };
//
//     Object.keys(shipLengths).forEach(function(shipType, i) {
//       var ship = new Ship({
//         type: shipType,
//         length: shipLengths[shipType],
//         screenPosition: [0, (i+1)*100],
//         startPosition: [0, (i+1)*100],
//       });
//       ships.add(ship);
//     });
//     this.set('ships', ships);
//
//     if (this.get('autoDeploy'))
//       this.autoDeploy();
//   },
//
//   deployShip: function(ship) {
//     if (this.outOfBounds(ship))
//       return false;
//
//     var overlap = false;
//     this.get('ships').forEach(function(otherShip) {
//       if (ship.get('type') != otherShip.get('type') && ship.get('isDeployed'))
//         overlap = otherShip.overlaps(ship);
//     });
//
//     // No overlaps and not out of bounds, so deploy
//     if (! overlap)
//       ship.set("isDeployed", true);
//
//     return !overlap;
//   },
//
//   outOfBounds: function(ship) {
//     var endpoints = ship.getEndpoints();
//     var start = endpoints.start;
//     var end = endpoints.end;
//     return (start.row < 0 || start.row >= NUMTILES
//       || start.col < 0 || start.col >= NUMTILES
//       || end.row < 0 || end.row >= NUMTILES
//       || end.col < 0 || end.col >= NUMTILES);
//   },
//
//   autoDeploy: function() {
//     var self = this;
//     var offset = this.get('name') == 'cpu' ? 1 : 0;
//     this.get('ships').forEach(function(ship, i) {
//       if (! ship.get('isDeployed')) {
//         ship.set('position', {row: 2*i + offset, col: 0});
//         ship.set('isDeployed', true);
//       }
//     });
//   },
//
//   resetBoard: function() {
//     this.initialize();
//   },
//
//   fireShot: function(shot) {
//     var position = shot.get('position');
//
//     var shotStatus = true;
//     // Check if already shot here
//     this.get('shots').forEach(function(shot) {
//       var otherPosition = shot.get('position');
//       if (otherPosition.row == position.row && otherPosition.col == position.col)
//         shotStatus = false;
//     });
//     if (! shotStatus)
//       return false;
//
//     // Otherwise, see if it's a hit
//     var isGameOver = true;
//     var sunkShip = null;
//     this.get('ships').forEach(function(ship) {
//       var endpoints = ship.getEndpoints();
//       if (endpoints.start.row <= position.row
//             && endpoints.end.row >= position.row
//             && endpoints.start.col <= position.col
//             && endpoints.end.col >= position.col) {
//
//         ship.set('health', ship.get('health') - 1);
//         if (ship.get('health') == 0)
//           sunkShip = ship;
//
//         shot.set('isHit', true);
//       }
//
//       if (ship.get('health') > 0)
//       isGameOver = false;
//     });
//
//     var result = {shot: shot, isGameOver: isGameOver};
//     if (sunkShip != null)
//       result.sunkShip = sunkShip;
//
//     this.get('shots').add(shot);
//
//     return result;
//   }
// });
