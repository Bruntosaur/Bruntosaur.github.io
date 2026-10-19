//sets up a function that will be called whenever the event is delivered
window.addEventListener(
  //every time a keydown event fires anywhere on the page
  "keydown",
  //the browser hands the function an event
  (event) => {
    //a list of arrow keys we can check event.key against
    const arrows = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    //if the arrows provided match the event
    if (arrows.includes(event.key)) {
      //original function should not be called
      event.preventDefault();
    }
  },
  //prevents this listener from being ignored
  { passive: false },
);

let myball;
let balls = [];
let numberOfBalls = 500;
let xSpeed = 2;
let ySpeed = 2;
let maxSize = 3;

async function setup() {
  createCanvas(600, 600);
  background(2, 3, 10);

  noStroke();

  //create an array of balls each with a distinct relative speed
  for (let i = 0; i < numberOfBalls; i++) {
    //this makes sure the balls drawn first will always be drawn behind the bigger ones
    let relativeSize = map(i, 0, numberOfBalls, 0, maxSize);
    let ball = new Ball(
      random(width),
      random(height),
      color(random(255), random(255), 255),
      relativeSize,
    );
    //pushing the balls into the array
    balls.push(ball);
  }
}

function draw() {
  //nice space-dark-blue
  background(2, 3, 10);
  for (let ball of balls) {
    ball.move(xSpeed, ySpeed);
    ball.speed();
    ball.slow();
    ball.show();
  }
}

class Ball {
  //construct the ball with its unique variables
  constructor(x, y, c, r) {
    this.x = x;
    this.y = y;
    this.color = c;
    this.r = r;
    this.shine = 0;

    //make sure the furter (smaller) balls move slower
    this.relativeSpeed = map(r, 0, 30, 0, 1);
  }
  move(xSpeed, ySpeed) {
    //the speed updates the position multiplied by the relative speed determined in setup
    this.x += xSpeed * this.relativeSpeed;
    this.y += ySpeed * this.relativeSpeed;

    //feeding the edges of the canvas into their opposites, creating continuity
    if (this.x < 0 - this.r) {
      this.x = width + this.r;
    }
    if (this.x > width + this.r) {
      this.x = 0 - this.r;
    }
    if (this.y < 0 - this.r) {
      this.y = height + this.r;
    }
    if (this.y > height + this.r) {
      this.y = 0 - this.r;
    }

    //update the radius of the shine
    this.shine = this.r + random(0, this.r);
  }

  speed() {
    //add or subtract a tiny amount of speed per frame the key is down
    if (keyIsDown(LEFT_ARROW)) {
      xSpeed += 0.001;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      xSpeed -= 0.001;
    }
    if (keyIsDown(UP_ARROW)) {
      ySpeed += 0.001;
    }
    if (keyIsDown(DOWN_ARROW)) {
      ySpeed -= 0.001;
    }
  }

  slow() {
    if (mouseIsPressed === true) {
      //bring speed towards 0 by a tiny amount every frame mouse is pressed
      if (xSpeed < 0) {
        xSpeed += 0.001;
      }
      if (xSpeed > 0) {
        xSpeed -= 0.001;
      }
      if (ySpeed < 0) {
        ySpeed += 0.001;
      }
      if (ySpeed > 0) {
        ySpeed -= 0.001;
      }
    }
  }

  show() {
    //set the opacity lower to draw the shine around the ball
    this.color.setAlpha(125);
    fill(this.color);
    circle(this.x, this.y, this.shine);

    //return the opacity to default
    this.color.setAlpha(255);
    fill(this.color);
    circle(this.x, this.y, this.r);
  }
}
