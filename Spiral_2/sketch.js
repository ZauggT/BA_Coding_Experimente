let data;
let minutes;
let anzahlTage;
let middleX;
let middleY;

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
  createCanvas(900, 900);
  background(5);

  //Skala (noch nicht gemappt!!)
  noFill();
  stroke(90, 150);
  middleX = width / 2;
  middleY = height / 2;
  strokeWeight(1);
  setLineDash([2, 2]);
  ellipse(middleX, middleY, 400); 
  ellipse(middleX, middleY, 200);
  ellipse(middleX, middleY, 600);
  ellipse(middleX, middleY, 800);

  // Minutes Table
  let numRowsMinutes = minutes.getRowCount();
  let minute = minutes.getColumn("minutes");
  console.log(minute);

  for (let k = 0; k < numRowsMinutes; k++) {
    let spacingSkala = -360 / numRowsMinutes;
    // console.log(spacingSkala);
    let angleSkala = spacingSkala * k + 180;
    console.log(angleSkala);

    let l = 395;
    let dxSkala1 = l * sin(angleSkala);
    let dySkala1 = l * cos(angleSkala);

    let s = 405;
    let dxSkala = s * sin(angleSkala);
    let dySkala = s * cos(angleSkala);

    let z = 420;
    let dxSkala2 = z * sin(angleSkala);
    let dySkala2 = z * cos(angleSkala);

    strokeWeight(1);
    setLineDash([0, 0]);
    line(
      middleX + dxSkala1,
      middleY + dySkala1,
      middleX + dxSkala,
      middleY + dySkala
    );
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(8);
    text(minute[k], middleX + dxSkala2, middleY + dySkala2);
  }

  // Value Table
  let numRows = data.getRowCount();
  let value = data.getColumn("value");
  let time = data.getColumn("time");

  anzahlTage = numRows / 96;
  console.log("anzahl Tage", anzahlTage);

  for (let i = 0; i < numRows; i++) {
    let spacing = -360 / (numRows / anzahlTage);
    let angle = spacing * i + 180;
    let w = value[i] / 300;
    let dx = w * sin(angle);
    let dy = w * cos(angle);

    //let x = 10;
    //let y = 50 + i * 5;
    //let w = map(value[i], 0, max(value), 0, 150);

    stroke(70);
    strokeWeight(0.1);
    fill(255, 240, 31, 3);
    stroke(255, 240, 31, 5);
    ellipse(middleX + dx, middleY + dy, 12);

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
    saveCanvas("Radial_Stromverbrauch_Zürich", "jpg");
    print("saving image");
  }
  return false;
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
}
