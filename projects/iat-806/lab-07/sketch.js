let utcYear, utcMonth, utcDay, utcHour, utcMinute, utcSecond;
let oldYear, oldMonth, oldDay, oldHour, oldMinute, oldSecond;

let tidalStation = "5cebf1e43d0f4a073c4bc45a";
let url;
let data;

async function setup() {
  createCanvas(600, 600);
  fill(255);

  let now = new Date();
  setOldDate(now);
  getNewDate(new Date(now.getTime() - 60000));
  linkConstructor(tidalStation);
  console.log(url);
  data = await httpGet(url, "json");
}

function draw() {
  background(20);

  index = frameCount % 3600;
  text(index, 20, 20);
  text(
    constructDateTime(utcYear, utcMonth, utcDay, utcHour, utcMinute, utcSecond),
    40,
    40,
  );
  text(
    constructDateTime(oldYear, oldMonth, oldDay, oldHour, oldMinute, oldSecond),
    40,
    80,
  );
  text(data[data.length - 1].value, 40, 120);

  if (index == 0) {
    let now = new Date();
    setOldDate(now);
    getNewDate(new Date(now.getTime() - 60000));
    linkConstructor(tidalStation);
    fetchTide();
  }
}

function getNewDate(now) {
  utcYear = now.getUTCFullYear();
  utcMonth = now.getMonth() + 1;
  utcDay = now.getUTCDate();
  utcHour = now.getUTCHours();
  utcMinute = now.getUTCMinutes();
  utcSecond = now.getUTCSeconds();
}

function setOldDate(minuteAgo) {
  oldYear = minuteAgo.getUTCFullYear();
  oldMonth = minuteAgo.getMonth() + 1;
  oldDay = minuteAgo.getUTCDate();
  oldHour = minuteAgo.getUTCHours();
  oldMinute = minuteAgo.getUTCMinutes();
  oldSecond = minuteAgo.getUTCSeconds();
}

function linkConstructor(station) {
  url =
    "https://api-iwls.dfo-mpo.gc.ca/api/v1/stations/" +
    station +
    "/data?time-series-code=wlo&from=" +
    constructDateTime(
      utcYear,
      utcMonth,
      utcDay,
      utcHour,
      utcMinute,
      utcSecond,
    ) +
    "&to=" +
    constructDateTime(
      oldYear,
      oldMonth,
      oldDay,
      oldHour,
      oldMinute,
      oldSecond,
    ) +
    "&resolution=ONE_MINUTE";
}

function constructDateTime(year, month, day, hour, minute, second) {
  let utcDateTime =
    year +
    "-" +
    nf(month, 2) +
    "-" +
    nf(day, 2) +
    "T" +
    nf(hour, 2) +
    "%3A" +
    nf(minute, 2) +
    "%3A" +
    nf(second, 2) +
    "Z";

  return utcDateTime;
}

function fetchTide() {
  linkConstructor(tidalStation);
  httpGet(url, "json", (response) => {
    data = response;
  });
}

function mousePressed() {
  let now = new Date();
  setOldDate(now);
  getNewDate(new Date(now.getTime() - 60000));
}
