let data;
let valueArray = [];
let colorArray = [];
let timeObjects = [];
let allePartikel = [];
let maxValueforElec;
let minValueforElec;
let maxValueforTemp;
let minValueforTemp;
let partikelAnzahl = 1;
let drag = 0.5;
let speedX;
let anzahlStundenProTag = 24;
let start = 24 * 50;
let exactSectorPos;
let numRows;
let StromColorScale = d3.scaleLinear();
let counter = 0;
let timer = 0;

function preload() {
  data = loadTable("dataStromWetter.csv", "csv", "header");
}
function setup() {
  createCanvas(800, 800);

  StromColorScale.domain([-5, 0, 5, 10, 15, 20, 25]).range([
    "#002962",
    "#004E89",
    "#407BA7",
    "#FFFFFF",
    "#FF002B",
    "#C00021",
    "#A0001C",
  ]);

  numRows = data.getRowCount();
  let valuesInData = int(data.getColumn("elec"));
  let timestampsInData = data.getColumn("time");
  let tempInData = float(data.getColumn("temp"));
  maxValueforElec = max(valuesInData);
  minValueforElec = min(valuesInData);
  maxValueforTemp = max(tempInData);
  minValueforTemp = min(tempInData);

  for (let i = start; i < numRows; i++) {
    let value = valuesInData[i];
    let timestamp = timestampsInData[i];
    let temp = tempInData[i];
    speedX = map(value, minValueforElec, maxValueforElec, 0.5, 9);

    let date = new Date(timestamp);
    let quarterHours = quarterHourofTimestamp(timestamp);
    let weekday = getWeekday(timestamp);
    let month = getMonth(timestamp);
    let dayOfYear = floor(i / 12);
    if ((dayOfYear = 0)) {
      dayOfYear = 1;
    }
    valueArray.push(speedX);
    colorArray.push(temp);

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

  ///// Partikel /////
  for (let i = 0; i < partikelAnzahl; i++) {
    allePartikel.push({
      i: i,
      x: random(width),
      y: 200,
      xAcc: 0,
      yAcc: 0,
    });
  }
}

function drawParticles() {
  background(0, 25);
  /*   let currentTime = millis();

  if (currentTime - timer >= 500) {
    counter++;
    timer = currentTime;
  } */

  for (let i = 0; i < allePartikel.length; i++) {
    let theParticle = allePartikel[i];

    if (theParticle.x < 0) {
      theParticle.x = width;
    }
    if (theParticle.x > width) {
      theParticle.x = 0;
    }
    if (theParticle.y < 0) {
      theParticle.y = height;
    }
    if (theParticle.y > height) {
      theParticle.y = 0;
    }

    //console.log(frameCount);

    ///// Interpolation /////
    let exactSpaltePos = theParticle.x / (width / 2);
    let welcheSpalte = floor(exactSpaltePos);

    let exactSectorPos = theParticle.y / (height / anzahlStundenProTag);
    let welcherSektor = Math.floor(exactSectorPos);
    let fraction = exactSectorPos - welcherSektor;
    let velocity1 = valueArray[welcherSektor + counter];
    let velocity2 =
      valueArray[(welcherSektor + counter + 1) % valueArray.length];
    let interpolatedSpeed = velocity1 + (velocity2 - velocity1) * fraction;

    let col1 = colorArray[welcherSektor + counter];
    let col2 = colorArray[(welcherSektor + counter + 1) % colorArray.length];
    let interpolateCol = col1 + (col2 - col1) * fraction;
    let StromCol = StromColorScale(interpolateCol);

    ///// Physics Engine /////
    theParticle.xAcc += 0.4 * interpolatedSpeed;
    theParticle.yAcc += 0;

    theParticle.y = theParticle.y += theParticle.yAcc * 1;
    theParticle.yAcc *= drag;
    theParticle.x = theParticle.x += theParticle.xAcc;
    theParticle.xAcc *= drag;
    noStroke();
    fill(StromCol);
    ellipse(theParticle.x, theParticle.y, 6);
  }

  //console.log(counter);
}

function draw() {
  drawParticles();
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
