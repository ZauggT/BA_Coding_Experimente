let data;
let valueArray = [];
let timeObjects = [];
let maxValue;
let minValue;

let quarterHourScale = d3.scaleLinear();

function preload() {
  data = loadTable("data.csv", "csv", "header");
}

function setup() {
  createCanvas(1000, 700);

  quarterHourScale
    .domain([0, 33, 66, 100])
    .range(["#21d1a1", "#348bf8", "#9160ff", "#c83d7e"]);

  let numRows = data.getRowCount();
  let valuesInData = int(data.getColumn("value"));
  let timestampsInData = data.getColumn("time");
  maxValueforElec = max(valuesInData);
  minValueforElec = min(valuesInData);

  for (let i = 0; i < numRows; i++) {
    let value = valuesInData[i];
    let timestamp = timestampsInData[i];
    let date = new Date(timestamp);
    let quarterHours = quarterHourofTimestamp(timestamp);
    let weekday = getWeekday(timestamp);
    let month = getMonth(timestamp);
    let dayOfYear = floor(i / 96);
    //console.log(weekday, quarterHours);
    valueArray.push([timestamp, value]);

    let timeObject = {
      date: date,
      value: value,
      quarterHour: quarterHours,
      weekday: weekday,
      month: month,
      dayOfYear: dayOfYear,
    };
    timeObjects.push(timeObject);
  }
  //console.log(valueArray);
}

function draw() {
  background(0);
  randomSeed(1);
  //noLoop();
  //drawLinechart();
  drawSector();
  //drawLines();
  //drawWeekLines();
  //checkHover();
}
function checkHover() {
  let hoveredObject = null;
  for (let i = 0; i < timeObjects.length; i++) {
    let theThing = timeObjects[i];
    let sektor = height / 14 + theThing.weekday * 100; //100
    let posX = map(theThing.value, minValueforElec, maxValueforElec, 0, width);
    let posY = sektor + random(-45, 45);
    let d = dist(mouseX, mouseY, posX, posY);
    if (d < 5) {
      hoveredObject = theThing;
      break;
    }
  }
  if (hoveredObject) {
    textSize(16);
    fill(255);
    text(hoveredObject.date, mouseX, mouseY);
  }
}

function drawWeekLines() {
  for (let i = 0; i < timeObjects.length; i++) {
    let theThing = timeObjects[i];
    let sektor = height / 14 + theThing.weekday * 100; //100

    //console.log({ sektor });

    let posX = map(theThing.value, minValueforElec, maxValueforElec, 0, width);
    let posY = sektor + random(-45, 45);

    ellipse(posX, posY, 2);
  }
}

function drawSector() {
  for (let i = 0; i < timeObjects.length; i++) {
    let theThing = timeObjects[i];
    let sektor = height / 14 + theThing.weekday * 100; //100

    //console.log({ sektor });

    let posX = map(theThing.value, minValueforElec, maxValueforElec, 0, width);
    let posY = sektor + random(-45, 45);
    let quarterHourColor = quarterHourScale(theThing.quarterHour);
    noStroke();
    fill(quarterHourColor);
    ellipse(posX, posY, 3);
  }
}

function drawLinechart() {
  for (let i = 0; i < timeObjects.length; i++) {
    let theThing = timeObjects[i];
    let sektor = (height / 7) * theThing.weekday; //100
    let posInSektor = sektor + theThing.quarterHour;

    // console.log({ posInSektor });

    //let posX = map(theThing.value, 50000, 12000, 0, width);
    let posX = map(theThing.value, minValueforElec, maxValueforElec, 0, width);
    let posY = posInSektor;
    //let posY = height / 14 + theThing.weekday * sektor;

    ellipse(posX, posY, 2);
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
function getMonth(timestamp) {
  let date = new Date(timestamp);
  let month = date.getMonth();
  return month;
}
