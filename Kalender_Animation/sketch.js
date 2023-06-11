const capturer = new CCapture({
  framerate: 60,
  format: "webm",
  name: "Line_Hour_Zurich",
  quality: 100,
  verbose: true,
});

let data;
let arrayWithTempValuesZurich = [];
let arrayWithTempValuesBasel = [];
let arrayWithStromValuesBasel = [];
let arrayWithStromValuesZurich = [];

let valeArray = [];

// Für die Temperatur in Zürich hat es 314 Einträge ohne Wert (NA)
// diese Werte wurden mit 123456789 ersetzt
// Möglich wäre es zu interpolieren, aber so kann sichtbar
// gemacht werden, dass es fehlende Werte in den Daten gibt.
// Das Minimum und Maximum wurden manuell aus den Daten genommen, weil min() und max()
// nicht funktionieren bei so grosser Datenmenge

let maxTempZurich = 35.4;
let minTempZurich = -8.4;
let maxStromZurich = 116593;
let minStromZurich = 45505;

let maxTempBasel = 38.6;
let minTempBasel = -13;
let maxStromBasel = 57731;
let minStromBasel = 22355;

let counter = 0;
let lastUpdateTime = 0;
let updateInterval = 8;

let rectSize = 10;
let rectwidth;
let rectheight;
let jahr = 2020;

let padding = 10;

let previousTime = 0;

function preload() {
  data = loadTable("dataStromTemp15Min.csv", "csv", "header");
}

function setup() {
  createCanvas(3840, 2160); // 3840 x 2160
  background(0);
  let abschnitt = height / 2 - padding;
  rectwidth = width / 366;
  rectheight = abschnitt / 96;

  let numRows = data.getRowCount();
  let zurichStromValues = int(data.getColumn("StromverbrauchZurich"));
  let baselStromValues = int(data.getColumn("StromverbrauchBasel"));
  let zurichTempValues = float(data.getColumn("TempZurich"));
  let baselTempValues = float(data.getColumn("TempBasel"));
  let timestampsInDataZB = data.getColumn("time");

  for (let i = 0; i < numRows; i++) {
    let stromZurich = zurichStromValues[i];
    let stromBasel = baselStromValues[i];
    let tempZurich = zurichTempValues[i];
    let tempBasel = baselTempValues[i];
    let timestamp = timestampsInDataZB[i];

    let year = getFullYear(timestamp);
    if (year == jahr) {
      let date = new Date(timestamp);
      let dateString =
        date.getDate() +
        ". " +
        (date.getMonth() + 1) +
        ". " +
        date.getFullYear();
      let quarterHours = quarterHourofTimestamp(timestamp);
      let weekday = getWeekday(timestamp);
      let month = getMonth(timestamp);
      let dayOfYear = getDayOfYear(timestamp);

      let x = map(dayOfYear, 0, 366, 0, width);
      let yB = map(quarterHours, 0, 96, height / 2 + padding, height);
      let yZ = map(quarterHours, 0, 96, 0, -padding + height / 2);
      let alphaBasel = map(stromBasel, minStromBasel, maxStromBasel, -20, 300);
      let alphaZurich = map(
        stromZurich,
        minStromZurich,
        maxStromZurich,
        -20,
        300
      );
      let alpha = map(stromBasel, minStromBasel, maxStromBasel, -30, 280);
      let sizeB = map(stromBasel, minStromBasel, maxStromBasel, 1.5, 10.5);
      let sizeZ = map(stromZurich, minStromZurich, maxStromZurich, 0, 11);

      valeArray.push([
        x,
        yB,
        sizeB,
        yZ,
        sizeZ,
        dateString,
        alpha,
        alphaBasel,
        alphaZurich,
      ]);
    }
  }
}

function drawCalendarStatic() {
  //background(50);
  rectMode(CORNER);

  noLoop();
  for (let i = 0; i < valeArray.length; i++) {
    /*     fill(255, valeArray[i][7]);
    rect(valeArray[i][0], valeArray[i][1], rectwidth, rectheight - 0.5); //Basel
    fill(255, valeArray[i][8]);
    rect(valeArray[i][0], valeArray[i][3], rectwidth, rectheight - 0.5); //Zürich */

    /*     fill(255);
    rect(valeArray[i][0], valeArray[i][1], valeArray[i][2]); //Basel
    rect(valeArray[i][0], valeArray[i][3], valeArray[i][4]); // Zürich */

    fill(255);
    noStroke();
    ellipse(valeArray[i][0], valeArray[i][1], valeArray[i][2]); //Basel
    ellipse(valeArray[i][0], valeArray[i][3], valeArray[i][4]); // Zürich
  }
}

function drawCalender() {
  rectMode(CENTER, CENTER);
  /* if (frameCount === 1) capturer.start(); */
  if (millis() - previousTime >= 1) {
    counter++; // Increment the counter
    previousTime = millis(); // Update the previous time
  }
  let start = (counter - 1) * 95;
  let end = start + 96;

  for (let i = start; i < end && i < valeArray.length; i++) {
    fill(255);
    rect(
      valeArray[i + counter][0],
      valeArray[i + counter][1],
      valeArray[i + counter][2]
    ); //Basel
    rect(
      valeArray[i + counter][0],
      valeArray[i + counter][3],
      valeArray[i + counter][4]
    );
  }

  /*   capturer.capture(canvas);
  if (frameCount === 3000) {
    noLoop();
    capturer.stop();
    capturer.save();
  } // 3720 */
}

function draw() {
  //drawCalendarStatic();
  drawCalender();
}

function quarterHourofTimestamp(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let quarterHour = Math.floor(minutes / 15);
  let quarterHourOfDay = hours * 4 + quarterHour;
  return quarterHourOfDay;
}

function getWeekday(timestamp) {
  let date = new Date(timestamp);
  let weekday = date.getDay();
  if (weekday === 0) {
    weekday = 6;
  } else {
    weekday--;
  }
  return weekday;
}

function getMonth(timestamp) {
  let date = new Date(timestamp);
  let month = date.getMonth();
  return month;
}

function getFullYear(timestamp) {
  let date = new Date(timestamp);
  let year = date.getFullYear();
  return year;
}

function getDayOfYear(timestamp) {
  // Create a new Date object from the timestamp
  var date = new Date(timestamp);

  // Get the day of the year (0-indexed)
  var start = new Date(date.getFullYear(), 0, 0);
  var diff = date - start;
  var oneDay = 1000 * 60 * 60 * 24;
  var dayOfYear = Math.floor(diff / oneDay);

  // Add 1 to the day of the year to make it 1-indexed
  return dayOfYear - 1;
}
