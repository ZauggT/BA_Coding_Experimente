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

function preload() {
  data = loadTable("dataStromTemp15Min.csv", "csv", "header");
}

function setup() {
  createCanvas(1600, 1000);
  let einAbschnitt = width / 12;

  console.log(einAbschnitt);
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

    let padding = 40;
    let date = new Date(timestamp);
    let quarterHours = quarterHourofTimestamp(timestamp);
    let year = date.getFullYear();
    let weekday = getWeekday(timestamp);
    let month = getMonth(timestamp);
    month = map(month, 0, 12, 0 + padding, width - padding);
    quarterHours = map(quarterHours, 0, 95, 0, einAbschnitt);

    let stromB = map(
      stromBasel,
      minStromBasel,
      maxStromBasel,
      height / 2 - padding,
      0 + padding
    );

    let stromZ = map(
      stromZurich,
      minStromZurich,
      maxStromZurich,
      height - padding,
      height / 2 + padding
    );

    let posX = month + quarterHours;

    valeArray.push([year, posX, stromB, stromZ]);
  }
  //console.log(arrayMonth);
}

function static() {
  noLoop();
  background(10);
  for (let i = 0; i < valeArray.length; i++) {
    noStroke();
    fill(255, 0, 0, 80);
    ellipse(valeArray[i][1], valeArray[i][2], 3);
    fill(0, 0, 255, 80);
    ellipse(valeArray[i][1], valeArray[i][3], 3);
  }
}

function anim() {
  background(0, 10);
  // strokeWeight(2);
  //console.log(valeArray[counter][4]);
  noStroke();
  fill("red");
  ellipse(valeArray[counter][1], valeArray[counter][2], 5);
  fill("blue");
  ellipse(valeArray[counter][1], valeArray[counter][3], 5);

  /*   fill("red");
  ellipse(valeArray[counter + 3000][1], valeArray[counter + 3000][2], 5);
  fill("blue");
  ellipse(valeArray[counter + 3000][1], valeArray[counter + 3000][3], 5); */

  /*   noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(25);
  text(valeArray[counter][3], width / 2, height / 2); */

  /* if (counter != 0) {
    //&& weekday != width - 1
    stroke("blue");

    line(
      valeArray[counter - 1][0],
      valeArray[counter - 1][1],
      valeArray[counter][0],
      valeArray[counter][1]
    );
    stroke("red");
    line(
      valeArray[counter - 1][0],
      valeArray[counter - 1][2],
      valeArray[counter][0],
      valeArray[counter][2]
    );
         noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(35);
    text(winkelPosArray[counter][4], 0, 0); 
  }*/

  if (counter == numRows) {
    counter = 0;
  }

  counter++;
}

function draw() {
  // static();
  anim();
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

function getDayOfYear(timestamp) {
  // Create a new Date object from the timestamp
  var date = new Date(timestamp);

  // Get the day of the year (0-indexed)
  var start = new Date(date.getFullYear(), 0, 0);
  var diff = date - start;
  var oneDay = 1000 * 60 * 60 * 24;
  var dayOfYear = Math.floor(diff / oneDay);

  // Add 1 to the day of the year to make it 1-indexed
  return dayOfYear + 1;
}
