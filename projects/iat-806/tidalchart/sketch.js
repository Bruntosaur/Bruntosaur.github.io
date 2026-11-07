//The tidal station that's being read
let tidalStation = "5cebf1e43d0f4a073c4bc45a";
//The array that the Api produces
let data;
//The water level predicted by the tidal station
let waterLevel;
let wave;

async function setup() {
  createCanvas(600, 600);
  wave = new Wave();

  fetchTide();
  //fires the function ever 60 seconds
  setInterval(fetchTide, 60000);
}

function draw() {
  background(235);
  fill(0);
  displayTide();
  wave.move(waterLevel);
  wave.show(waterLevel);
}

function fetchTide() {
  //get the current datetime
  let to = new Date();
  //get the datetime a minute ago
  let from = new Date(to.getTime() - 600000);
  //construct the url, toISOString() converts the datetime into ISO 8601 UTC timestamps
  let url =
    "https://api-iwls.dfo-mpo.gc.ca/api/v1/stations/" +
    tidalStation +
    "/data?time-series-code=wlp&from=" +
    from.toISOString() +
    "&to=" +
    to.toISOString() +
    //the interval at which we recieve predictions
    "&resolution=ONE_MINUTE";

  //Requests the data from the API in the JSON data format. The callback function overides data with the new array.
  httpGet(url, "json", (result) => {
    data = result;
  });
}

function displayTide() {
  //if data is defined, and the array is longer than zero
  if (data && data.length > 0) {
    //From the last entry get the value (which is the water level)
    waterLevel = data[data.length - 1].value;
    //write down the water level
  }
}
