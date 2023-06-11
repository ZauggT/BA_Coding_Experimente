let data;
let dataZB;
let valueArray = [];
let timeObjects = [];
let maxValueZ;
let minValueZ;
let maxValueB;
let minValueB;

////
let xStart;
let xEnd; // X-Position der Start- und Endzeitpunkt Rechtecke
let positionY; // Y-Position der Rechtecke
let size = 100; // Größe der Rechtecke
let minimales_I = 0; // Minimalwert
let maximales_I = 5000; // Maximalwert
let startPunkt;
let endPunkt;
let verbindungRechteckPosY; // Y-Position der Linie
let verbindungRechteckHight = 50; // Höhe der Linie
let verbindungRechteckPosX;
let verbindungRechteckPosX2; // X-Positionen der Linie
////

let quarterHourScale = d3.scaleLinear();

function preload() {
  dataZB = loadTable("dataZB.csv", "csv", "header");
}

function setup() {
  createCanvas(800, 1000);

  quarterHourScale
    .domain([0, 33, 66, 100])
    .range(["#21d1a1", "#348bf8", "#9160ff", "#c83d7e"]);

  let numRows = dataZB.getRowCount();
  let valuesforZurichinData = int(dataZB.getColumn("valueZ"));
  let valuesforBaselinData = int(dataZB.getColumn("valueB"));
  let timestampsInDataZB = dataZB.getColumn("time");
  maxValueZ = max(valuesforZurichinData);
  minValueZ = min(valuesforZurichinData);
  maxValueB = max(valuesforBaselinData);
  minValueB = min(valuesforBaselinData);

  for (let i = 0; i < numRows; i++) {
    let valueZ = valuesforZurichinData[i];
    let valueB = valuesforBaselinData[i];
    let timestamp = timestampsInDataZB[i];
    let date = new Date(timestamp);
    let quarterHours = quarterHourofTimestamp(timestamp);
    let weekday = getWeekday(timestamp);
    let month = getMonth(timestamp);
    let dayOfYear = floor(i / 96);
    valueArray.push([timestamp, valueB, valueZ]);

    let timeObject = {
      date: date,
      valueZ: valueZ,
      valueB: valueB,
      quarterHour: quarterHours,
      weekday: weekday,
      month: month,
      dayOfYear: dayOfYear,
    };
    timeObjects.push(timeObject);
  }
  ////
  xStart = 0;
  xEnd = width - size;
  positionY = height / 2 - size / 2; // 500 - 25 = 475
  verbindungRechteckPosY = positionY + size / 2 - verbindungRechteckHight / 2; // 475 +25 - 0 = 500
  ////
}

function draw() {
  frameRate(5);
  background(200);
  randomSeed(1);
  //noLoop();
  drawComparison();
}

function drawComparison() {
  let left = 0;
  let middle = width / 2;
  let right = width;

  ////
  // Positionen der Rechtecke und Linie aktualisieren
  startPunkt = map(xStart, 0, width - size, minimales_I, maximales_I);
  endPunkt = map(xEnd, 0, width - size, minimales_I, maximales_I);
  verbindungRechteckPosX = xStart + size;
  verbindungRechteckPosX2 = xEnd;

  for (let i = 0 + floor(startPunkt); i < floor(endPunkt); i++) {
    //
    //console.log(floor(endPunkt));
    let theThing = timeObjects[i];

    let posXforZ = map(theThing.valueZ, minValueZ, maxValueZ, middle, left);
    let posXforB = map(theThing.valueB, minValueB, maxValueB, middle, right);

    let posYforZ = map(i, 0, timeObjects.length, 0, height);
    let posYforB = map(i, 0, timeObjects.length, 0, height);

    stroke("red");
    point(posXforB, posYforB);
    stroke("blue");
    point(posXforZ, posYforZ);
    stroke("white");
    line(middle, 0, middle, 1000);
  }
  // Rechtecke zeichnen
  fill(255, 0, 0, 50);
  rect(xStart, positionY, size);
  fill(0, 255, 0, 50);
  rect(xEnd, positionY, size);
  //console.log(xEnd);

  // Linie zeichnen
  noStroke();
  fill(0, 50);
  rect(
    verbindungRechteckPosX,
    verbindungRechteckPosY,
    verbindungRechteckPosX2 - verbindungRechteckPosX,
    verbindungRechteckHight
  );

  // Start- und Endzeitpunkt Werte anzeigen
  textSize(12);
  textAlign(LEFT);
  text("Start: " + startPunkt, 50, height / 2 - 20);
  text("Ende: " + endPunkt, 50, height / 2 + 30);
  ////
}
////
function mouseDragged() {
  // Start- oder Endzeitpunkt Rechtecke verschieben
  if (
    mouseX >= xStart &&
    mouseX <= xStart + size &&
    mouseY >= positionY &&
    mouseY <= positionY + size
  ) {
    xStart = constrain(mouseX - size / 2, 0, xEnd - size);
  } else if (
    mouseX >= xEnd &&
    mouseX <= xEnd + size &&
    mouseY >= positionY &&
    mouseY <= positionY + size
  ) {
    xEnd = constrain(mouseX - size / 2, xStart, width - size);
  }

  // Linie und Start- und Endzeitpunkt Rechtecke anpassen
  if (
    mouseY >= verbindungRechteckPosY &&
    mouseY <= verbindungRechteckPosY + verbindungRechteckHight
  ) {
    let diff = mouseX - pmouseX;
    xStart += diff;
    xEnd += diff;

    xStart = constrain(xStart, 0, width - size * 2);
    xEnd = constrain(xEnd, size * 2, width);
  }

  // Linie anpassen
  verbindungRechteckPosY = positionY + size / 2 - verbindungRechteckHight / 2;
}
////

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
