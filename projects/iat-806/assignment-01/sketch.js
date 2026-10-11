let difficultyLength = 4;
let sequence = [];
let input = [];
let arrows = [" ↑", " ↓", "←", "→"];
let margin = 30;
let success;
let failTimer = 0;
//left false to make sure the first round is not timed
let failPossible = false;
let resetTimer = 0;
let lives = 0;

//fish animation
let frames = [];
let numFrames = 4;
let stateNames = ["happy", "neutral", "angry"];

async function setup() {
  createCanvas(600, 600);

  //create initial sequence
  createSequence(difficultyLength, sequence);

  //create an array in frames[] for every statename and filling that array with the respective images
  for (let i = 0; i < stateNames.length; i++) {
    frames.push([]);
    for (let j = 0; j < numFrames; j++) {
      let fileName = "fish_frames/" + stateNames[i] + j + ".png";
      frames[i].push(await loadImage(fileName));
    }
  }
}

function draw() {
  background(26, 130, 117);

  //The gameplay loop
  if (lives <= 2) {
    //draw the sequence, the input, and the fish animation
    drawSequence(margin);
    drawInput(margin);
    //lives determines what array within frames is accessed, changing the attitude of the salmon (it gets bad)
    animate(frames[lives], 25, width / 6, height / 3, (width / 3) * 2);

    //after winning one round the sequence is timed
    failInput();

    //if there is no value for success yet we check whether the sequence matches the input
    if (success === undefined) {
      success = checkSequence(input, sequence);
    }
    //after the sequence was (mis)matched the sequence is reset
    resetSequence();

    //If you died
  } else if (lives > 2) {
    gameOver();
  }
}

//based on the difficultyLength and the sequence we create an array with random numbers ranging 0-3
function createSequence(difficultyLength, sequence) {
  for (let i = 0; i < difficultyLength; i++) {
    sequence[i] = floor(random(4));
  }
  //update in case sequence length gets updated
  sequence.length = difficultyLength;
}

//first we check whether the input lenght is equal to the sequence lenght, if so we check for every entry in the array if they match
function checkSequence(input, sequence) {
  //if the sequences are not of equal length
  if (input.length !== sequence.length) return undefined;
  //for every entry in the bot arrays see if they match, if not then return false
  for (let i = 0; i < input.length; i++) {
    if (input[i] !== sequence[i]) return false;
  }
  //if nothing is wrong true will be returned
  return true;
}

//drawing the textbox and the sequence
function drawSequence(margin) {
  fill(255);
  textSize(25);
  //little thinking circles
  circle(width / 3, height / 4, 45);
  circle(width / 4 + 5, height / 3, margin);
  //textbox
  rect(
    width / 2 - (30 * sequence.length) / 2 - margin,
    height / 6 - margin,
    (sequence.length + 1) * 30 + margin,
    margin * 1.8,
    30,
  );

  //for every entry in sequence
  for (let i = 0; i < sequence.length; i++) {
    fill(20);

    //if the input matches the sequence colour the arrows turn green
    if (success) {
      fill(0, 255, 0);
      //else if the input does not match the arrows turn red
    } else if (success == false) {
      fill(255, 0, 0);
    }

    //for every number in sequence an arrow is assigned and written down with 30 pixels of distance
    text(
      arrows[sequence[i]],
      width / 2 - (margin * sequence.length) / 2 + margin * i,
      height / 6,
    );
  }
}

//functionally the same as drawing the sequence just in a different colour and place
function drawInput(margin) {
  for (let i = 0; i < input.length; i++) {
    fill(255, 255, 255);

    text(
      arrows[input[i]],
      width / 2 - (margin * sequence.length) / 2 + margin * i,
      (height / 6) * 5,
    );
  }
}

//after the first round failPossible becomes true and the timer starts to run. Based on the lenght of the sequence after a certain amount of time success becomes false
function failInput() {
  if (failPossible == true) {
    failTimer++;
  }
  if (failTimer == 140 + 10 * difficultyLength) {
    success = false;
  }
}

//After every success or fail the sequence resets
function resetSequence() {
  //when success is not undefined
  if (success !== undefined) {
    //we don't want the fail timer to keep running
    failPossible = false;
    //we take a full second to communicate the results of the round to the player
    if (resetTimer == 60) {
      //we create a new sequence
      createSequence(difficultyLength, sequence);
      //we clear the input
      input = [];
      //we reset the reset timer
      resetTimer = 0;
      //we reset the fail timer
      failTimer = 0;
      //if the player failed we increase lives (which is bad)
      if (success == false) lives++;
      //we reset success to undefined
      success = undefined;
      //we enable the fail timer for the next round
      failPossible = true;
    }
    resetTimer++;
  }
}

//Show a lot of stuff when lives > 2
function gameOver() {
  let margin = 30;
  fill(255);
  textAlign(CENTER);
  text("GAME OVER", width / 2, height / 3);
  textSize(15);
  text("THE SALMON GOT MAD AND SWAM AWAY", width / 2, height / 3 + margin);
  text("CLICK TO RETRY", width / 2, height / 3 + 2 * margin);
  textAlign(LEFT);
  textSize(25);
  stroke(255);
  line(width / 3, height / 3 - margin, (width / 3) * 2, height / 3 - margin);
  stroke(0);
}

//Only reset the game if lives > 2
function mousePressed() {
  if (lives > 2) {
    //reset the lives, reset the difficultyLength, create a new sequence, make sure the first round is not timed
    lives = 0;
    difficultyLength = 4;
    createSequence(difficultyLength, sequence);
    failPossible = false;
    success = undefined;
  }
}
// using the arrow keys pushes new entries in the input array
function keyPressed() {
  if (input.length < sequence.length) {
    if (keyCode === 38) input.push(0);
    if (keyCode === 40) input.push(1);
    if (keyCode === 37) input.push(2);
    if (keyCode === 39) input.push(3);
  }
  // with , and . we can in- and decrease the length of the sequence also resetting both it and the input
  if (key === "," && difficultyLength > 1) {
    difficultyLength--;
    createSequence(difficultyLength, sequence);
    input = [];
  }

  if (key === "." && difficultyLength < 12) {
    difficultyLength++;
    createSequence(difficultyLength, sequence);
    input = [];
  }
  //making sure we don't scroll with our arrow keys
  return false;
}

//basic animation frames
function getFrameIndex(speed, frames) {
  let slowFrame = floor(frameCount / speed);
  let index = slowFrame % frames.length;

  return index;
}

//basic animation of fish
function animate(frames, speed, xPos, yPos, imgW, imgH) {
  let index = getFrameIndex(speed, frames);
  let currentFrame = frames[index];
  let origW = currentFrame.width;
  let origH = currentFrame.height;
  //make sure proper ratio is kept
  if (imgW && !imgH) {
    let ratioWH = imgW / origW;
    imgH = ratioWH * origH;
  }

  if (!imgW && imgH) {
    let ratioHW = imgH / origH;
    imgW = ratioHW * origW;
  }
  image(currentFrame, xPos, yPos, imgW, imgH);
}
