let frames = [];
let numFrames = 7;
let speed = 10;

let numCols = 10;
let numRows = 10;
let colWidth;
let colors = [];

async function setup() {
  createCanvas(600, 600);

  for (i = 0; i < numCols; i++) {
    colors[i] = [];
    for (j = 0; j < numRows; j++) {
      colors[i][j] = [random(1, 255), random(1, 255), random(1, 255)];
    }
  }

  for (let i = 0; i < numFrames; i++) {
    let fileName = "climber_frames/climber" + i + ".png";
    frames.push(await loadImage(fileName));
  }

  colWidth = width / numCols;
  rowHeight = height / numRows;
}

function draw() {
  background(20);
  fill(255, 120);

  for (i = 0; i < numCols; i++) {
    for (j = 0; j < numRows; j++) {
      noStroke();
      fill(colors[i][j][0], colors[i][j][1], colors[i][j][2]);
      rect(i * colWidth, j * rowHeight, colWidth, height);
      animate(frames, speed, i * colWidth, j * rowHeight, width / numCols);
    }
  }
}

function animate(frames, speed, xPos, yPos, imgW, imgH) {
  let index = getFrameIndex(speed);
  let currentFrame = frames[index];
  let origW = currentFrame.width;
  let origH = currentFrame.height;
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

function getFrameIndex(speed) {
  let slowFrame = floor(frameCount / speed);
  let index = slowFrame % frames.length;

  return index;
}

function mousePressed() {
  for (i = 0; i < numCols; i++) {
    colors[i] = [];
    for (j = 0; j < numRows; j++) {
      colors[i][j] = [random(1, 255), random(1, 255), random(1, 255)];
    }
  }
}
