let socket;
let idle;
let values = [];
let state = 0;

function setup() {
  createCanvas(400, 400);

  socket = new WebSocket("ws://tidalradio.local:8765");
  idle = new Idle(60, 60);
  values.push(new Value(50, 0, 100, 1, 1, "Volume", "%", 1));
  values.push(new Value(50, -50, 500, 1, 1, "Tide", "m", 100));

  socket.onopen = () => {
    updateLCD();
    idle.refresh(600);
  };

  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data);

    idle.refresh(600);

    if (msg.event === "VOL_UP") {
      values[state].up();
      updateLCD();
    }

    if (msg.event === "VOL_DOWN") {
      values[state].down();
      updateLCD();
    }

    if (msg.event === "BUTTON") {
      state ^= 1;
      updateLCD();
    }
  };
}

function draw() {
  background(20);
  textSize(32);
  fill(255);
  values[0].show(40, 80);
  values[1].show(40, 120);
  idle.update(60);
}

function updateLCD() {
  let lcdText = "";

  if (idle.check()) lcdText = idle.strings[idle.state];
  else
    lcdText = `${values[state].tag}: ${values[state].value / values[state].decimal}${values[state].unit} `;

  socket.send(
    JSON.stringify({
      type: "lcd",
      text: lcdText,
    }),
  );
}
