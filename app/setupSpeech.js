/*****************************************************************/
/******** SPEECH RECOGNITION SETUP YOU CAN IGNORE ****************/
/*****************************************************************/
var debouncedProcessSpeech = _.debounce(processSpeech, 500);

var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.onresult = function(event) {
  // Build the interim transcript, so we can process speech faster
  var transcript = '';
  var hasFinal = false;
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal)
      hasFinal = true;
    else
      transcript += event.results[i][0].transcript;
  }

  if (DEBUGSPEECH) {
    if (hasFinal)
      speechFeedback.setContent("SPEECH RECOGNITION: ready");
    else
      speechFeedback.setContent("I HEARD: " + transcript);
  }

  var processed = debouncedProcessSpeech(transcript);

  // If we reacted to speech, kill recognition and restart
  if (processed) {
    recognition.stop();
  }
};
// Restart recognition if it has stopped
recognition.onend = function(event) {
  setTimeout(function() {
    if (DEBUGSPEECH)
      speechFeedback.setContent("SPEECH RECOGNITION: ready");
    recognition.start();
  }, 1000);
};
recognition.start();
/*****************************************************************/
/******** END OF SPEECH RECOG SETUP ******************************/
/*****************************************************************/
