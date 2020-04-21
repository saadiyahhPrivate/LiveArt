var Cursor = Backbone.Model.extend({
  defaults: {
    screenPosition: [0, 0]
  },
  setScreenPosition: function(position) {
    this.set('screenPosition', position.slice(0));
  }
});

var MENU_SCREEN_POSITION = [gridOrigin[0] + Math.floor(0.25 * ($(window).width() * 0.9 / TILESIZE)) * TILESIZE,
                            gridOrigin[1] + Math.floor(0.1 * ($(window).height() * 0.9 / TILESIZE)) * TILESIZE];
var MENU_TILE_POSITION = gridOrigin.slice(0);
MENU_TILE_POSITION[0] += Math.floor(0.125 * ($(window).width() * 0.9 / TILESIZE)) * TILESIZE;
MENU_TILE_POSITION[1] += Math.floor(0.125 * ($(window).height() * 0.9 / TILESIZE)) * TILESIZE;

var Menu = Backbone.Model.extend({
  defaults: {
    length: MENUSIZE,
    screenPosition: MENU_SCREEN_POSITION,
    position: MENU_TILE_POSITION
  },

  initialize: function() {
    this.eventOutput = new EventHandler();
    this.eventInput = new EventHandler();
    EventHandler.setInputHandler(this, this.eventInput);
    EventHandler.setOutputHandler(this, this.eventOutput);
    addMenuFeatures(this);
  },

  setScreenPosition: function(screenposition, tileposition) {
    this.set('screenPosition', screenposition.slice(0));
    this.set('position', {row:tileposition.row, col:tileposition.col});
  },

  makeVisible: function() {
    console.log("makeVisible");
    this.setScreenPosition(MENU_SCREEN_POSITION, MENU_TILE_POSITION);
  },

  makeInvisible: function() {
    console.log("makeInvisible");
    this.setScreenPosition([-5000000, -5000000], {row:-5000000, col:-5000000});
  }
});

function shuffle(o){ //v1.0
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

var Animal = Backbone.Model.extend({
  defaults: {
    length: 4, // length: ANIMALSIZE,
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
      // randomized wait times so sounds do not overlap
      this.makeSing(true);
    }.bind(this));
  },

  makeSing: function(shouldwait) {
    var randomvolume = (Math.random() * 0.90) + 0.10;
    this.get("audioPlayer").volume = randomvolume;

    if(!shouldwait) {
      // when sound trigegred when pointing at a specific animal, no need to wait
      this.get("audioPlayer").play();
    } else {
      // triggered via the "everybody sing" command
      // includes some wait time to stagger the sounds
      var randomwait = Math.floor(Math.random() * 5000);
      setTimeout(() => { this.get("audioPlayer").play(); }, randomwait);};
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
  },
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

    // No overlaps and not out of bounds, so deploy the animal
    if (overlap) {
      console.log("overlap detected");
      return;
    }

    var audio = new Audio();
    if (animalType === "bird") {
      addBirdFeatures(newAnimal);
      newAnimal.set("isFrog", false);
      newAnimal.set("isBird", true);

      // pick audio source randomly
      audio.src = pickSound(BIRD_SOUNDS);
      newAnimal.set("audioPlayer", audio);
    } else {
      addFrogFeatures(newAnimal);
      newAnimal.set("isFrog", true);
      newAnimal.set("isBird", false);
      audio.src = pickSound(FROG_SOUNDS);
      newAnimal.set("audioPlayer", audio);
    }

    this.get("animals").add(newAnimal);
    // console.log("Animals on board = " + this.get("animals").length);
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
          }
      }
    });
    return animalFound;
  },

  removeAnimal: function(animal) {
    //animal.get("translatemodifier") = {};
    animal.setScreenPosition([-100, -100], {row:-1, col:-1});
    this.get("animals").remove(animal);
  },

  removeAllofType: function(animalType) {
    var i = this.get("animals").length;
    while (i--) {
      var currentAnimal = this.get("animals").at(i);
      if (currentAnimal.get(animalType)) {
          this.removeAnimal(currentAnimal);
      }
    }
  },

});
