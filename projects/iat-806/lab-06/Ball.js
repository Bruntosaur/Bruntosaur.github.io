class Ball {
  constructor(x, y, c, r, maxR = 10) {
    this.x = x;
    this.y = y;
    this.originalColor = c;
    this.color = c;
    this.highlightColor = "pink";
    this.clickedColor = "red";
    this.r = r;
    this.maxR = maxR;
    this.clicked;
    this.hovered;
    this.active;
  }

  update(scale, displace, active) {
    //set the internal active state to the external active state
    this.active = active;
    //if not active
    if (!active) {
      //change the size
      this.changeSize(scale);
      //and move the ball
      this.move(displace);
    }
    //then show the ball
    this.show();
  }

  respond(active) {
    //if the ball is either on the body mask or is clicked
    if (active || this.clicked) {
      //highlight it
      this.highlight();
    } else {
      //otherwise do not highlight it
      this.dehighlight();
    }
  }

  hover(pointX, pointY) {
    //check whether the cursor is inside the ball
    this.hovered = this.contains(pointX, pointY);
    //return true or false
    return this.hovered;
  }

  highlight() {
    //set the color to the highlight color
    this.color = this.highlightColor;
  }

  dehighlight() {
    //set the color to the original color
    this.color = this.originalColor;
  }

  isOnBody(mask) {
    //only apply the mask on balls within the canvas (prevents the weird edge cases from in class)
    if (this.x < width && this.x > 0 && this.y < height && this.y > 0) {
      // take the RGBA of the pixel the ball is on
      let pixel = mask.get(floor(this.x), floor(this.y));
      //check if the alpha of the pixel is opaque (background) or transparent (person)
      return pixel[3] < 128;
    }
  }

  contains(pointX, pointY) {
    //see whether distance is within the radius of the circle
    let distance = dist(this.x, this.y, pointX, pointY);
    return distance < this.r;
  }

  move(displace) {
    //displace the circle in the x and y axis based on a random value between displaced and -discplaced
    this.x += random(-displace, displace);
    this.y += random(-displace, displace);
  }

  changeSize(scale) {
    //change the size of the ball within the constraint of maxR=10
    this.r = constrain(this.r + random(-scale, scale), 2, this.maxR);
  }

  show() {
    fill(this.color);
    //if this ball is hovered over make the stroke white
    if (this.hovered) stroke(255);
    //else do not draw a stroke
    else noStroke();
    //draw a circle
    circle(this.x, this.y, this.r * 2);
  }
}

function createRandomBall() {
  let ballX = random(0, width);
  let ballY = random(0, height);
  let ballC = color(200, 130 + random(-100, 100), 100, 120);
  let ballCalt = color(255, 255, 255);
  let ballR = 10;
  //20% of the time draw an alternative ball
  if (random() < 0.2) {
    let ballalt = new SubBall(ballX, ballY, ballCalt, ballR);
    return ballalt;
    //80% of the time draw a regular ball
  } else {
    let ball = new Ball(ballX, ballY, ballC, ballR);
    return ball;
  }
}

//extend the ball class
class SubBall extends Ball {
  constructor(x, y, c, r, maxR = 10) {
    //inherit the constuctor from Balls
    super(x, y, c, r, maxR);
  }

  update(scale, displace, active) {
    //as opposed to Ball the alt ball will always move and scale regardless of being clicked or highlighted
    this.active = active;
    this.move(displace);
    this.changeSize(scale);
    this.show();
  }

  move(displace) {
    //make the balls move upwards
    this.y += random(-displace * 5, displace);
    this.x += random(-displace, displace);

    //if the balls leave the canvas up top teleport them to the bottom
    if (this.y < 0 - this.r) {
      this.y = height + this.r;
    }
  }

  show() {
    //if the ball is either clicked or active
    if (this.clicked || this.active) {
      //fill it with the highlight color (which whill inhabit this color)
      fill(this.color);
    } else {
      //otherwise do not fill
      noFill();
    }
    //if this ball is hovered over make a gray outline
    if (this.hovered) stroke(100);
    //otherwise the outline will be white
    else stroke(255);
    //draw the ball
    circle(this.x, this.y, this.r * 2);
    noStroke();
  }
}
