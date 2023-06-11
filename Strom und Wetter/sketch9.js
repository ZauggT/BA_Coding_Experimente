let data;
let valueArray = [];
let timeObjects = [];
let maxValueforElec;
let minValueforElec;
let maxValueforTemp;
let minValueforTemp;
let next;

function preload() {
  data = loadTable("dataStromWetter.csv", "csv", "header");
}
function setup() {
  createCanvas(1200, 1200);

  let numRows = data.getRowCount();
  let valuesInData = int(data.getColumn("elec"));
  let timestampsInData = data.getColumn("time");
  let tempInData = float(data.getColumn("temp"));
  maxValueforElec = max(valuesInData);
  minValueforElec = min(valuesInData);
  maxValueforTemp = max(tempInData);
  minValueforTemp = min(tempInData);

  for (let i = 0; i < numRows; i++) {
    let value = valuesInData[i];
    let timestamp = timestampsInData[i];
    let temp = tempInData[i];
    let date = new Date(timestamp);
    let quarterHours = quarterHourofTimestamp(timestamp);
    let weekday = getWeekday(timestamp);
    let month = getMonth(timestamp);
    let dayOfYear = floor(i / 12);
    if ((dayOfYear = 0)) {
      dayOfYear = 1;
    }
    valueArray.push([timestamp, value, temp]);

    let timeObject = {
      date: date,
      value: value,
      temp: temp,
      quarterHour: quarterHours,
      weekday: weekday,
      month: month,
      dayOfYear: dayOfYear,
    };
    timeObjects.push(timeObject);
  }
}
function draw() {
  drawScatterplot();
}

function drawScatterplot() {
  background(0);
  for (let i = 0; i < timeObjects.length; i++) {
    let theObjectWithAllValues1 = timeObjects[i];
    let posX1 = map(
      theObjectWithAllValues1.value,
      minValueforElec,
      maxValueforElec,
      height,
      0
    );
    let posY1 = map(
      theObjectWithAllValues1.temp,
      minValueforTemp,
      maxValueforTemp,
      0,
      width
    );
    noStroke();
    fill(255, 100);
    ellipse(posX1, posY1, 5);
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
