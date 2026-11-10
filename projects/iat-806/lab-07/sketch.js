let bodySegmentation;
let video;
let segmentation;
let options = {
  maskType: "person",
  flipped: true,
};

let numBalls = 500;
let balls = [];

let soundHappy;
let soundSad;

async function setup() {
  createCanvas(640, 480);
  noStroke();

  bodySegmentation = await ml5.bodySegmentation("BodyPix", options);

  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();

  bodySegmentation.detectStart(video, gotResults);

  for (let i = 0; i < numBalls; i++) {
    balls.push(createBall());
  }

  soundHappy = createAudio("sounds/sm64_mario_yippee.wav");
  soundSad = createAudio("sounds/sm64_mario_hurt.wav");
}

function draw() {
  background(0);
  if (segmentation) {
    image(segmentation.mask, 0, 0, width, height);
  }
  balls.forEach((ball) => {
    let active = false;
    if (segmentation) {
      active = ball.isOnMask(segmentation.mask);
      ball.respond(active);
    }
    ball.move();
    ball.show();
  });
}

function gotResults(result) {
  segmentation = result;
}

function mousePressed() {
  balls.forEach((ball) => {
    ball.clicked();
  });
}
