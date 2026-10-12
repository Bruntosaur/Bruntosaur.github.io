let frames = [];
let numFrames = 4;
let stateNames = ["tree", "bell", "shrub"];

//Adjust to change the amount of rows and columns
let numCols = 7;
let numRows = 7;
let colWidth;
let colors = [];
let dancer = [];

async function setup() {
  createCanvas(600, 600);

  //creating the pattern in which the dancing plants show up
  for (i = 0; i < numCols; i++) {
    dancer[i] = [];
    for (j = 0; j < numRows; j++) {
      dancer[i][j] = (i + j) % 3;
    }
  }

  //running the randomColour function once to establish initial colour pattern
  randomColour();

  //create and assigning images to frames and the respective sub-arrays
  for (let i = 0; i < stateNames.length; i++) {
    frames.push([]);
    for (let j = 0; j < numFrames; j++) {
      let fileName = "dance_frames/" + stateNames[i] + j + ".png";
      frames[i].push(await loadImage(fileName));
    }
  }

  //calculating colWidth and rowHeight to calculate the cell size
  colWidth = width / numCols;
  rowHeight = height / numRows;
}

function draw() {
  background(20);
  fill(255, 120);

  // for every cell-
  for (i = 0; i < numCols; i++) {
    for (j = 0; j < numRows; j++) {
      noStroke();
      //retrieve the fill colour from the directory
      fill(colors[i][j][0], colors[i][j][1], colors[i][j][2]);
      //draw a rectangle over the cell with the colour from the directory
      rect(i * colWidth, j * rowHeight, colWidth, height);
      //calculate the middle of each cell
      let x = i * colWidth + colWidth / 2;
      let y = j * rowHeight + rowHeight / 2;
      //calculate the distance from the middle of each cell to the mouse
      let d = dist(x, y, mouseX, mouseY);
      //calculate the max distance possible
      let maxDist = dist(0, 0, width, height);
      //map d between max distance and 0 on 2 (minspeed) to (maxspeed)
      let speed = map(d, 0, maxDist, 2, 20);
      //map d between max distance and 0 on 5 (minsize) to colWidth (maxsize)
      let size = map(d, 0, maxDist, colWidth, 5);
      //run animate with calculated speed, size, and relative position depending on size (so the animation stays centered)
      animate(frames[dancer[i][j]], speed, x - size / 2, y - size / 2, size);
    }
  }
}

function animate(frames, speed, xPos, yPos, imgW, imgH) {
  //calculate index number
  let index = getFrameIndex(speed);
  let currentFrame = frames[index];
  let origW = currentFrame.width;
  let origH = currentFrame.height;
  //if either imgH or imgW are absent or undefined define it according to the given aspect ratio
  if (imgW && !imgH) {
    let ratioWH = imgW / origW;
    imgH = ratioWH * origH;
  }

  if (!imgW && imgH) {
    let ratioHW = imgH / origH;
    imgW = ratioHW * origW;
  }
  //draw the image based on the provided variables
  image(currentFrame, xPos, yPos, imgW, imgH);
}

function getFrameIndex(speed) {
  //higher speed equals lower slowFrame
  let slowFrame = floor(frameCount / speed);
  //numFrames determines how many different index numbers there should be
  let index = slowFrame % numFrames;

  //returns the index to the animate function
  return index;
}

function randomColour() {
  //for every column
  for (i = 0; i < numCols; i++) {
    //create an array in colours [i]
    colors[i] = [];
    //for every cell
    for (j = 0; j < numRows; j++) {
      //generate a random green value between 0 and 100
      colors[i][j] = [50, random(0, 101), 50];
    }
  }
}

function mousePressed() {
  //run randomColour
  randomColour();
}
