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
  createCanvas(1200, 1200, WEBGL);

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
    //console.log(weekday, quarterHours);
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
  console.log(timeObjects);
}
function draw() {
  drawScatterplot();
}

function drawScatterplot() {
  frameRate(10);
  let bounds = [-600, 600];
  //orbitControl();
  //rotateX(-0.1);
  //rotateY(-0.1);
  //rotateZ(0.1);
  background(0, 10);

  for (let i = 0; i < timeObjects.length; i++) {
    next = 1;
    if (frameCount >= timeObjects.length) {
      frameCount = 0;
    }
    if (i >= timeObjects.length) {
      next = -1;
    }

    let theObjectWithAllValues1 = timeObjects[i];
    let theObjectWithAllValues2 = timeObjects[i + next];
    console.log(next, timeObjects.length);

    let posX1 = map(
      theObjectWithAllValues1.value,
      minValueforElec,
      maxValueforElec,
      -width / 2,
      width / 2
    );
    let posX2 = map(
      theObjectWithAllValues2.value,
      minValueforElec,
      maxValueforElec,
      -width / 2,
      width / 2
    );

    let posY1 = map(
      theObjectWithAllValues1.temp,
      minValueforTemp,
      maxValueforTemp,
      height / 2,
      -height / 2
    );
    let posY2 = map(
      theObjectWithAllValues2.temp,
      minValueforTemp,
      maxValueforTemp,
      height / 2,
      -height / 2
    );
    stroke(0);
    line(posX1, posY1, posX2, posY2);

    let posZ = map(i, 0, timeObjects.length, bounds[0], bounds[1]);

    /*     noStroke();
    push();
    translate(posX, posY, posZ);
    sphere(2, 6, 6); 
    
    pop();*/
    /*     noStroke();
    fill(255, 0, 0);
    ellipse(posX1, posY1, 20); */
    /*     let sektor = height / 14 + theObjectWithAllValues.weekday * 100; //100
    let posX = map(theObjectWithAllValues.value, minValue, maxValue, 0, width);
    let posY = sektor + random(-45, 45);
    ellipse(posX, posY, 2); */
  }
  /*   let m = 600;
  strokeWeight(2);
  stroke("red");
  line(0, 0, -m, 0, 0, m);
  stroke("blue");
  line(0, -m, 0, 0, m, 0);
  stroke("green");
  line(-m, 0, 0, m, 0, 0); */
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
