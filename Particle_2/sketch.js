let allePartikel = [];
let drag = 0.95;
let p5Canvas;
let data;
let datenObject;
let StromColorScale = d3.scaleLinear();

let stromData;

//Parameter
let partikelAnzahl = 400;
let ellGrösse = 6;
let farbeMinus = 0;
let farbePuls = 0;

function preload() {
  //datenObject = loadJSON("20220312.json");
  data = loadTable("dataStromWetter.csv", "csv", "header");
}

function setup() {
  p5Canvas = createCanvas(480, 63);
  frameRate(60);

  let numRows = data.getRowCount();
  let valuesInData = int(data.getColumn("elec"));
  let timestampsInData = data.getColumn("time");
  let tempInData = float(data.getColumn("temp"));
  maxValueforElec = max(valuesInData);
  minValueforElec = min(valuesInData);
  maxValueforTemp = max(tempInData);
  minValueforTemp = min(tempInData);

  let tag = 24;

  for (let i = 0; i < partikelAnzahl; i++) {
    allePartikel.push({
      i: i,
      x: random(width),
      y: random(height),
      xAcc: 0,
      yAcc: 0,
    });
  }

  StromColorScale.domain([
    -150, -125, -100, -75, -50, -25, -12, 0, 12, 25, 50, 75, 100, 125, 150, 175,
  ]).range([
    "#7c27b1",
    "#8a1dbf",
    "#b138d7",
    "#c038d1",
    "#cf38ca",
    "#d856a9",
    "#e07487",
    "#e89266",
    "#f0af44",
    "#f3c348",
    "#f5d74c",
    "#f7eb50",
    "#f9ff54",
    "#d4fb60",
    "#aef76c",
    "#FFFFFF",
  ]);
}

function draw() {
  background(0, 10);
  let zeitsprung = 60;

  //let index = floor((frameCount / zeitsprung) % data[0].length);
  let timestep = floor(frameCount / zeitsprung); // FC = 0/60 = 0
  let timeT = frameCount / zeitsprung - timestep; // 0 / 60 -0 = 0
  let maxZahl = floor(timestep % data[0].length); // 0 % 69
  let maxZahl2 = floor((maxZahl + 1) % data[0].length);

  let interpoliert = [];

  for (let i = 0; i < data.length; i++) {
    let datenWertA = data[i][maxZahl];
    let datenwertB = data[i][maxZahl2];
    interpoliert.push(datenWertA + (datenwertB - datenWertA) * timeT);
    //console.log(interpoliert);
  }

  for (let i = 0; i < allePartikel.length; i++) {
    let punkt = allePartikel[i];
    if (punkt.x < 0) {
      punkt.x = width;
    }
    if (punkt.x > width) {
      punkt.x = 0;
    }
    if (punkt.y < 0) {
      punkt.y = height;
    }
    if (punkt.y > height) {
      punkt.y = 0;
    }

    let sektor = floor(punkt.x / (width / 60));
    let wertA = interpoliert[constrain(sektor, 0, 59)];
    let wertB = interpoliert[constrain(sektor + 1, 0, 59)];
    let t = punkt.x / (width / 60);
    let interpollationsWert = (t % sektor) / sektor;
    let interpolation = wertA + (wertB - wertA) * interpollationsWert || 0.01;
    //console.log(interpolation);

    punkt.xAcc += sin(frameCount) * 0.01 + random(-0.05, 0.05);
    punkt.yAcc += map(interpolation, -8, 15, -0.8, 0.8) / 300; // 200 original
    let StromCol = StromColorScale(interpolation); // + sin(frameCount) * 10

    fill(StromCol);
    noStroke();
    ellipse(punkt.x, punkt.y, ellGrösse);

    ///// Physics Engine /////
    punkt.y = punkt.y += punkt.yAcc * -1;
    punkt.yAcc *= drag;
    punkt.x = punkt.x += punkt.xAcc;
    punkt.xAcc *= drag;
  }
}
