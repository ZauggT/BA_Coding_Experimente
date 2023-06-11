let data;
let dataZB;
let valueArray = [];
let timeObjects = [];
let maxValueZ;
let minValueZ;
let maxValueB;
let minValueB;

////
let rectStart;
let rectEnd;
let positionY;
let size = 200; // Größe der Rechtecke
let minimales_I = 0; // Minimalwert
let maximales_I = 35040; // Maximalwert
let startPunkt;
let endPunkt;
////

//let quarterHourScale = d3.scaleLinear();

function preload() {
  dataZB = loadTable("dataZB.csv", "csv", "header");
}

function setup() {
  createCanvas(800, 1000);

  /*   quarterHourScale
    .domain([0, 33, 66, 100])
    .range(["#21d1a1", "#348bf8", "#9160ff", "#c83d7e"]); */

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
  rectStart = 0;
  rectEnd = width - size;
  positionY = height / 2 - size / 2;
}

function draw() {
  background(200);
  randomSeed(1);
  //noLoop();
  drawComparison();
}

function drawComparison() {
  let left = 0;
  let middle = width / 2;
  let right = width;
  startPunkt = map(rectStart, 0, width - size, minimales_I, maximales_I);
  endPunkt = map(rectEnd, 0, width - size, minimales_I, maximales_I);

  // Rechtecke zeichnen
  fill(255, 0, 0, 50);
  rect(rectStart, positionY, size);
  fill(0, 255, 0, 50);
  rect(rectEnd, positionY, size);

  noStroke();
  fill("red");
  quad(
    rectStart + size,
    height / 2 - size / 2,
    rectEnd,
    height / 2 - size / 2,
    rectEnd,
    height / 2 + size / 2,
    rectStart + size,
    height / 2 + size / 2
  );

  for (let i = 0 + floor(startPunkt); i < floor(endPunkt); i++) {
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
}

function mouseDragged() {
  if (
    mouseX >= rectStart &&
    mouseX <= rectStart + size &&
    mouseY >= positionY &&
    mouseY <= positionY + size
  ) {
    rectStart = constrain(mouseX - size / 2, 0, rectEnd - size);
    console.log({ rectStart });
  } else if (
    mouseX >= rectEnd &&
    mouseX <= rectEnd + size &&
    mouseY >= positionY &&
    mouseY <= positionY + size
  ) {
    rectEnd = constrain(mouseX - size / 2, rectStart + size, width - size);
    console.log({ rectEnd });
  }
  textSize(12);
  textAlign(LEFT);
  text("Start: " + floor(startPunkt), 50, height / 2 - 20);
  text("Ende: " + floor(endPunkt), 50, height / 2 + 30);
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
