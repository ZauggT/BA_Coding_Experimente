let data;
let anzahlTage;
let middleX;
let middleY;
let valueColorScale = d3.scaleLinear();
let numRows;

function preload() {
  data = loadTable("data.csv", "csv", "header");
}

function setup() {
  // TODO: punkte hier erstellen und in Array pushen
  // in draw nur zeichnen
  angleMode(DEGREES);
  //console.log(data);
  createCanvas(700, 700, WEBGL);
  numRows = data.getRowCount();

  slider = createSlider(0, numRows, 0);
  slider.position(10, 10);
  slider.style("width", "600px");

  valueColorScale
    .domain([50000, 70000, 90000, 110000])
    .range(["#21d1a1", "#348bf8", "#9160ff", "#c83d7e"]);
}

function draw() {
  let val = slider.value();
  // noLoop();
  // Wie kann ich die Time (2019-01-02T00:00) mappen?
  orbitControl();
  rotateX(0.5);
  rotateY(0.5);
  rotateZ(0.5);
  background(0);

  let value = data.getColumn("value");
  anzahlTage = numRows / 96;
  let einTag = 96;

  let counter = 0;
  let z = 0;

  for (let i = 0; i < val; i++) {
    let spacing = -360 / (numRows / anzahlTage);
    let angle = spacing * i + 180;
    let w = value[i] / 800;
    let dy = w * cos(angle);
    let dx = w * sin(angle);

    counter++;
    if (counter >= 96) {
      counter = 0;
    }

    let valueforCol = valueColorScale(value[i]);
    let valueCol = color(valueforCol);

    if (i % 96 == 0) {
      z -= 10;
    }

    noStroke();
    fill(valueCol, 20);
    //fill(255 - 2 * counter, 200 - counter, 0 + counter, 20);

    push();
    translate(dx, dy, z);
    sphere(3, 6, 6);
    pop();
  }

  strokeWeight(2);
  stroke("red");
  line(0, 0, -300, 0, 0, 300);
  stroke("blue");
  line(0, -300, 0, 0, 300, 0);
  stroke("green");
  line(-300, 0, 0, 300, 0, 0);
}

function keyTyped() {
  if (key === "s" || key === "S") {
    saveCanvas("Radial_3D_Stromverbrauch_Zürich", "jpg");
    print("saving image");
  }
  return false;
}
