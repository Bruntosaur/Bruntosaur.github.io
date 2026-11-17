let gameState;

let Font;
let mainBackground = [];
let beak;
let targetImage = [];
let sounds = [];

let poses = [];
let video;
let bodyPose;
let options = {
  //flipping the footage to ml5
  flipped: true,
  //smoothening the position of the nose marker
  enablesmoothing: true,
};

async function setup() {
  createCanvas(640, 480);

  //creates an Overseer class, which handles the entire game
  gameState = new Overseer();

  //initializing the video footage for the ml5 model
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();

  //loading and setting the font
  Font = await loadFont("assets/PressStart2P-Regular.ttf");
  textFont(Font);

  //loading the ml5 function with the chosen options
  bodyPose = await ml5.bodyPose(options);

  //loading the image for the beak
  beak = await loadImage("assets/beak.png");

  //loading the two background images
  for (let i = 0; i < 2; i++) {
    mainBackground.push(await loadImage("assets/background" + i + ".png"));
  }

  //loading the two target images
  for (let i = 0; i < 2; i++) {
    targetImage.push(await loadImage("assets/target" + i + ".png"));
  }

  //loading all sounds
  for (let i = 0; i < 4; i++) {
    sounds.push(await createAudio("assets/sound" + i + ".wav"));
  }

  //Start detecting video and deposit results in function gotPoses
  bodyPose.detectStart(video, gotPoses);

  //start the background score, loop it and decrease its volume
  sounds[3].play();
  sounds[3].loop();
  sounds[3].volume(0.3);
}

function draw() {
  //run the game. The class.js file provides more information
  gameState.gameManager();
}

function gotPoses(results) {
  //store results in poses
  poses = results;
}

function mousePressed() {
  //see class.js in the Overseer class.
  gameState.hit();
}
