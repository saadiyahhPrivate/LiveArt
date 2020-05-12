# LiveArt

Welcome to **LiveArt**, a project built for 6.835, Multimodal User Interactions, for Spring 2020.
![Cover](img/LiveArt_Cover.png)

## Collaborators:
- Saadiyah Husnoo (saadiyah@mit.edu)
- Alice Wu (alice_wu@mit.edu)

## Code Layout:

The code is laid out in multiple folders to ease navigation. Our folders and their contents are as follows:
- `app`: Contains the game logic.
- `css`: Contains the css used throughout
- `img`: Contains all images our system uses.
- `lib`: Contains all supporting libraries we leverage.
- `sounds`: Contains all sound files we use.

The app folder, in particular, contains the bulk of our logic. The specific files are as follows:
- `config.js`: This file contains some global variables that are used throughout.
- `helpers.js`: This folder contains various helper functions used throughout. These helpers are functions that did not quite fit in the models, or were used in multiple files.
- `main.js`: This file contains the bulk of our custom logic, including leap motion information parsing as well as other logic that handles speech input and generates speech output based on usr interactions.
- `models.js`: Contains the various models we designed to abstract the per animal characteristics, the menu and the board in general. This code is where we randomize the images and sounds per animal species as well and handle most of the validation logic to determine valid moves etc.
- `setup.js`: Contains most of our famou.us code that dictates the visuals of the board and animals.
- `setupSpeech.js`: this file triggers the speech recognition loop

Finally the pdf file `final_project_writeup.pdf` contains a cover page as well as our final project writeup for the class.

## Instructions to run code:

To run the code, navigate into the LiveArt folder and run `python -m http.server [PORT]`. We used python 3.7. You can then navigate to `localhost:[PORT]` to use LiveArt.

When the page is loaded, the user must first click anywhere on the page to enable the ability to play sounds (on Chrome). If needed they should then enable microphone permissions and connect the leap motion device.

For convenience, LiveArt is also hosted [here](https://alice_wu.scripts.mit.edu/LiveArt) and a video demo can be found on youtube [here](https://www.youtube.com/watch?v=mRWDTj0sxaQ).

We hope you enjoy interacting with LiveArt!
