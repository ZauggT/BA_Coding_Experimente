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

let ellipseSize = 5;

function preload() {
  data = loadTable("dataStromTemp15Min.csv", "csv", "header");
}

function setup() {
  createCanvas(3840, 2160); //3840 x 2160
  background(0);
  myFont = loadFont("Roboto-Thin.ttf");
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
    let jahrunterteilung = height / 4;

    let date = new Date(timestamp);
    let day = String(date.getDate()).padStart(2, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let year = date.getFullYear();

    let dateString = `${day}.${month}.${year}`;
    let quarterHours = quarterHourofTimestamp(timestamp);
    weekday = getWeekday(timestamp);
    weekdayRaw = getWeekday(timestamp);
    //let month = getMonth(timestamp);
    let dayOfYear = getDayOfYear(timestamp);
    let padding = 30;
    dayOfYear = map(dayOfYear, 0, 365, padding, width - padding);
    quarterHours = map(quarterHours, 0, 95, 0, unterteilung);
    let posX;
    let posYB;
    let posYZ;
    // console.log(quarterHours);
    if (year == 2019) {
      posX = dayOfYear + quarterHours;
      posYB = map(
        stromBasel,
        minStromBasel,
        maxStromBasel,
        height / 4 - padding,
        0 + padding
      );
      posYZ = map(
        stromZurich,
        minStromZurich,
        maxStromZurich,
        height / 4 - padding,
        0 + padding
      );
    } else if (year == 2020) {
      posX = dayOfYear + quarterHours;

      posYB = map(
        stromBasel,
        minStromBasel,
        maxStromBasel,
        height / 2 - padding,
        height / 4 + padding
      );
      posYZ = map(
        stromZurich,
        minStromZurich,
        maxStromZurich,
        height / 2 - padding,
        height / 4 + padding
      );
    } else if (year == 2021) {
      posX = dayOfYear + quarterHours;

      posYB = map(
        stromBasel,
        minStromBasel,
        maxStromBasel,
        (height / 4) * 3 - padding,
        height / 2 + padding
      );
      posYZ = map(
        stromZurich,
        minStromZurich,
        maxStromZurich,
        (height / 4) * 3 - padding,
        height / 2 + padding
      );
    } else if (year == 2022) {
      posX = dayOfYear + quarterHours;

      posYB = map(
        stromBasel,
        minStromBasel,
        maxStromBasel,
        height - padding,
        (height / 4) * 3 + padding
      );
      posYZ = map(
        stromZurich,
        minStromZurich,
        maxStromZurich,
        height - padding,
        (height / 4) * 3 + padding
      );
    }

    valeArray.push([posX, posYB, posYZ, dateString, weekdayRaw]);
  }
}

function lineStatic() {
  noLoop();
  background(0);
  /*   textSize(72);
  fill(255);
  text("Zürich", 200, 200); */
  for (let i = 0; i < valeArray.length - 1; i++) {
    strokeCap(SQUARE);
    stroke(255, 100);
    strokeWeight(2);

    /*     line(
      valeArray[i][0],
      valeArray[i][1],
      valeArray[i + 1][0],
      valeArray[i + 1][1]
    ); */

    /*     line(
      valeArray[i][0],
      valeArray[i][2],
      valeArray[i + 1][0],
      valeArray[i + 1][2]
    ); */

    noStroke();
    fill(255);

    ellipse(valeArray[i][0], valeArray[i][1], 3); // basel
    //ellipse(valeArray[i][0], valeArray[i][2], 3); // Zürich
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
  textSize(72);
  textAlign(CENTER, CENTER);
  fill(255);
  text("Zürich", 200, 200);

  noStroke();
  fill(0);
  rect(0, height - 150, width, 200);

  fill(255);

  textSize(72);
  text(valeArray[counter][3], width / 2, height - 100);

  if (counter != 0) {
    strokeCap(SQUARE);
    stroke(255);
    strokeWeight(2);

    /*     line(
      valeArray[counter][0],
      valeArray[counter][1],
      valeArray[counter + 1][0],
      valeArray[counter + 1][1]
    ); */

    line(
      valeArray[counter][0],
      valeArray[counter][2],
      valeArray[counter + 1][0],
      valeArray[counter + 1][2]
    );
  }

  if (counter == numRows) {
    counter = 0;
  }

  counter++;
}

function draw() {
  lineStatic();
  //lineAnim();
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
