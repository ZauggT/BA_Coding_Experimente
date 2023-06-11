let data;
let valueArray = [];
let colorArray = [];
let timeObjects = [];
let allePartikel = [];
let maxValueforElec;
let minValueforElec;
let maxValueforTemp;
let minValueforTemp;
let partikelAnzahl = 3500;
let drag = 0.5;
let speedX;
let anzahlStunden = 24;
let start = 2400;
let upperboundsofsector;
let lowerboundsofsector;
let exactSectorPos;
let numRows;
let StromColorScale = d3.scaleLinear();

function preload() {
  data = loadTable("dataStromWetter.csv", "csv", "header");
}
function setup() {
  createCanvas(500 * 2, 480 * 2);

  numRows = data.getRowCount();
  let valuesInData = int(data.getColumn("elec"));
  let timestampsInData = data.getColumn("time");
  let tempInData = float(data.getColumn("temp"));
  maxValueforElec = max(valuesInData);
  minValueforElec = min(valuesInData);
  maxValueforTemp = max(tempInData);
  minValueforTemp = min(tempInData);

  console.log(minValueforTemp, maxValueforTemp);

  /*   StromColorScale.domain([minValueforTemp, 5, 20, maxValueforTemp]).range([
    "#000249",
    "#0F4392",
    "#FF4949",
    "#DD1717",
  ]);
 */
  /*   StromColorScale.domain([minValueforTemp, maxValueforTemp]).range([
    "#0F4392",
    "#FF4949",
  ]); */

  StromColorScale.domain([-5, 0, 5, 10, 15, 20, 25]).range([
    "#002962",
    "#004E89",
    "#407BA7",
    "#FFFFFF",
    "#FF002B",
    "#C00021",
    "#A0001C",
  ]);
  for (let i = start; i < numRows; i++) {
    let value = valuesInData[i];
    let timestamp = timestampsInData[i];
    let temp = tempInData[i];
    //stroke("red");
    //line(0, i * eineSektorGrösse, width, i * eineSektorGrösse);
    speedX = map(value, minValueforElec, maxValueforElec, 1, 8);

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
    //console.log(valueArray);
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
  for (let i = 0; i < partikelAnzahl; i++) {
    allePartikel.push({
      i: i,
      x: random(width),
      y: random(height),
      xAcc: 0,
      yAcc: 0,
    });
  }
}

function drawParticles() {
  background(0, 25);
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

    let exactSectorPos = theParticle.y / (height / anzahlStunden);
    let welcherSektor = Math.floor(exactSectorPos);
    let fraction = exactSectorPos - welcherSektor;
    let velocity1 = valueArray[welcherSektor];
    let velocity2 = valueArray[(welcherSektor + 1) % valueArray.length];
    let interpolatedSpeed = velocity1 + (velocity2 - velocity1) * fraction;
    theParticle.xAcc += 0.4 * interpolatedSpeed;
    theParticle.yAcc += 0;

    let col1 = colorArray[welcherSektor];
    let col2 = colorArray[(welcherSektor + 1) % colorArray.length];
    let interpolateCol = col1 + (col2 - col1) * fraction;
    let StromCol = StromColorScale(interpolateCol);

    ///// Physics Engine /////
    theParticle.y = theParticle.y += theParticle.yAcc * 1;
    theParticle.yAcc *= drag;
    theParticle.x = theParticle.x += theParticle.xAcc;
    theParticle.xAcc *= drag;
    noStroke();
    fill(StromCol);
    ellipse(theParticle.x, theParticle.y, 6);
  }
}

function draw() {
  //background(0);
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
