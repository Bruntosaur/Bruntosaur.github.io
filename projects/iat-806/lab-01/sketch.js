function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(255);
  fill(255, 0, 0);
  noStroke();
  square(150, 0, 450);

  fill(0, 0, 255);
  square(0, 450, 150);

  fill(255, 255, 0);
  rect(510, 525, 90, 75);

  stroke(0);
  strokeWeight(20);
  line(150, 0, 150, 600);
  line(0, 170, 150, 170);
  line(0, 450, 600, 450);
  line(510, 450, 510, 600);
  line(510, 525, 600, 525);
}
