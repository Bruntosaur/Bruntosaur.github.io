class Wave {
  constructor() {
    this.chartHeight = height * 0.8;
  }

  move(value) {
    this.waveHeight = this.chartHeight - map(value, -1, 6, 0, this.chartHeight);
  }

  show() {
    noStroke();
    fill(50, 50, 255);
    rect(0, this.waveHeight, width, height + this.waveHeight);

    push();
    textAlign(CENTER, CENTER);
    textSize(30);
    fill(255);
    if (waterLevel) {
      text(
        waterLevel + " Meters above chart datum",
        width / 2,
        (this.chartHeight + this.waveHeight) / 2,
      );
    } else {
      text("No Data", 50, 50);
    }
    pop();
  }
}
