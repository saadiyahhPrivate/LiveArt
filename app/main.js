// GAME SETUP
// var initialState = SKIPSETUP ? "playing" : "setup";
// var gameState = new GameState({state: initialState});
// var cpuBoard = new Board({autoDeploy: true, name: "cpu"});
// var playerBoard = new Board({autoDeploy: SKIPSETUP, name: "player"});

var animalBoard = new AnimalBoard();
var cursor = new Cursor();

var currentlyChosenAnimal = false;

// UI SETUP
setupUserInterface();

// selectedTile: The tile that the player is currently hovering above
var selectedTile = false;

var cursorPositionOffsets = [0, 300]

// isGrabbing: Is the player's hand currently in a grabbing pose
var isGrabbing = false;

// make sure player is palcing their ships on the board
Leap.loop({ hand: function(hand) {
  unhighlightTiles();

  // move the cursor
  var cursorPosition = [hand.screenPosition()[0] + cursorPositionOffsets[0],
                        hand.screenPosition()[1] + cursorPositionOffsets[1]];
  cursor.setScreenPosition(cursorPosition);

  if (currentlyChosenAnimal) {
    var animalPosition = getSnappedAnimalScreenPosition(cursorPosition);
    if (animalPosition) {
      currentlyChosenAnimal.setScreenPosition(animalPosition[0], animalPosition[1]);
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
  } else if (userSaid(userCommand, ["put bird here", "put a bird here", "draw bird", "put a bird"])) {
    var animalPosition = getSnappedAnimalScreenPosition(cursor.get("screenPosition"));
    if (!animalPosition) { return false;}
    animalBoard.addAnimal("bird", animalPosition[0], animalPosition[1]);
    processed = true;
    // TODO: add animal specific sounds
  } else if (userSaid(userCommand, ["everybody sing"])) {
    animalBoard.makeAllSing();
  }

  return processed;
};

// MAIN GAME LOOP
// Called every time the Leap provides a new frame of data
// Leap.loop({ hand: function(hand) {
//   // Clear any highlighting at the beginning of the loop
//   unhighlightTiles();
//
//   // TODO: 4.1, Moving the cursor with Leap data
//   // Use the hand data to control the cursor's screen position
//   var cursorPosition = [hand.screenPosition()[0] + cursorPositionOffsets[0],
//                         hand.screenPosition()[1] + cursorPositionOffsets[1]];
//   cursor.setScreenPosition(cursorPosition);
//
//   // TODO: 4.1
//   // Get the tile that the player is currently selecting, and highlight it
//   selectedTile = getIntersectingTile(cursorPosition)
//   if (selectedTile) {
//     console.log("coloring tile")
//     highlightTile(selectedTile, Colors.RED);
//   }
//
//   // SETUP mode
//   if (gameState.get('state') == 'setup') {
//     background.setContent("<h1>battleship</h1><h3 style='color: #7CD3A2;'>deploy ships</h3>");
//     // TODO: 4.2, Deploying ships
//     //  Enable the player to grab, move, rotate, and drop ships to deploy them
//
//     // First, determine if grabbing pose or not
//     isGrabbing = hand.grabStrength >= 0.35 && hand.pinchStrength >= 0.65;
//
//     // Grabbing, but no selected ship yet. Look for one.
//     // TODO: Update grabbedShip/grabbedOffset if the user is hovering over a ship
//     if (!grabbedShip && isGrabbing) {
//       var possibleShip = getIntersectingShipAndOffset(cursorPosition);
//       if (possibleShip) {
//         grabbedShip = possibleShip.ship;
//         grabbedOffset = possibleShip.offset;
//       }
//     }
//
//     // Has selected a ship and is still holding it
//     // TODO: Move the ship
//     else if (grabbedShip && isGrabbing) {
//       var newShipPosition = [cursorPosition[0] - grabbedOffset[0],
//                              cursorPosition[1] - grabbedOffset[1]]
//       grabbedShip.setScreenPosition(newShipPosition);
//       grabbedShip.setScreenRotation(hand.roll());
//     }
//
//     // Finished moving a ship. Release it, and try placing it.
//     // TODO: Try placing the ship on the board and release the ship
//     else if (grabbedShip && !isGrabbing) {
//       placeShip(grabbedShip);
//       grabbedShip = false;
//     }
//   }
//
//   // PLAYING or END GAME so draw the board and ships (if player's board)
//   // Note: Don't have to touch this code
//   else {
//     if (gameState.get('state') == 'playing') {
//       background.setContent("<h1>battleship</h1><h3 style='color: #7CD3A2;'>game on</h3>");
//     }
//     else if (gameState.get('state') == 'end') {
//       var endLabel = gameState.get('winner') == 'player' ? 'you won!' : 'game over';
//       background.setContent("<h1>battleship</h1><h3 style='color: #7CD3A2;'>"+endLabel+"</h3>");
//     }
//
//     var board = gameState.get('turn') == 'player' ? cpuBoard : playerBoard;
//     // Render past shots
//     board.get('shots').forEach(function(shot) {
//       var position = shot.get('position');
//       var tileColor = shot.get('isHit') ? Colors.RED : Colors.YELLOW;
//       highlightTile(position, tileColor);
//     });
//
//     // Render the ships
//     playerBoard.get('ships').forEach(function(ship) {
//       if (gameState.get('turn') == 'cpu') {
//         var position = ship.get('position');
//         var screenPosition = gridOrigin.slice(0);
//         screenPosition[0] += position.col * TILESIZE;
//         screenPosition[1] += position.row * TILESIZE;
//         ship.setScreenPosition(screenPosition);
//         if (ship.get('isVertical'))
//           ship.setScreenRotation(Math.PI/2);
//       } else {
//         ship.setScreenPosition([-500, -500]);
//       }
//     });
//
//     // If playing and CPU's turn, generate a shot
//     if (gameState.get('state') == 'playing' && gameState.isCpuTurn() && !gameState.get('waiting')) {
//       gameState.set('waiting', true);
//       generateCpuShot();
//     }
//   }
// }}).use('screenPosition', {scale: LEAPSCALE});

// // processSpeech(transcript)
// //  Is called anytime speech is recognized by the Web Speech API
// // Input:
// //    transcript, a string of possibly multiple words that were recognized
// // Output:
// //    processed, a boolean indicating whether the system reacted to the speech or not
// var processSpeech = function(transcript) {
//   // Helper function to detect if any commands appear in a string
//   var userSaid = function(str, commands) {
//     for (var i = 0; i < commands.length; i++) {
//       if (str.indexOf(commands[i]) > -1)
//         return true;
//     }
//     return false;
//   };
//
//   var processed = false;
//   var userCommand = transcript.toLowerCase();
//   if (userSaid(userCommand, ["put frog here", "frog here", "frog"])) {
//     processed = true;
//     animalBoard.addAnimal("frog", cursor.get("screenPosition").slice(0));
//   } else if (userSaid(userCommand, ["put bird here", "bird here", "bird"])) {
//     processed = true;
//     console.log(cursor.screenPosition);
//     animalBoard.addAnimal("bird", cursor.get("screenPosition").slice(0));
//   }
//
//   return processed;
// };

  // if (gameState.get('state') == 'setup') {
  //   // TODO: 4.3, Starting the game with speech
  //   // Detect the 'start' command, and start the game if it was said
  //   var userCommand = transcript.toLowerCase();
  //   if (userSaid(userCommand, ["start"])) {
  //
  //     var gameStartMessage = ["Let's play a game.",
  //                             "So exciting, let's play this game.",
  //                             "Here we go!"];
  //     generateSpeech(gameStartMessage[Math.floor(Math.random() * gameStartMessage.length)]);
  //     gameState.startGame();
  //     processed = true;
  //   }
  // }
  //
  // else if (gameState.get('state') == 'playing') {
  //   if (gameState.isPlayerTurn()) {
  //     // TODO: 4.4, Player's turn
  //     // Detect the 'fire' command, and register the shot if it was said
  //     var userCommand = transcript.toLowerCase();
  //     if (userSaid(userCommand, ["fire", "shoot"])) { // added shoot as a way to fire
  //       registerPlayerShot();
  //       processed = true;
  //     }
  //   }
  //
  //   else if (gameState.isCpuTurn() && gameState.waitingForPlayer()) {
  //     // TODO: 4.5, CPU's turn
  //     // Detect the player's response to the CPU's shot: hit, miss, you sunk my ..., game over
  //     // and register the CPU's shot if it was said
  //     var voiceCommands = ["hit", "miss", "game over", "you sunk my", "sunk"];
  //     var userCommand = transcript.toLowerCase();
  //     if (userSaid(userCommand, voiceCommands)) {
  //       registerCpuShot(userCommand);
  //       processed = true;
  //     }
  //   }
  // }
  //
  // return processed;
// };

// // TODO: 4.4, Player's turn
// // Generate CPU speech feedback when player takes a shot
// var numberPlayerHits = 0;
// var numberPlayerMisses = 0;
// var registerPlayerShot = function() {
//   // TODO: CPU should respond if the shot was off-board
//   if (!selectedTile) {
//     var notOnboardMessages = ["At least shoot at something that is on the board.",
//                               "What terrible aim! shoot at the board.",
//                               "What exactly are you aiming at?"];
//     generateSpeech(notOnboardMessages[Math.floor(Math.random() * notOnboardMessages.length)]);
//   }
//
//   // If aiming at a tile, register the player's shot
//   else {
//     var shot = new Shot({position: selectedTile});
//     var result = cpuBoard.fireShot(shot);
//
//     // Duplicate shot
//     if (!result) {
//       var alreadyShotAt = ["Try a cell you have not fired at before",
//                            "I even colored in the cells for you, aim at something grey."];
//       generateSpeech(alreadyShotAt[Math.floor(Math.random() * alreadyShotAt.length)]);
//       return;
//     }
//
//     // TODO: Generate CPU feedback in three cases
//     // Game over
//     if (result.isGameOver) {
//       gameState.endGame("player");
//       var playerWin = ["Looks like you've bested me this time. Game over.",
//                        "You won, game over.",
//                        "You just got lucky this time. I will win next time."];
//       generateSpeech(playerWin[Math.floor(Math.random() * playerWin.length)]);
//       return;
//     }
//
//     // Sunk ship
//     else if (result.sunkShip) {
//       var shipName = result.sunkShip.get('type');
//       var playerSink = ["You've sunk my " + shipName,
//                         "You just got lucky this time. You sunk my " + shipName,
//                         "You've sunk my " + shipName];
//       // var audio = new Audio('/sounds/bomb1.mp3');
//       // audio.play().then(generateSpeech(playerSink[Math.floor(Math.random() * playerSink.length)]));
//       generateSpeech(playerSink[Math.floor(Math.random() * playerSink.length)]);
//
//     }
//
//     // Hit or miss
//     else {
//       var isHit = result.shot.get('isHit');
//       if (isHit) {
//         numberPlayerHits = numberPlayerHits + 1;
//         numberPlayerMisses = 0;
//         if (numberPlayerHits >= 3) {
//           var playerManyHits = ["Impressive, so many hits in a row!",
//                                 "Damn! that was yet another hit. What's your secret?",
//                                 "You just got lucky this time, Don't think you can beat me, human."];
//           generateSpeech(playerManyHits[Math.floor(Math.random() * playerManyHits.length)]);
//         }
//         generateSpeech("That was a hit.");
//       } else {
//         numberPlayerMisses = numberPlayerMisses + 1;
//         numberPlayerHits = 0;
//         if (numberPlayerMisses >= 2) {
//           var playerManyMisses = ["Ha ha. You are terrible at this.",
//                                   "wow, "+ numberPlayerMisses + " times in a row.",
//                                   "" + numberPlayerMisses + " misses in a row! Are you even trying?"];
//           generateSpeech(playerManyMisses[Math.floor(Math.random() * playerManyMisses.length)]);
//         }
//         generateSpeech("That was a miss.");
//       }
//     }
//
//     if (!result.isGameOver) {
//       // TODO: Uncomment nextTurn to move onto the CPU's turn
//       if (Math.random() > 0.6) {
//         var cpuChitChat = ["What should I fire at this time? I know.",
//                            "My turn.",
//                            "Are you ready for my next move?"];
//         generateSpeech(cpuChitChat[Math.floor(Math.random() * cpuChitChat.length)]);
//       }
//       nextTurn();
//     }
//   }
// };
//
// // TODO: 4.5, CPU's turn
// // Generate CPU shot as speech and blinking
// var cpuShot;
// var generateCpuShot = function() {
//   // Generate a random CPU shot
//   cpuShot = gameState.getCpuShot();
//   var tile = cpuShot.get('position');
//   var rowName = ROWNAMES[tile.row]; // e.g. "A"
//   var colName = COLNAMES[tile.col]; // e.g. "5"
//
//   // TODO: Generate speech and visual cues for CPU shot
//   generateSpeech("Fire at cell " + rowName + colName);
//   blinkTile(tile);
// };
//
// // TODO: 4.5, CPU's turn
// // Generate CPU speech in response to the player's response
// // E.g. CPU takes shot, then player responds with "hit" ==> CPU could then say "AWESOME!"
// var cpuWins = 0;
// var cpuMisses = 0;
// var numberPlayerLies = 0;
// var registerCpuShot = function(playerResponse) {
//   // Cancel any blinking
//   unblinkTiles();
//   var result = playerBoard.fireShot(cpuShot);
//
//   // NOTE: Here we are using the actual result of the shot, rather than the player's response
//   // In 4.6, you may experiment with the CPU's response when the player is not being truthful!
//
//   var userSaid = function(str, commands) {
//     for (var i = 0; i < commands.length; i++) {
//       if (str.indexOf(commands[i]) > -1)
//         return true;
//     }
//     return false;
//   };
//
//   // TODO: Generate CPU feedback in three cases
//   // Game over
//   if (result.isGameOver) {
//     gameState.endGame("cpu");
//     var cpuWin = ["Victory is mine! Did you really think you could win?",
//                   "I win, you lose. Better luck next time.",
//                   "I win. Bow down to your robot overlord, human."];
//     generateSpeech(cpuWin[Math.floor(Math.random() * cpuWin.length)]);
//     return;
//   }
//   // Sunk ship
//   else if (result.sunkShip) {
//     var shipName = result.sunkShip.get('type');
//     var cpuSink = ["Say goodbye to your "+ shipName + ". Haha.",
//                    "If you are looking for your " + shipName + ", it is at the bottom of the ocean.",
//                    "Oh yes! I got your " + shipName];
//     generateSpeech(cpuSink[Math.floor(Math.random() * cpuSink.length)]);
//   }
//
//   // Hit or miss
//   else {
//     var isHit = result.shot.get('isHit');
//     if (isHit) {
//       cpuWins = cpuWins + 1;
//       cpuMisses = 0;
//       if (userSaid(playerResponse.toLowerCase(), ["miss"])) {
//         numberPlayerLies = numberPlayerLies + 1;
//         var cpuCallOut = ["Liar, Liar. Pants on fire.",
//                           "You scum, are you so desperate to win?",
//                           "I know everything. How dare you lie?"];
//         generateSpeech(cpuCallOut[Math.floor(Math.random() * cpuCallOut.length)]);
//         if (numberPlayerLies > 1) {
//           gameState.endGame("cpu");
//           generateSpeech("I do not give second chances. I win by default. Goodbye liar.");
//           return;
//         } else {
//           generateSpeech("I will let it slide this time but there won't be a second time.");
//         }
//       }
//
//       if (cpuWins >= 2) {
//         var cpuGloat = ["I am so good at this.",
//                         "Damn! you arranged these ships badly.",
//                         "This is what skill looks like."];
//         generateSpeech(cpuGloat[Math.floor(Math.random() * cpuGloat.length)]);
//       }
//       generateSpeech("That's a hit for me. I'm awesome at this game.");
//     } else {
//       cpuMisses = cpuMisses + 1;
//       cpuWins = 0;
//       if (cpuMisses >= 2) {
//         var cpuMissed = ["Damn you arranged those ships well.",
//                          "Damn! that was yet another miss.",
//                          "I missed again."];
//         generateSpeech(cpuMissed[Math.floor(Math.random() * cpuMissed.length)]);
//       }
//       if (Math.random() > 0.6) {
//         var cpuMissedFollowup = ["No worries, I'll get a hit next time.",
//                                  "Don't worry, I'll be more lucky next round.",
//                                  "I am just a little bit rusty."];
//         generateSpeech(cpuMissedFollowup[Math.floor(Math.random() * cpuMissedFollowup.length)]);
//       }
//     }
//   }
//
//   if (!result.isGameOver) {
//     // TODO: Uncomment nextTurn to move onto the player's next turn
//     var cpuTaunt = ["Your turn, human.",
//                     "Let's see what you can do. I am not holding my breath.",
//                     "Your turn, human. Do your best."];
//     generateSpeech(cpuTaunt[Math.floor(Math.random() * cpuTaunt.length)]);
//     nextTurn();
//   }
// };
