
// SPEECH SYNTHESIS SETUP
var voicesReady = false;
window.speechSynthesis.onvoiceschanged = function() {
  voicesReady = true;
  // Uncomment to see a list of voices
  //console.log("Choose a voice:\n" + window.speechSynthesis.getVoices().map(function(v,i) { return i + ": " + v.name; }).join("\n"));
};

var generateSpeech = function(message, callback) {
  if (voicesReady) {
    var msg = new SpeechSynthesisUtterance();
    msg.voice = window.speechSynthesis.getVoices()[VOICEINDEX];
    msg.text = message;
    msg.rate = 0.2;
    if (typeof callback !== "undefined")
      msg.onend = callback;
    speechSynthesis.speak(msg);
  }
};

// getIntersectingTile(screenPosition)
//    Returns the tile enclosing the input screen position
// Input:
//    screenPosition = [x,y]
// Output:
//    tilePosition = {row: r, col: c}, if intersecting the board
//    false, if not intersecting the board
var getIntersectingTile = function(screenPosition) {
  if (screenPosition[0] >= gridOrigin[0] && screenPosition[0] <= gridOrigin[0] + BOARDSIZE_WIDTH
    && screenPosition[1] >= gridOrigin[1] && screenPosition[1] <= gridOrigin[1] + BOARDSIZE_HEIGHT) {
    var column = Math.floor((screenPosition[0] - gridOrigin[0]) / TILESIZE);
    var row = Math.floor((screenPosition[1] - gridOrigin[1]) / TILESIZE);
    var tile = tiles[row*NUMTILES_WIDTH + column];
    return {row: row, col: column};
  }
  else {
    return false;
  }
};

var getSnappedScreenPosition = function(boardPosition) {
  var screenPosition = gridOrigin.slice(0);
  screenPosition[0] += boardPosition.col * TILESIZE;
  screenPosition[1] += boardPosition.row * TILESIZE;
  return screenPosition;
};


// computes the center of the image so we know where to put the animal
var getSnappedAnimalScreenPosition = function(boardPosition) {
  var intersectingtile = getIntersectingTile(boardPosition);

  // pointing off screen
  if (!intersectingtile) { return false; }

  // check if too close to the borders!
  if (intersectingtile.row < 2 || intersectingtile.row > NUMTILES_HEIGHT - 3 ||
      intersectingtile.col < 2 || intersectingtile.col > NUMTILES_WIDTH - 3)
  { return false; }

  var imageTileOrigin = {row: intersectingtile.row - 2, col:intersectingtile.col - 2 };
  var screenPosition = gridOrigin.slice(0);
  screenPosition[0] += imageTileOrigin.col * TILESIZE;
  screenPosition[1] += imageTileOrigin.row * TILESIZE;
  return [screenPosition, imageTileOrigin];
};
