let data;
let minutes;
let anzahlTage;
let middleX;
let middleY;
let werteArray = [];
let Farbskala;
let counter;

let valueColorScale = d3.scaleLinear();

function preload() {
  data = loadTable("data.csv", "csv", "header");
  minutes = loadTable("minutes.csv", "csv", "header");
}

function setup() {
  angleMode(DEGREES);
  console.log(minutes);
  // Wie kann ich die Time (2019-01-02T00:00) mappen?
}

function draw() {
  noLoop();
  createCanvas(672 + 6, 96 * 2.5);
  background(10);

  let numRowsMinutes = minutes.getRowCount();
  let minute = minutes.getColumn("minutes");

  let numRows = data.getRowCount(); //über 30'000
  let value = data.getColumn("value");
  let time = data.getColumn("time");

  for (let i = 0; i < numRows; i++) {
    let values = value[i];
  }

  counter = 0;
  let x = 96; // Dienstag

  for (let k = 0; k < numRows; k++) {
    y = value[k] / 500; // Values noch mappen
    if (x % 672 == 0) {
      x = 0;
    }
    stroke(255, 255, 0, 20);
    line(x + 3, -value[k] / 500 + 300, x + 4, -value[k + 1] / 500 + 300);
    x += 1;
  }
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
