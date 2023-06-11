let grid = [];
let yPartikel = [];
let xPartikel = [];
let data;
let drag = 0.95;

function preload() {
  data = loadTable("data_z_19.csv", "csv", "header");
}

function setup() {
  createCanvas(365 * 5, 96 * 5);

  noStroke();
  let numRows = data.getRowCount();
  let valuesInData = int(data.getColumn("value"));
  let maxValue = max(valuesInData);
  let minValue = min(valuesInData);

  for (let i = 0; i < numRows; i++) {
    let value = valuesInData[i];
    let farbe = floor(map(value, minValue, maxValue, 10, 240));
    let anzahlTage = floor(i / 96);
    let anzahl15Min = i % 96;
    let x = anzahlTage * 5;
    let y = anzahl15Min * 5;
    let gridObject = {
      x: x,
      y: y,
      size: 5,
      value: value,
      farbe: farbe,
    };
    grid.push(gridObject);
  }

  for (let j = 0; j < 365; j++) {
    let x = j * 5;
    let ypartikel = {
      x: x,
      y: 0,
      xAcc: 0,
      yAcc: 0,
      partikelSize: 5,
    };
    yPartikel.push(ypartikel);
  }

  for (let j = 0; j < 96; j++) {
    let y = j * 5;
    let xpartikel = {
      x: 0,
      y: y,
      xAcc: 0,
      yAcc: 0,
      partikelSize: 5,
    };
    xPartikel.push(xpartikel);
  }
}
function draw() {
  let speed = 60;

  for (let i = 0; i < yPartikel.length; i++) {
    let yPunkt = yPartikel[i];
    if (yPunkt.x < 0) {
      yPunkt.x = width;
    }
    if (yPunkt.x > width) {
      yPunkt.x = 0;
    }
    if (yPunkt.y < 0) {
      yPunkt.y = height;
    }
    if (yPunkt.y > height) {
      yPunkt.y = 0;
    }

    let yIndex = floor(yPunkt.x / 5) * 96 + floor(yPunkt.y / 5);
    let yTile = grid[yIndex];

    yPunkt.xAcc += 0;
    yPunkt.yAcc += -1 / speed;

    ///// Physics Engine /////
    yPunkt.y = yPunkt.y += yPunkt.yAcc * -1;
    yPunkt.yAcc *= drag;
    yPunkt.x = yPunkt.x += yPunkt.xAcc;
    yPunkt.xAcc *= drag;

    fill(yTile.farbe);
    noStroke();
    rect(yPunkt.x, yPunkt.y, yPunkt.partikelSize);
  }

  for (let i = 0; i < xPartikel.length; i++) {
    let xPunkt = xPartikel[i];
    if (xPunkt.x < 0) {
      xPunkt.x = width;
    }
    if (xPunkt.x > width) {
      xPunkt.x = 0;
    }
    if (xPunkt.y < 0) {
      xPunkt.y = height;
    }
    if (xPunkt.y > height) {
      xPunkt.y = 0;
    }

    let xIndex = floor(xPunkt.x / 5) * 96 + floor(xPunkt.y / 5);
    let xTile = grid[xIndex];

    let koeff = 365 / 96;

    xPunkt.xAcc += koeff / speed;
    xPunkt.yAcc += 0;

    ///// Physics Engine /////
    xPunkt.y = xPunkt.y += xPunkt.yAcc * -1;
    xPunkt.yAcc *= drag;
    xPunkt.x = xPunkt.x += xPunkt.xAcc;
    xPunkt.xAcc *= drag;

    fill(xTile.farbe);
    noStroke();
    rect(xPunkt.x, xPunkt.y, xPunkt.partikelSize);
  }
  background(0, 0, 0, 10);
}
