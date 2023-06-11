let data19;
let data20;
let dataB;
let minutes;
let anzahlTage;
let middleX;
let middleY;
let werteArray = [];
let Farbskala;
let counter19;
let counter20;
let counterB;

let valueColorScale = d3.scaleLinear();
let valueColorScaleB = d3.scaleLinear();

function preload() {
  data19 = loadTable("data_z_19.csv", "csv", "header");
  data20 = loadTable("data_z_20.csv", "csv", "header");
  dataB = loadTable("data_b_19_23.csv", "csv", "header");

  minutes = loadTable("minutes.csv", "csv", "header");
}

function setup() {
  angleMode(DEGREES);
  /*   valueColorScale
    .domain([40000, 60000, 80000, 100000])
    .range(["#004D40", "#FFC107", "#1E88E5", "#D81B60"]); */

  //ColorBlindColors
  /*   valueColorScale
    .domain([50000, 70000, 90000, 110000])
    .range(["#21d1a1", "#23bed7", "#5e70ff", "#9160ff"]); */

  valueColorScale
    .domain([50000, 70000, 90000, 110000])
    .range(["#21d1a1", "#348bf8", "#9160ff", "#c83d7e"]);

  valueColorScaleB
    .domain([20000, 30000, 40000, 50000])
    .range(["#21d1a1", "#348bf8", "#9160ff", "#c83d7e"]);

  //console.log(minutes);
  // Wie kann ich die Time (2019-01-02T00:00) mappen?
}

function draw() {
  noLoop();
  createCanvas(365 * 3, 96 * 3 * 2);
  background(0);

  let numRowsMinutes = minutes.getRowCount();
  let minute = minutes.getColumn("minutes");

  let numRows19 = data19.getRowCount(); //über 30'000
  let numRows20 = data20.getRowCount();
  let numRowsB = dataB.getRowCount();
  console.log(numRows19);
  let value19 = data19.getColumn("value");
  let value20 = data20.getColumn("value");
  let valueB = dataB.getColumn("value");
  let time = data19.getColumn("time");

  console.log("Z", min(value19));
  console.log("Z", min(value19));

  counter19 = 0;
  let y19 = 0;
  let x19 = 0;

  for (let k = 0; k < numRows19; k++) {
    let farbe = map(value19[k], 55000, 90000, 0, 255);
    y19++;
    if (k % 96 == 0) {
      counter19 += 1;
      y19 = 0;
    }
    x19 = -1 + counter19;

    let valueforCol19 = valueColorScale(value19[k]);
    let valueCol19 = color(valueforCol19);

    //fill(0, farbe, 0);
    fill(valueCol19);
    noStroke();
    rect(x19 * 3, y19 * 3, 3);
  }

  counterB = 0;
  let yb = 0;
  let xb = 0;

  for (let k = 0; k < 35040; k++) {
    let farbe = map(value19[k], 55000, 90000, 0, 255);
    yb++;
    if (k % 96 == 0) {
      counterB += 1;
      yb = 0;
    }
    xb = -1 + counterB;

    let valueforColB = valueColorScaleB(valueB[k]);
    let valueColB = color(valueforColB);

    //fill(0, farbe, 0);
    fill(valueColB);
    noStroke();
    rect(xb * 3, 96 * 3 + yb * 3, 3);
  }

  //pseudo Monate (nicht alle Monate haben die gleiche Anzahl Tage)
  for (j = 0; j < 12; j++) {
    let xMonat = (width / 12) * j;
    line(xMonat, 0, xMonat, height);
  }
}

function keyTyped() {
  if (key === "s" || key === "S") {
    saveCanvas("Kalendarisch_Stromverbrauch_Zürich_Basel_19", "jpg");
    print("saving image");
  }
  return false;
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
}
