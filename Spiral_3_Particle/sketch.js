let data;
let dataStrom;
let minutes;
let anzahlTage;
let middleX;
let middleY;
let maxStromB = 57731;
let minStromB = 22355;
let maxStromZ = 116593;
let minStromZ = 45505;
let allePartikel = [];
let partikelAnzahl = 1000;
let drag = 0.5;

let valueColorScale = d3.scaleLinear();

function preload() {
  data = loadTable("data.csv", "csv", "header");
  dataStrom = loadTable("dataStrom.csv", "csv", "header");
  minutes = loadTable("minutes.csv", "csv", "header");
}

function setup() {
  createCanvas(500, 500);
  angleMode(DEGREES);

  let numRows = dataStrom.getRowCount();
  let stromBasel = int(dataStrom.getColumn("SVB"));
  let stromZurich = int(dataStrom.getColumn("SVZ"));
  let timestamps = dataStrom.getColumn("time");
  console.log(stromBasel);

  let oneWeek = 672;

  for (let i = 0; i < oneWeek; i++) {
    let stromValBasel = stromBasel[i];
    let stromValZurich = stromZurich[i];
    let timestamp = timestamps[i];

    let date = new Date(timestamp);
    let quarterHours = quarterHourofTimestamp(timestamp);
    let weekday = getWeekday(timestamp);
    let month = getMonth(timestamp);

    let spacingWeek = -360 / 672;

    let angleWeek = spacingWeek * i + 180;
    let w = stromBasel[i] / 300;
    console.log(w);

    let dx = w * sin(angleWeek);

    let dy = w * cos(angleWeek);

    //let x = 10;
    //let y = 50 + i * 5;
    //let w = map(value[i], 0, max(value), 0, 150);

    stroke(70);
    strokeWeight(0.1);
    //fill("red");

    fill(255, 240, 31, 90);
    //stroke(255, 240, 31, 5);
    ellipse(width / 2 + dx, height + dy, 50);

    // speedX = map(value, minValueforElec, maxValueforElec, 1, 8);

    let dayOfYear = floor(i / 12);
    if ((dayOfYear = 0)) {
      dayOfYear = 1;
    }
    //valueArray.push(speedX);
    //colorArray.push(temp);
    //console.log(valueArray);
    /*    let timeObject = {
      date: date,
      value: value,
      temp: temp,
      quarterHour: quarterHours,
      weekday: weekday,
      month: month,
      dayOfYear: dayOfYear,
    };
    timeObjects.push(timeObject); */
  }
  for (let i = 0; i < partikelAnzahl; i++) {
    allePartikel.push({
      i: i,
      x: width / 2,
      y: height / 2,
      xAcc: 0,
      yAcc: 0,
    });
  }
}

function draw() {
  drawRadialParticles();
}

function drawRadialParticles() {
  background(0, 30);
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
    theParticle.xAcc += random(-1, 1);
    theParticle.yAcc += random(-1, 1);

    /*     let exactSectorPos = theParticle.y / (height / anzahlStunden);
    let welcherSektor = Math.floor(exactSectorPos);
    let fraction = exactSectorPos - welcherSektor;
    let velocity1 = valueArray[welcherSektor];
    let velocity2 = valueArray[(welcherSektor + 1) % valueArray.length];
    let interpolatedSpeed = velocity1 + (velocity2 - velocity1) * fraction;
    theParticle.xAcc += 0.4 * interpolatedSpeed;
    theParticle.yAcc += 0.05;

    let col1 = colorArray[welcherSektor];
    let col2 = colorArray[(welcherSektor + 1) % colorArray.length];
    let interpolateCol = col1 + (col2 - col1) * fraction;
    let StromCol = StromColorScale(interpolateCol); */

    ///// Physics Engine /////
    theParticle.y = theParticle.y += theParticle.yAcc * 1;
    theParticle.yAcc *= drag;
    theParticle.x = theParticle.x += theParticle.xAcc;
    theParticle.xAcc *= drag;
    noStroke();
    fill(255);
    ellipse(theParticle.x, theParticle.y, 2);
  }
}

function drawRadiallinechart() {
  let numRows = data.getRowCount();
  let value = data.getColumn("value");
  let time = data.getColumn("time");

  anzahlTage = numRows / 96;
  anzahlWochen = int(numRows / 672);
  //console.log(anzahlWochen);
  //console.log("anzahl Tage", anzahlTage);

  for (let i = 0; i < numRows; i++) {
    /*     let spacing = -360 / (numRows / anzahlTage);
    let angle = spacing * i + 180; */

    let spacingWeek = -360 / 672;
    let angleWeek = spacingWeek * i + 180;
    let w = value[i] / 300;
    let dx = w * sin(angleWeek);
    let dy = w * cos(angleWeek);

    //let x = 10;
    //let y = 50 + i * 5;
    //let w = map(value[i], 0, max(value), 0, 150);

    stroke(70);
    strokeWeight(0.1);
    //fill("red");

    fill(255, 240, 31, 90);
    //stroke(255, 240, 31, 5);
    ellipse(middleX + dx, middleY + dy, 3);

    //line(middleX, middleY, middleX + dx, middleY + dy);
    //line(middleX, middleY, middleX - dx, middleY - dy);

    //rect(x, y, w, h);
    //textSize(5);
    //text(i, x, y);
    //text(i, middleX + dx, middleY + dy);
  }
}
function keyTyped() {
  if (key === "s" || key === "S") {
    saveCanvas("Radial_Wochenzyklus_Stromverbrauch_Zürich", "jpg");
    print("saving image");
  }
  return false;
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
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
