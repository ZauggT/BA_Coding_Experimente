let dataZB;
let valueArray = [];
let timeObjects = [];
let maxValueZ;
let minValueZ;
let maxValueB;
let minValueB;

let quarterHourScale = d3.scaleLinear();

function preload() {
  dataZB = loadTable("dataZB.csv", "csv", "header");
}

function setup() {
  createCanvas(800, 10000);
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
}

function draw() {
  background(0);
  randomSeed(1);
  //noLoop();
  drawComparison();
}

function drawComparison() {
  let left = 0;
  let middle = width / 2;
  let right = width;

  for (let i = 0; i < timeObjects.length; i++) {
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
    /*     let sektor = height / 14 + theThing.weekday * 100; //100
    let posX = map(theThing.value, minValue, maxValue, 0, width);
    let posY = sektor + random(-45, 45);
    let quarterHourColor = quarterHourScale(theThing.quarterHour);
    noStroke();
    fill(quarterHourColor);
    ellipse(posX, posY, 3); */
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
