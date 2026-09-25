circleX = 200;
circleY = 300;
circleR = 100;
circleGrowth = 1;
speedX = 5;
speedY = 5;
colour1 = [255, 165, 0];
colour2 = [135, 0, 255];
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
    if (circleX <= circleR / 2 && speedX < 0) {
      speedX = speedX * -1;
    } else if (circleX >= width - circleR / 2 && speedX > 0) {
      speedX = speedX * -1;
    }
  }

  circleX = circleX + speedX;

  if (circleY <= circleR / 2 || circleY >= height - circleR / 2) {
    if (circleY <= circleR / 2 && speedY < 0) {
      speedY = speedY * -1;
    } else if (circleY >= height - circleR / 2 && speedY > 0) {
      speedY = speedY * -1;
    }
  }

  circleY = circleY + speedY;

  if (circleR >= 150 || circleR <= 50) {
    circleGrowth = circleGrowth * -1;
  }

  circleR = circleR + circleGrowth;

  colourChance = floor(random(100));

  if (colourChance == 4 && colourState == true) {
    colourState = false;
    fill(colour2);
  } else if (colourChance == 30 && colourState == false) {
    colourState = true;
    fill(colour1);
  }
}

function mousePressed() {
  speedX = random(-5, 5);
  speedY = random(-5, 5);
}
