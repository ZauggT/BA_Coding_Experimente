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
let stringLänge;
let dateString;

let textgrösse;

function preload() {
  data = loadTable("dataStromTemp15Min.csv", "csv", "header");
}

function setup() {
  //createCanvas(3840, 2160); // 3840 x 2160
  createCanvas(windowWidth, windowHeight);
  background("black");
  rectwidth = windowWidth / 366;
  rectheight = windowHeight / 95;
  textgrösse = windowWidth / 150;
  //frameRate(120);
  //rectMode(CENTER);

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
    let date = new Date(timestamp);
    let day = String(date.getDate()).padStart(2, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let year = getFullYear(timestamp);
    let stunde = String(date.getHours()).padStart(2, "0");
    let minute = String(date.getMinutes()).padStart(2, "0");

    stringLänge = textWidth(`${day}.${month}.${year} ${stunde}:${minute} Uhr`);
    let quarterHours = quarterHourofTimestamp(timestamp);
    let quarterHourRaw = quarterHourofTimestamp(timestamp);
    let dayOfYear = getDayOfYear(timestamp);

    if (year == 2020) {
      let x = map(dayOfYear, 0, 366, 0, width);
      let yB = map(quarterHours, 0, 96, 0, height);
      let yZ = map(quarterHours, 0, 96, 0, height);
      let alpha = map(stromBasel, minStromBasel, maxStromBasel, -30, 280);
      let sizeB = map(stromBasel, minStromBasel, maxStromBasel, 1, 20);
      let sizeZ = map(stromZurich, minStromZurich, maxStromZurich, 1, 20);
      dateString = `Basel \n${day}.${month}.${year} ${stunde}:${minute} Uhr \n${stromBasel} kWh`;
      valeArray.push([
        x,
        yB,
        sizeB,
        yZ,
        sizeZ,
        dateString,
        alpha,
        stromBasel / 1000,
        stromZurich / 1000,
      ]);
    }

    /*     arrayWithStromValuesBasel.push(stromBasel);
    arrayWithStromValuesZurich.push(stromZurich);
    arrayWithTempValuesBasel.push(tempBasel);
    arrayWithTempValuesZurich.push(tempZurich); */
  }
  //console.log(valeArray);
}

function drawCalendarStatic() {
  background(0);
  rectMode(CORNER);
  if (mouseX <= 0) {
    mouseX = 0;
  }
  if (mouseX >= windowWidth) {
    mouseX = windowWidth;
  }
  if (mouseY <= 0) {
    mouseY = 0;
  }
  if (mouseY >= height) {
    mouseY = height;
  }

  let posX = ceil(map(mouseX, 0, windowWidth, 0, 366));
  let posY = ceil(map(mouseY, 0, windowHeight, 0, 96));

  let index = posX * 96 + posY;
  let index2 = index - 96;
  if (index2 <= 0) {
    index2 = 0;
  }
  textAlign(CENTER, CENTER);
  textSize(textgrösse);
  let ascent = textAscent();
  let descent = textDescent();
  let stringHeight = ascent + descent;

  // noLoop();
  for (let i = 0; i < valeArray.length; i++) {
    noStroke();
    fill(255, valeArray[i][6]);
    rect(valeArray[i][0], valeArray[i][1], rectwidth, rectheight); //Basel
    // rect(valeArray[i][0], valeArray[i][3], rectwidth, rectheight); //Zürich
    //ellipse(valeArray[i][0], valeArray[i][1], 8);
  }
  rectMode(CENTER);
  fill(0);
  rect(mouseX, mouseY - 50, 2 * stringLänge, 4 * stringHeight, 5);

  fill(255);

  text(valeArray[index2][5], mouseX, mouseY - 50);
}

function drawCalender() {
  //background(0, 5);
  fill(255);
  ellipse(valeArray[counter][0], valeArray[counter][1], valeArray[counter][2]); //Basel
  /*   fill(255);
  ellipse(valeArray[counter][0], valeArray[counter][3], valeArray[counter][4]); //Zürich */
  /* 
  fill(10);
  rect(width / 2, height / 2, 200, 50);

  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(35);
  text(valeArray[counter][5], width / 2, height / 2); */

  /*   if (millis() - lastUpdateTime > updateInterval) {
    counter++;
    lastUpdateTime = millis();
  } */

  //console.log(millis());
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

  counter++;
}

function draw() {
  drawCalendarStatic();
  //drawCalender();
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
