let testDataset;
let minutes;
let anzahlTage;
let middleX;
let middleY;
let werteArray = [];
let Farbskala;
let counter;

let valueColorScale = d3.scaleLinear();

function preload() {
  testDataset = loadTable("data.csv", "csv", "header");
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

  let numRows = testDataset.getRowCount(); //über 30'000
  let value = testDataset.getColumn("value");
  let time = testDataset.getColumn("time");

  counter = 0;
  //let y = 0;
  let x = 96; // Dienstag

  for (let k = 0; k < numRows; k++) {
    y = value[k] / 500; // Values noch mappen
    //console.log("y", y, "x", x);

    if (x % 672 == 0) {
      x = 0;
    }
    //noStroke();
    stroke(255, 255, 0, 20);
    //fill(255, 255, 0, 100);
    //ellipse(1.5 * x + 20, -y + 300, 2);
    line(x + 3, -value[k] / 500 + 300, x + 4, -value[k + 1] / 500 + 300);

    x += 1;
  }

  /*   stroke(255);
  strokeWeight(1);
  setLineDash([2, 2]);
  line(0, height / 2, width, height / 2);

  for (j = 0; j < 12; j++) {
    let xMonat = (width / 12) * j;
    line(xMonat, 0, xMonat, height);
  } */
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
