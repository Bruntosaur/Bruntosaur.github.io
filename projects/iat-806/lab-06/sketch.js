let balls = [];
let bodySegmentation;
let numBalls = 1000;
let video;
let options = {
  maskType: "person",
};

let segmentation;

async function setup() {
  createCanvas(640, 480);

  //create a webcam video
  video = createCapture(VIDEO);
  video.size(640, 480);
  noStroke();

  //loading the bodysegmentation model
  bodySegmentation = await ml5.bodySegmentation("BodyPix", options);

  //hide webcam footage
  video.hide();
  //start detecting body parts from the webcam video
  bodySegmentation.detectStart(video, gotResults);

  //for every number of balls create a random ball in the balls array
  for (let i = 0; i < numBalls; i++) {
    let ball = createRandomBall();
    balls.push(ball);
  }
}

function draw() {
  background(20);

  //for each ball in balls
  balls.forEach((ball) => {
    //define active as false per default
    let active = false;
    //if segmentation is true
    if (segmentation) {
      //check whether the current ball is on the segmentation mask
      active = ball.isOnBody(segmentation.mask);
      //check whether the current ball is being hovered over
      ball.hover(mouseX, mouseY);
      //respond to being active or being hovered over
      ball.respond(active);
      //update the current ball to move, scale, and fill
      ball.update(1, 1, active);
    }
  });
}

function mousePressed() {
  //for every ball
  balls.forEach((ball) => {
    //check if the mouse is currently inside of it and if so
    if (ball.hover(mouseX, mouseY)) {
      //mark that ball as clicked
      ball.clicked = !ball.clicked;
    }
  });
}

function gotResults(result) {
  //once body parts are detected they are passed on to segmentation
  segmentation = result;
}
