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

function preload() {
  data = loadTable("dataStromTemp15Min.csv", "csv", "header");
}

function setup() {
  createCanvas(365 * 4, 96 * 8);
  //frameRate(120);
  rectMode(CENTER);
  background(0);
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
    if (year == 2019) {
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
      let yB = map(quarterHours, 0, 95, 0, height / 2);
      let yZ = map(quarterHours, 0, 95, height / 2, height);
      let sizeB = map(stromBasel, minStromBasel, maxStromBasel, 1, 6);
      let sizeZ = map(stromZurich, minStromZurich, maxStromZurich, 1, 6);

      valeArray.push([x, yB, sizeB, yZ, sizeZ, dateString]);
    }

    /*     arrayWithStromValuesBasel.push(stromBasel);
    arrayWithStromValuesZurich.push(stromZurich);
    arrayWithTempValuesBasel.push(tempBasel);
    arrayWithTempValuesZurich.push(tempZurich); */
  }
  //console.log(valeArray);
}

function drawSomething() {
  /* 
  for (let i = 0; i < valeArray.length; i++) {
    let x = valeArray[i][0];
    let yB = valeArray[i][1];
    let sizeB = valeArray[i][2];
    let yZ = valeArray[i][3];
    let sizeZ = valeArray[i][4];
    noStroke();
    fill("red");
    ellipse(x, yB, sizeB);
    fill("blue");
    ellipse(x, yZ, sizeZ);
  } */
}

function drawCalender() {
  //background(0, 5);
  fill("red");
  ellipse(valeArray[counter][0], valeArray[counter][1], valeArray[counter][2]);
  fill("blue");
  ellipse(valeArray[counter][0], valeArray[counter][3], valeArray[counter][4]);

  fill(10);
  rect(width / 2, height / 2, 200, 50);

  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(35);
  text(valeArray[counter][5], width / 2, height / 2);

  /*   if (millis() - lastUpdateTime > updateInterval) {
    counter++;
    lastUpdateTime = millis();
  } */

  //console.log(millis());

  counter++;
}

function draw() {
  //drawSomething();
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
