class Value {
  constructor(startVolume, minV, maxV, inc, dec, tag, unit, decimal) {
    this.value = startVolume;
    this.maxValue = maxV;
    this.minValue = minV;
    this.inc = inc;
    this.dec = dec;
    this.tag = tag;
    this.unit = unit;
    this.decimal = decimal;
  }

  up() {
    this.value = constrain(this.value + this.inc, this.minValue, this.maxValue);
  }

  down() {
    this.value = constrain(this.value - this.inc, this.minValue, this.maxValue);
  }

  show(x, y) {
    text(`${this.tag}: ${this.value / this.decimal}${this.unit}`, x, y);
  }
}

class Idle {
  constructor(delay) {
    this.delay = delay;
    this.maxTime = frameCount + delay;
    this.stateTime = 0;
    this.state = 0;
    this.strings = ["--__--__--__--__", "__--__--__--__--"];
  }

  refresh(delay) {
    this.maxTime = frameCount + delay;
  }

  check() {
    return this.maxTime <= frameCount;
  }

  stateTimer() {
    return this.stateTime <= frameCount;
  }

  update(delay) {
    if (this.stateTimer() && this.check()) {
      this.state = (this.state + 1) % this.strings.length;
      this.stateTime = frameCount + delay;
      updateLCD();
    }
  }
}
