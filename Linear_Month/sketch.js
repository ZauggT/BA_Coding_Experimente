let data;
let arrayWithTempValuesZurich = [];
let arrayWithTempValuesBasel = [];
let arrayWithStromValuesBasel = [];
let arrayWithStromValuesZurich = [];

let arrayMonth = [];

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

function preload() {
  data = loadTable("dataStromTemp15Min.csv", "csv", "header");
}

function setup() {
  createCanvas(1600, 1000);
  background(0);
  noLoop();
  let einAbschnitt = width / 11;

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

    let date = new Date(timestamp);
    let quarterHours = quarterHourofTimestamp(timestamp);
    let year = date.getFullYear();
    let weekday = getWeekday(timestamp);
    let month = getMonth(timestamp);
    month = map(month, 0, 11, 0, width - einAbschnitt);
    quarterHours = map(quarterHours, 0, 95, 0, einAbschnitt);

    let stromZ = map(
      stromZurich,
      minStromZurich,
      maxStromZurich,
      height / 2,
      height
    );
    let stromB = map(stromBasel, minStromBasel, maxStromBasel, height / 2, 0);
    let posX = month + quarterHours;

    arrayMonth.push([year, posX, stromZ, stromB]);
  }
  //console.log(arrayMonth);
}

function drawSomething() {
  for (let i = 0; i < arrayMonth.length; i++) {
    if ((arrayMonth[i][0] = 2019)) {
      noStroke();
      fill(255, 0, 0, 80);
      rect(arrayMonth[i][1], arrayMonth[i][2], 2);
      fill(0, 0, 255, 80);
      rect(arrayMonth[i][1], arrayMonth[i][3], 2);
    }
  }
}

function drawSomethingElse() {}

function draw() {
  drawSomething();
  drawSomethingElse();
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
  let date = new Date(timestamp);
  let start = new Date(date.getFullYear(), 0, 0);
  let diff = date - start;
  let oneDay = 1000 * 60 * 60 * 24;
  let dayOfYear = Math.floor(diff / oneDay);
  return dayOfYear + 1;
}

let date = new Date(timestamp)
let hour = date.getHours()
let day = date.getDate()
let weekday = date.getDay()