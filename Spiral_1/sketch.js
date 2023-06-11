let data;
let anzahlTage;
let middleX;
let middleY;

let valueColorScale = d3.scaleLinear();

function preload() {
  data = loadTable("data.csv", "csv", "header");
}

function setup() {
  angleMode(DEGREES);
  console.log(data);
  // Wie kann ich die Time (2019-01-02T00:00) mappen?
}

function draw() {
  noLoop();
  createCanvas(500, 500);
  background(0);

  //Skala
  noFill();
  stroke(90);
  middleX = width / 2;
  middleY = height / 2;
  ellipse(middleX, middleY, 400); // Das ist die Skala, welche gemappt werden muss
  ellipse(middleX, middleY, 200);

  let numRows = data.getRowCount();
  //console.log(numRows);
  let value = data.getColumn("value");
  //console.log(min(value), max(value));
  anzahlTage = numRows / 96;
  console.log("anzahl Tage", anzahlTage);
  //console.log(value);
  for (let i = 0; i < numRows; i++) {
    let spacing = -360 / (numRows / anzahlTage);
    //console.log(spacing);
    let angle = spacing * i + 180;
    //console.log(angle);

    //console.log(middleX, middleY);

    let x = 10;
    let y = 50 + i * 5;
    //let w = map(value[i], 0, max(value), 0, 150);
    let w = value[i] / 500;
    //console.log(w);
    let h = 5;

    let dy = w * cos(angle);
    let dx = w * sin(angle);

    //console.log(dx, dy);

    stroke(70);
    strokeWeight(0.1);
    //line(middleX, middleY, middleX + dx, middleY + dy);

    fill(255, 240, 31, 5);
    stroke(255, 240, 31, 5);
    ellipse(middleX + dx, middleY + dy, 5);

    //rect(x, y, w, h);

    //textSize(5);
    //text(i, x, y);
    //text(i, middleX + dx, middleY + dy);
  }
}
