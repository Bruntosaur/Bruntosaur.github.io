let tidalStation = "5cebf1e43d0f4a073c4bc45a";
let tide;

async function setup() {
  createCanvas(600, 600);

  tide = new Tide(tidalStation, "ONE_MINUTE", "wlo", "wlp");

  await tide.getWaterLevel();
  setInterval(() => tide.getWaterLevel(), 60000);
}

function draw() {
  background(235);
  text(`${tide.waterLevel}m above chart datum`, 40, 40);
}
