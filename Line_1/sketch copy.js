let data;
let minutes;
let anzahlTage;
let middleX;
let middleY;
let werteArray = [];
let Farbskala;
let counter;

let valueColorScale = d3.scaleLinear();

let screenMaxWidth = document.body.offsetWidth;

const USED_DATASET = "mainDataset";
const datasets = {};

let dataProcessed = false;
let numRows = 0;
let electricityZurich;
let timeZurich;

const pointsToDraw = [];

function preload() {
  datasets.testDataset = loadTable("test.csv", "csv", "header");
  datasets.mainDataset = loadTable("data.csv", "csv", "header");
  datasets.minutes = loadTable("minutes.csv", "csv", "header");
}

function windowResized() {
  screenMaxWidth = document.body.offsetWidth;
  resizeCanvas(screenMaxWidth, 500);
  draw();
}

function setup() {
  angleMode(DEGREES);
  screenMaxWidth = document.body.offsetWidth;
  numRows = datasets[USED_DATASET].getRowCount(); //über 30'000
  electricityZurich = datasets[USED_DATASET].getColumn("value");
  timeZurich = datasets[USED_DATASET].getColumn("time");

  // in the setup, loop through every data point and add a data-point
  // to the pointsToDraw array (will be drawn later)
  for (let i = 0; i < numRows; i++) {
    const timeAsString = timeZurich[i];
    const quarterOfTheWeek = convertDateStringToQuarterOfTheWeek(timeAsString); // 01.01.2019 00:00
    // -----
    const electricity = electricityZurich[i] / 500; // Values noch mappen
    const vec = createVector(quarterOfTheWeek, electricity);
    pointsToDraw.push(vec);
  }
}

function draw() {
  createCanvas(screenMaxWidth, 500);
  background(200);

  // for each vector / point, draw the point
  for (let i = 0; i < pointsToDraw.length; i++) {
    const pointToDraw = pointInScreenRef(pointsToDraw[i]);
    point(pointToDraw.x, pointToDraw.y, 2);
  }
}

// receives a point and return the correct position where to draw it,
// according to the current screen dimensions
function pointInScreenRef(point) {
  const quartersInADay = 96; // es gibt 94 Viertelstunden pro Tag
  const modifiedX = map(point.x, 0, quartersInADay * 7, 0, screenMaxWidth);
  const modifiedY = -point.y + 300;

  return {
    x: modifiedX,
    y: modifiedY,
  };
}

// Returns the number of the quarter hour of the week based on the passed timestamp.
function convertDateStringToQuarterOfTheWeek(timeStamp) {
  const quartersInADay = 96;
  const date = new Date(timeStamp);
  const hour = date.getHours();
  const dayOfWeek = (date.getDay() + 6) % 7; // monday = 0, dienstag = 1
  const minutes = date.getMinutes();
  const quarterHour = Math.floor(minutes / 15);
  const quarterHourOfWeek =
    dayOfWeek * quartersInADay + hour * 4 + quarterHour + 1; // +1 weil zB 00:00/15 = 0, aber ist eigentlich die 1. Viertelstunde
  return quarterHourOfWeek;
}

function keyTyped() {
  if (key === "s" || key === "S") {
    saveCanvas("Linear_Stromverbrauch_Zürich", "jpg");
    print("saving image");
  }
  return false;
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
}
