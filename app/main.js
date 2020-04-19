var animalBoard = new AnimalBoard();
var cursor = new Cursor();

// animal currently picked up for follow me command
var currentlyChosenAnimal = false;

//at most one animal being hovered over!!!
var currenthoveringAnimal = false;

// UI SETUP
setupUserInterface();

var cursorPositionOffsets = [0, 300];
var previousCursorTile = false;

// isGrabbing: Is the player's hand currently in a grabbing pose
var isGrabbing = false;

Leap.loop({ hand: function(hand) {
  // move the cursor
  var cursorPosition = [hand.screenPosition()[0] + cursorPositionOffsets[0],
                        hand.screenPosition()[1] + cursorPositionOffsets[1]];

  cursor.setScreenPosition(cursorPosition);

  // handle some visual cues on the screen!!!
  if (currentlyChosenAnimal) {
    var animalPosition = getSnappedAnimalScreenPosition(cursorPosition);
    if (animalPosition) {
      // make the movement for follow me more smooth, instead of snapping into tile positions
      var animalcursorposition = [cursorPosition[0]-40, cursorPosition[1] - 40];
      currentlyChosenAnimal.setScreenPosition(animalcursorposition, animalPosition[1]);
    }
  } else {
    // no animal being dragged, free to highlight!
    var cursorTile = getIntersectingTile(cursorPosition);

    // minor optimization: do not keep reprocessing for the same tile
    if (previousCursorTile === cursorTile) {
      return;
    } else {
      previousCursorTile = cursorTile;
    }

    if (cursorTile) {
      var newAnimalHover = animalBoard.findAnimalAtPosition(cursorTile);
      if (newAnimalHover) {
        // was not hovering over something already
        if (!currenthoveringAnimal) {
          newAnimalHover.get("view").addClass("animalhovering");
          currenthoveringAnimal = newAnimalHover;
        } else {
            // was hovering over another animal
            if (currenthoveringAnimal !== newAnimalHover) {
              currenthoveringAnimal.get("view").removeClass("animalhovering");
              newAnimalHover.get("view").addClass("animalhovering");
              currenthoveringAnimal = newAnimalHover;
            }
        }
      } else {
        // was hovering over something
        if (currenthoveringAnimal) {
          currenthoveringAnimal.get("view").removeClass("animalhovering");
          currenthoveringAnimal = false;
        }
      }
    }
  }

}}).use('screenPosition', {scale: LEAPSCALE});


// processSpeech(transcript)
//  Is called anytime speech is recognized by the Web Speech API
// Input:
//    transcript, a string of possibly multiple words that were recognized
// Output:
//    processed, a boolean indicating whether the system reacted to the speech or not
var processSpeech = function(transcript) {
  // Helper function to detect if any commands appear in a string
  var userSaid = function(str, commands) {
    for (var i = 0; i < commands.length; i++) {
      if (str.indexOf(commands[i]) > -1)
        return true;
    }
    return false;
  };
  var userCommand = transcript.toLowerCase();
  var processed = false;
  if (currentlyChosenAnimal) {
    // cannot do another action with speech
    if (userSaid(userCommand, ["to here", "to hear", "stop following me", "stop here"])) {
      // grab new location!!
      var animalPosition = getSnappedAnimalScreenPosition(cursor.get("screenPosition"));
      if (!animalPosition) {
        console.log("new location off screen/ invalid location picked!");
        return false;
      }

      // TODO: move the animal, handles checking bounds etc
      currentlyChosenAnimal.setScreenPosition(animalPosition[0], animalPosition[1]);
      currentlyChosenAnimal = false;
      return true;

    } else {
      console.log("cannot process another command while an animal is selected")
      return false;
    }
  } else {
    if (userSaid(userCommand, ["move from here", "follow me"])) {
      var cursorTile = getIntersectingTile(cursor.get("screenPosition"));
      if (!cursorTile) {
        console.log("not pointing at board");
        return true;
      }

      currentlyChosenAnimal = animalBoard.findAnimalAtPosition(cursorTile);
      console.log("animal found = " + currentlyChosenAnimal);
      return true;
    }
  }

  if (userSaid(userCommand, ["put frog here", "froggy here", "draw frog", "put a frog here", "put a frog"])) {
    var animalPosition = getSnappedAnimalScreenPosition(cursor.get("screenPosition"));
    if (!animalPosition) { return false; }
    animalBoard.addAnimal("frog", animalPosition[0], animalPosition[1]);
    processed = true;
  } else if (userSaid(userCommand, ["put bird here", "put a bird here", "draw bird", "put a bird", "bird here", "bird hear"])) {
    var animalPosition = getSnappedAnimalScreenPosition(cursor.get("screenPosition"));
    if (!animalPosition) { return false;}
    animalBoard.addAnimal("bird", animalPosition[0], animalPosition[1]);
    processed = true;
    // TODO: add animal specific sounds
  } else if (userSaid(userCommand, ["everybody sing"])) {
    animalBoard.makeAllSing();
  } else if (userSaid(userCommand, ["sing", "speak"])) {
    if (currenthoveringAnimal) {
      currenthoveringAnimal.makeSing(false);
    } else {
      console.log("cannot speak if not pointing to an animal");
    }
  } else if (userSaid(userCommand, ["go away"])) {
    //console.log("go away");
    if (userSaid(userCommand, ["all", "everybody", "everyone", "every"])) {
      animalBoard.removeAnimal("", "");
    } else if (userSaid(userCommand, ["birds"])) {
      animalBoard.removeAnimal("", "bird");
    } else if (userSaid(userCommand, ["frogs"])) {
      animalBoard.removeAnimal("", "frog");
    } else {
      var cursorTile = getIntersectingTile(cursor.get("screenPosition"));
      if (!cursorTile) { return false; }//console.log("delete off screen");
      var animalToDelete = animalBoard.findAnimalAtPosition(cursorTile);
      if (!animalToDelete) { return false; }//console.log("delete no animal");
      animalBoard.removeAnimal(animalToDelete, "");
    }
  }

  return processed;
};
