let data;
let arrayWithTempValuesZurich = [];
let arrayWithTempValuesBasel = [];
let arrayWithStromValuesBasel = [];
let arrayWithStromValuesZurich = [];
let timeObjects = [];
let valueArray = [];

let wochenUnterteilung = 360 / 7;
let wochenTage = [
  "montag",
  "dienstag",
  "mittwoch",
  "donerstag",
  "freitag",
  "samstag",
  "sonntag",
];

let numRows;
let previousTime = 0;
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

let myFont;
let ellipseSize = 10;

function preload() {
  data = loadTable("dataStromTemp15Min.csv", "csv", "header");
}

function setup() {
  createCanvas(3840, 2160); // 3840 x 2160
  myFont = loadFont("digital-7.mono.ttf");
  textFont(myFont);
  background(0);
  angleMode(DEGREES);

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
    let quarterHours = quarterHourofHour(timestamp);
    let weekday = getWeekday(timestamp);
    weekday = map(weekday, 0, 7, 0, 360) - 90;
    quarterHours = map(quarterHours, 0, 4, 0, 360);
    let winkel = quarterHours;

    let realstromZ = stromZurich / 150;
    let realstromB = stromBasel / 150;

    let stromZ = map(
      stromZurich,
      minStromZurich,
      maxStromZurich,
      0,
      height / 2
    );
    let stromB = map(stromBasel, minStromBasel, maxStromBasel, 0, height / 2);
    // console.log(stromZ);
    /*let x = stromZ * cos(winkel);
    let y = stromZ * sin(winkel);
    let x2 = stromB * cos(winkel);
    let y2 = stromB * sin(winkel);
 */
    let x = stromZ * cos(winkel);
    let y = stromZ * sin(winkel);
    let x2 = stromB * cos(winkel);
    let y2 = stromB * sin(winkel);
    valueArray.push([x, y, x2, y2, dateString]);
  }
}

function drawSpiral() {
  translate(width / 2, height / 2);

  if (millis() - previousTime >= 1) {
    counter++; // Increment the counter
    previousTime = millis(); // Update the previous time
  }

  strokeWeight(5);
  if (counter != 0) {
    stroke(255);

    line(
      valueArray[counter - 1][0],
      valueArray[counter - 1][1],
      valueArray[counter][0],
      valueArray[counter][1]
    );
    //line(0, 0, valueArray[counter][0], valueArray[counter][1]);
    /*     stroke("red");
    line(
      valueArray[counter - 1][2],
      valueArray[counter - 1][3],
      valueArray[counter][2],
      valueArray[counter][3]
    ); */
    /*     noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(50);
    text(valueArray[counter][4], 0, 0); */
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
    textSize(25);
    let winkel = map(i, 0, 7, 0, 360) - 90;
    let winkel2 = map(i, 0, 7, 0, 360) - 65;
    let radius = height / 2 - 50;
    let x = radius * cos(winkel);
    let y = radius * sin(winkel);

    let x2 = radius * cos(winkel2);
    let y2 = radius * sin(winkel2);
    //text(tag, x2, y2);

    push();
    stroke(255);
    strokeWeight(3);
    //line(x / 4, y / 4, x / 1.1, y / 1.1);
    noFill();
    //ellipse(0, 0, 150);
    pop();
  }
  background(0, 30);
}

function draw() {
  //drawSpiralStatic();
  drawSpiral();
}

function drawSpiralStatic() {
  translate(width / 2, height / 2);
  noLoop();
  //background(0);
  for (let i = 0; i < valueArray.length / 8; i++) {
    if (i != 0) {
      strokeWeight(3);
      stroke(255, 30);
      line(
        valueArray[i - 1][0],
        valueArray[i - 1][1],
        valueArray[i][0],
        valueArray[i][1]
      );
    }
    // ellipse(valueArray[i][0], valueArray[i][1], 50);

    /*     line(
      valueArray[counter - 1][0],
      valueArray[counter - 1][1],
      valueArray[counter][0],
      valueArray[counter][1]
    ); */
  }
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

function quarterHourofHour(timestamp) {
  let date = new Date(timestamp);
  let minutes = date.getMinutes();
  let quarterHour = Math.floor(minutes / 15);
  return quarterHour;
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
