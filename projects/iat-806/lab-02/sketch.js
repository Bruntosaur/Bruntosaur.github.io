circleX = 200;
circleY = 300;
circleR = 100;
circleGrowth = 1;
speedX = 5;
speedY = 5;
colour1 = [255, 165, 0];
colour2 = [135, 206, 235];
colourState = true;
colourChance = 0;

function setup() {
  createCanvas(600, 600);
  strokeWeight(0);
  fill(colour1);
}

function draw() {
  background(25);

  circle(circleX, circleY, circleR);

  if (circleX <= circleR / 2 || circleX >= width - circleR / 2) {
    speedX = speedX * -1;
  }

  circleX = circleX + speedX;

  if (circleY <= circleR / 2 || circleY >= height - circleR / 2) {
    speedY = speedY * -1;
  }

  circleY = circleY + speedY;

  colourChance = floor(random(60));

  if (colourChance == 4 && colourState == true) {
    colourState = false;
    fill(colour2);
  } else if (colourChance == 30 && colourState == false) {
    colourState = true;
    fill(colour1);
  }

  print(colourChance);
}

function mousePressed() {
  speedX = random(-5, 5);
  speedY = random(-5, 5);
}
