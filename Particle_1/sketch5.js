let data;
let allePartikel = [];

let speedsBasel = [];
let speedsZurich = [];
let velocityBasel1;
let velocityBasel2;
let velocityZurich1;
let velocityZurich2;

let colorsBasel = [];
let colorsZurich = [];
let stromColBasel1;
let stromColBasel2;
let stromColZurich1;
let stromColZurich2;
let stromColBasel;
let stromColZurich;
let interpolateCol;

let interpolatedSpeed;

let maxStromZurich;
let minStromZurich;
let maxTempZurich;
let minTempZurich;
let maxStromBasel;
let minStromBasel;
let maxTempBasel;
let minTempBasel;
let partikelAnzahl = 3500;
let drag = 0.5;

let anzahlStundenProTag = 24;
let start = 0;
let exactSectorPos;
let numRows;

let StromColorScaleBasel = d3.scaleLinear();
let StromColorScaleZurich = d3.scaleLinear();
let counter = 0;
let timer = 0;
let alpha;

function preload() {
  data = loadTable("dataSW_ZB.csv", "csv", "header");
}

function setup() {
  createCanvas(3840, 2160);
  background(0);

  StromColorScaleBasel.domain([-5, 0, 5, 10, 15, 20, 25]).range([
    "#002962",
    "#004E89",
    "#407BA7",
    "#FFFFFF",
    "#FF002B",
    "#C00021",
    "#A0001C",
  ]);
  StromColorScaleZurich.domain([-5, 0, 5, 10, 15, 20, 25]).range([
    "#002962",
    "#004E89",
    "#407BA7",
    "#FFFFFF",
    "#FF002B",
    "#C00021",
    "#A0001C",
  ]);

  numRows = data.getRowCount();

  let zurichStromValues = int(data.getColumn("SV_1h_Z"));
  let baselStromValues = int(data.getColumn("SV_1h_B"));
  let zurichTempValues = float(data.getColumn("T_Z"));
  let baselTempValues = float(data.getColumn("T_B"));
  let timestampsInDataZB = data.getColumn("time");
  /* 
  console.log({ baselTempValues });
  console.log({ zurichTempValues }); */
  //console.log("Values Basel", baselStromValues);

  maxStromZurich = max(zurichStromValues);
  minStromZurich = min(zurichStromValues);
  maxTempZurich = max(zurichTempValues);
  minTempZurich = min(zurichTempValues);
  maxStromBasel = max(baselStromValues);
  minStromBasel = min(baselStromValues);
  maxTempBasel = max(baselTempValues);
  minTempBasel = min(baselTempValues);

  /*   console.log("mintemp Z", minTempZurich, "maxtemp Z", maxTempZurich);
  console.log("mintemp B", minTempBasel, "maxtemp B", maxTempBasel); */

  for (let i = 0; i < numRows; i++) {
    let zurichStromValue = zurichStromValues[i];
    let baselStromValue = baselStromValues[i];
    let zurichTempValue = zurichTempValues[i];
    let baselTempValue = baselTempValues[i];
    let timestamp = timestampsInDataZB[i];

    let speedsForBasel = map(
      baselStromValue,
      minStromBasel,
      maxStromBasel,
      1,
      10
    );
    let speedsForZurich = map(
      zurichStromValue,
      minStromZurich,
      maxStromZurich,
      1,
      10
    );

    speedsBasel.push(speedsForBasel);
    speedsZurich.push(speedsForZurich);

    colorsBasel.push(baselTempValue);
    colorsZurich.push(zurichTempValue);
  }
  //console.log(speedsBasel);

  ///// Partikel /////
  for (let i = 0; i < partikelAnzahl; i++) {
    allePartikel.push({
      i: i,
      x: random(width),
      y: random(height),
      xAcc: 0,
      yAcc: 0,
      size: 10,
    });
  }
}

function drawParticles() {
  background(0, 30);
  let currentTime = millis();

  if (currentTime - timer >= 120) {
    counter++;
    timer = currentTime;
  }

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

    //alpha = map(speedsBasel[welcherSektor + counter], 1.5, 10, 0, 200);

    if (welcheSpalte <= 0) {
      sektorspeed = speedsBasel[welcherSektor + counter];
      alpha = map(speedsBasel[welcherSektor + counter], 1.5, 10, 0, 200);
    } else {
      sektorspeed = speedsZurich[welcherSektor + counter];
      alpha = map(speedsZurich[welcherSektor + counter], 1.5, 10, 0, 200);
    }

    ///// Physics Engine /////
    theParticle.xAcc += 0.4 * sektorspeed;
    theParticle.yAcc += 0;
    //theParticle.yAcc += sin(frameCount / 30) * -0.05;  sin(frameCount * random(-0.1, 0.1));

    //theParticle.y = theParticle.y += theParticle.yAcc * 1;

    theParticle.y += theParticle.yAcc * 1;
    theParticle.yAcc *= drag;
    theParticle.x += theParticle.xAcc;
    theParticle.xAcc *= drag;

    noStroke();
    fill(255, alpha);
    //ellipse(theParticle.x, theParticle.y, 6);
    ellipse(theParticle.x, theParticle.y, theParticle.size);
  }
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
