let data;
let arrayWithTempValuesZurich = [];
let arrayWithTempValuesBasel = [];
let arrayWithStromValuesBasel = [];
let arrayWithStromValuesZurich = [];
let timeObjects = [];
let winkelPosArray = [];

let wochenUnterteilung = 360 / 7;
let wochenTage = ["mo", "di", "mi", "do", "fr", "sa", "so"];

let numRows;

let counter = 0;

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

let screenfragmentforX;
let screenfragmentforY;

let firstQuarter;
let secondQuarter;
let thirdQuarter;
let forthQuarter;

let firstheight;
let secondheight;

let myFont;

let radius = 230;
let textsize = 20;
let innerabstand = 4;
let ausserabstand = 1.1;
let lineWidth = 6;

let erstesJahr = 35040;
let zweitesJahr = 35136;
let drittesJahr = 35040;

/* let colBasel = "#f22222";
let colZurich = "#152aeb"; */

let colBasel = "red";
let colZurich = "blue";

function preload() {
  data = loadTable("dataStromTemp15Min.csv", "csv", "header");
}

function setup() {
  createCanvas(1640, 1000);
  myFont = loadFont("digital-7.mono.ttf");
  textFont(myFont);
  angleMode(DEGREES);

  screenfragmentforX = width / 4;
  screenfragmentforY = height / 4;

  firstQuarter = 1 * screenfragmentforX;
  secondQuarter = 2 * screenfragmentforX;
  thirdQuarter = 3 * screenfragmentforX;
  forthQuarter = 4 * screenfragmentforX;

  firstheight = 1 * screenfragmentforY;
  secondheight = 2 * screenfragmentforY;

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
    let day = String(date.getDate()).padStart(2, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let year = date.getFullYear();
    let dateString = `${day}.${month}.${year}`;
    let quarterHours = quarterHourofTimestamp(timestamp);
    let weekday = getWeekday(timestamp);
    weekday = map(weekday, 0, 7, 0, 360) - 90;
    quarterHours = map(quarterHours, 0, 95, 0, 360 / 7);
    let winkel = weekday + quarterHours;

    let realstromZ = stromZurich / 450;
    let realstromB = stromBasel / 450;

    let stromZ = map(stromZurich, minStromZurich, maxStromZurich, 100, 350);
    let stromB = map(stromBasel, minStromBasel, maxStromBasel, 100, 350);
    // console.log(stromZ);
    /*     let x = stromZ * cos(winkel);
    let y = stromZ * sin(winkel);
    let x2 = stromB * cos(winkel);
    let y2 = stromB * sin(winkel);
 */
    let x = realstromZ * cos(winkel);
    let y = realstromZ * sin(winkel);
    let x2 = realstromB * cos(winkel);
    let y2 = realstromB * sin(winkel);
    winkelPosArray.push([x, y, x2, y2, dateString]);
  }
}

function drawFirstSpiral() {
  translate(firstQuarter, firstheight);

  strokeWeight(lineWidth);
  if (counter != 0) {
    stroke(colZurich);

    line(
      winkelPosArray[counter - 1][0],
      winkelPosArray[counter - 1][1],
      winkelPosArray[counter][0],
      winkelPosArray[counter][1]
    );
    stroke(colBasel);
    line(
      winkelPosArray[counter - 1][2],
      winkelPosArray[counter - 1][3],
      winkelPosArray[counter][2],
      winkelPosArray[counter][3]
    );
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(textsize);
    text(winkelPosArray[counter][4], 0, 0);
  }

  if (counter == numRows) {
    counter = 0;
  }

  counter++;

  for (let i = 0; i < wochenTage.length; i++) {
    let tag = wochenTage[i];

    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(textsize);
    let winkel = map(i, 0, 7, 0, 360) - 90;

    let x = radius * cos(winkel);
    let y = radius * sin(winkel);
    text(tag, x, y);

    push();
    stroke(200);
    strokeWeight(0);
    line(
      x / innerabstand,
      y / innerabstand,
      x / ausserabstand,
      y / ausserabstand
    );
    noFill();
    //ellipse(0, 0, 150);
    pop();
  }
}

function drawSecondSpiral() {
  translate(secondQuarter, 0);

  strokeWeight(lineWidth);
  if (counter != 0) {
    stroke(colZurich);

    line(
      winkelPosArray[counter + erstesJahr - 1][0],
      winkelPosArray[counter + erstesJahr - 1][1],
      winkelPosArray[counter + erstesJahr][0],
      winkelPosArray[counter + erstesJahr][1]
    );
    stroke(colBasel);
    line(
      winkelPosArray[counter + erstesJahr - 1][2],
      winkelPosArray[counter + erstesJahr - 1][3],
      winkelPosArray[counter + erstesJahr][2],
      winkelPosArray[counter + erstesJahr][3]
    );
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(textsize);
    text(winkelPosArray[counter + erstesJahr][4], 0, 0);
  }

  if (counter == numRows) {
    counter = 0;
  }

  //counter++;

  for (let i = 0; i < wochenTage.length; i++) {
    let tag = wochenTage[i];

    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(textsize);
    let winkel = map(i, 0, 7, 0, 360) - 90;

    let x = radius * cos(winkel);
    let y = radius * sin(winkel);
    text(tag, x, y);

    push();
    stroke(200);
    strokeWeight(0);
    line(
      x / innerabstand,
      y / innerabstand,
      x / ausserabstand,
      y / ausserabstand
    );
    noFill();
    //ellipse(0, 0, 150);
    pop();
  }
}

function drawthirdSpiral() {
  translate(-2 * firstQuarter, secondheight);

  strokeWeight(lineWidth);
  if (counter != 0) {
    stroke(colZurich);

    line(
      winkelPosArray[counter + erstesJahr + zweitesJahr - 1][0],
      winkelPosArray[counter + erstesJahr + zweitesJahr - 1][1],
      winkelPosArray[counter + erstesJahr + zweitesJahr][0],
      winkelPosArray[counter + erstesJahr + zweitesJahr][1]
    );
    stroke(colBasel);
    line(
      winkelPosArray[counter + erstesJahr + zweitesJahr - 1][2],
      winkelPosArray[counter + erstesJahr + zweitesJahr - 1][3],
      winkelPosArray[counter + erstesJahr + zweitesJahr][2],
      winkelPosArray[counter + erstesJahr + zweitesJahr][3]
    );
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(textsize);
    text(winkelPosArray[counter + erstesJahr + zweitesJahr][4], 0, 0);
  }

  if (counter == numRows) {
    counter = 0;
  }

  //counter++;

  for (let i = 0; i < wochenTage.length; i++) {
    let tag = wochenTage[i];

    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(textsize);
    let winkel = map(i, 0, 7, 0, 360) - 90;

    let x = radius * cos(winkel);
    let y = radius * sin(winkel);
    text(tag, x, y);

    push();
    stroke(200);
    strokeWeight(0);
    line(
      x / innerabstand,
      y / innerabstand,
      x / ausserabstand,
      y / ausserabstand
    );
    noFill();
    //ellipse(0, 0, 150);
    pop();
  }
}

function drawforthSpiral() {
  translate(2 * firstQuarter, 0);

  strokeWeight(lineWidth);
  if (counter != 0) {
    stroke(colZurich);

    line(
      winkelPosArray[counter + erstesJahr + zweitesJahr + drittesJahr - 1][0],
      winkelPosArray[counter + erstesJahr + zweitesJahr + drittesJahr - 1][1],
      winkelPosArray[counter + erstesJahr + zweitesJahr + drittesJahr][0],
      winkelPosArray[counter + erstesJahr + zweitesJahr + drittesJahr][1]
    );
    stroke(colBasel);
    line(
      winkelPosArray[counter + erstesJahr + zweitesJahr + drittesJahr - 1][2],
      winkelPosArray[counter + erstesJahr + zweitesJahr + drittesJahr - 1][3],
      winkelPosArray[counter + erstesJahr + zweitesJahr + drittesJahr][2],
      winkelPosArray[counter + erstesJahr + zweitesJahr + drittesJahr][3]
    );
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(textsize);
    text(
      winkelPosArray[counter + erstesJahr + zweitesJahr + drittesJahr][4],
      0,
      0
    );
  }

  if (counter == numRows) {
    counter = 0;
  }

  //counter++;

  for (let i = 0; i < wochenTage.length; i++) {
    let tag = wochenTage[i];

    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(textsize);
    let winkel = map(i, 0, 7, 0, 360) - 90;

    let x = radius * cos(winkel);
    let y = radius * sin(winkel);
    text(tag, x, y);

    push();
    stroke(200);
    strokeWeight(0);
    line(
      x / innerabstand,
      y / innerabstand,
      x / ausserabstand,
      y / ausserabstand
    );
    noFill();
    //ellipse(0, 0, 150);
    pop();
  }
}

function draw() {
  drawFirstSpiral();
  drawSecondSpiral();
  drawthirdSpiral();
  drawforthSpiral();
  background(0, 10);
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

function getHours(timestamp) {
  let date = new Date(timestamp);
  let hour = date.getHours();
  return hour;
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
