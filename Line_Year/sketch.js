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

let numRows;

let counter = 0;

let weekday;
let weekdayRaw;

let myFont;

let ellipseSize = 3;

function preload() {
  data = loadTable("dataStromTemp15Min.csv", "csv", "header");
}

function setup() {
  createCanvas(1000, 500);
  background(0);
  myFont = loadFont("digital-7.mono.ttf");
  textFont(myFont);
  numRows = data.getRowCount();
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

    //let year = getFullYear(timestamp);

    let unterteilung = width / 365;

    let date = new Date(timestamp);
    let day = String(date.getDate()).padStart(2, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let year = date.getFullYear();
    if (year == 2022) {
      let dateString = `${day}.${month}.${year}`;
      let quarterHours = quarterHourofTimestamp(timestamp);
      weekday = getWeekday(timestamp);
      weekdayRaw = getWeekday(timestamp);
      //let month = getMonth(timestamp);
      let dayOfYear = getDayOfYear(timestamp);

      dayOfYear = map(dayOfYear, 0, 365, 0, width);
      quarterHours = map(quarterHours, 0, 95, 0, unterteilung);

      // console.log(quarterHours);

      let padding = 20;

      let posX = dayOfYear + quarterHours;

      let posYB = map(
        stromBasel,
        minStromBasel,
        maxStromBasel,
        height - padding,
        height / 2 + padding
      );
      let posYZ = map(
        stromZurich,
        minStromZurich,
        maxStromZurich,
        height / 2 - padding,
        0 + padding
      );

      valeArray.push([posX, posYB, posYZ, dateString, weekdayRaw]);
    }
  }
}

function lineStatic() {
  noLoop();
  background(10);
  for (let i = 0; i < valeArray.length; i++) {
    // strokeWeight(2);
    //console.log(valeArray[counter][4]);
    noStroke();
    fill(255, 0, 0);
    ellipse(valeArray[i][0], valeArray[i][1], ellipseSize);
    fill(0, 0, 255);
    ellipse(valeArray[i][0], valeArray[i][2], ellipseSize);
  }
}

function lineAnim() {
  // background(0);
  // strokeWeight(2);
  //console.log(valeArray[counter][4]);
  /*   noStroke();
  fill("red");
  ellipse(valeArray[counter][0], valeArray[counter][1], ellipseSize);
  fill("blue");
  ellipse(valeArray[counter][0], valeArray[counter][2], ellipseSize); */

  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(25);
  text(valeArray[counter][3], width / 2, height / 2);

  if (counter != 0) {
    //&& weekday != width - 1
    strokeWeight(2);
    stroke("red");

    line(
      valeArray[counter - 1][0],
      valeArray[counter - 1][1],
      valeArray[counter][0],
      valeArray[counter][1]
    );
    stroke("blue");
    line(
      valeArray[counter - 1][0],
      valeArray[counter - 1][2],
      valeArray[counter][0],
      valeArray[counter][2]
    );
  }

  if (counter == numRows) {
    counter = 0;
  }

  counter += 4;
}

function draw() {
  //lineStatic();
  lineAnim();
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
