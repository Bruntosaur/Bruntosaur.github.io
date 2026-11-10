class Ball {
  constructor(x, y, r, c) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.c = c;
    this.ogc = c;

    this.highlightColour = color(random(100, 255), 0, 0, 200);
  }

  hover() {
    return dist(this.x, this.y, mouseX, mouseY) < this.r;
  }

  respond(active) {
    if (active) {
      this.highlight();
    } else {
      this.dehighlight();
    }
  }

  highlight() {
    this.c = this.highlightColour;
  }

  dehighlight() {
    this.c = this.ogc;
  }

  clicked() {
    if (this.hover()) {
      if (this.m == ":-)") {
        soundHappy.play();
      } else if (this.m == ":-(") {
        soundSad.play();
      }
    }
  }

  isOnMask(mask) {
    if (this.x < width && this.x > 0 && this.y < height && this.y > 0) {
      let pixel = mask.get(floor(this.x), floor(this.y));
      return pixel[3] < 128;
    }
  }

  move() {
    this.x += random(-2, 2);
    this.y += random(-2, 2);
  }

  show() {
    fill(this.c);
    if (this.hover()) {
      stroke(255);
    } else {
      noStroke();
    }
    circle(this.x, this.y, this.r * 2);
  }
}

class BigBall extends Ball {
  constructor(x, y, r, c, m) {
    super(x, y, r, c);
    this.r = r * 3;
    this.m = m;
    this.om = m;

    this.bm = ":-(";
  }

  highlight() {
    this.c = this.highlightColour;
    this.m = this.bm;
  }

  dehighlight() {
    this.c = this.ogc;
    this.m = this.om;
  }

  face() {
    push();
    fill(255);
    textSize(this.r);
    textAlign(CENTER, CENTER);
    text(this.m, this.x, this.y);
    pop();
  }

  show() {
    fill(this.c);
    if (this.hover()) {
      stroke(255);
    } else {
      noStroke();
    }
    circle(this.x, this.y, this.r * 2);
    this.face();
  }
}

function createBall() {
  let ballX = random(0, width);
  let ballY = random(0, height);
  let ballC = color(130 + random(-100, 100), 0, 255, 120);
  let ballR = 10;
  let mood = ":-)";

  if (random() < 0.8) {
    let ball = new Ball(ballX, ballY, ballR, ballC);
    return ball;
  } else {
    let ball = new BigBall(ballX, ballY, ballR, ballC, mood);
    return ball;
  }
}
