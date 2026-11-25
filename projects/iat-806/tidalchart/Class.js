class Tide {
  constructor(station, resolution, mode, altMode) {
    this.station = station;
    this.resolution = resolution;
    this.mode = mode;
    this.altMode = altMode;
    this.from;
    this.to;
    this.waterLevel;
  }

  dateTime() {
    this.to = new Date();
    this.from = new Date(this.to.getTime() - 600000);
  }

  constructUrl(mode) {
    this.dateTime();
    return `https://api-iwls.dfo-mpo.gc.ca/api/v1/stations/${this.station}/data?time-series-code=${mode}&from=${this.from.toISOString()}&to=${this.to.toISOString()}&resolution=${this.resolution}`;
  }

  async fetchData(mode) {
    return new Promise((resolve, reject) => {
      httpGet(this.constructUrl(mode), "json", resolve, reject);
    });
  }

  async unpackData(mode, altMode) {
    let data = await this.fetchData(mode);
    if (data && data.length > 0) {
      return data[data.length - 1].value;
    } else {
      data = await this.fetchData(altMode);
      if (data && data.length > 0) return data[data.length - 1].value;
    }
  }

  async getWaterLevel() {
    this.waterLevel = await this.unpackData(this.mode, this.altMode);
    console.log(this.waterLevel);
  }
}
