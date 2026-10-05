let frames = [];
let numFrames = 7;
let slowFrame;
let climberX = 0;
let speed = 9.2;
let moving = true;
let bgm;
let layers = [
  {
    file: "backgrounds/bg_sky.png",
    img: undefined,
    y: 0,
    speed: 0,
  },
  {
    file: "backgrounds/bg_branches.png",
    img: undefined,
    y: 0,
    speed: 0.75,
  },
  {
    file: "backgrounds/bg_log.png",
    img: undefined,
    y: 0,
    speed: 0.8,
  },
];

async function setup() {
  createCanvas(600, 600);

  for (let i = 0; i < numFrames; i++) {
    let fileName = "climber_frames/climber" + i + ".png";
    frames.push(await loadImage(fileName));
  }

  for (let layer of layers) {
    layer.img = await loadImage(layer.file);
  }

  bgm = createAudio("stal.wav");
  bgm.play();
  bgm.loop();
  bgm.volume(0.5);
}

function draw() {
  background(120);
  fill(140);

  for (let layer of layers) {
    image(layer.img, 0, int(layer.y));
    image(layer.img, 0, int(layer.y) - height);
    if (moving == true) {
      layer.y = layer.y + layer.speed;
    }
    if (layer.y > height) layer.y = 0;
  }

  if (moving == true) {
    slowFrame = floor(frameCount / speed);
  }
  let index = slowFrame % frames.length;

  if (climberX < 150 && keyIsDown(RIGHT_ARROW)) {
    climberX++;
  }
  if (climberX > -150 && keyIsDown(LEFT_ARROW)) {
    climberX--;
  }

  image(frames[index], climberX, 0);

  console.log(index);
}

function mousePressed() {
  moving = false;
  bgm.pause();
}

function mouseReleased() {
  moving = true;
  bgm.play();
}
