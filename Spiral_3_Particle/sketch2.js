let particles = [];
let dataStrom;
let maxStromB = 57731;
let minStromB = 22355;
let maxStromZ = 116593;
let minStromZ = 45505;

let test = 90;

function preload() {
  dataStrom = loadTable("dataStrom.csv", "csv", "header");
}

function setup() {
  createCanvas(400, 400);
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
  }
  for (let i = 0; i < 1; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(220);
  strokeWeight(2);
  noFill();
  translate(width / 2, height / 2);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].show();
  }

  for (let i = 0; i < 7; i++) {
    let angle = (i * 360) / 7 - 90;
    let x = cos(angle) * (width / 2);
    let y = sin(angle) * (height / 2);
    stroke("black");
    line(0, 0, x, y);
  }
}

class Particle {
  constructor() {
    this.pos = createVector(0, 0);
    this.winkel = test;
    this.sector = floor(map(this.winkel, 0, 360, 0, 6));

    //this.speed = map(this.sector, 0, 6, 1, 10);
    this.speed = 1;
    this.vel = p5.Vector.fromAngle(this.winkel, this.speed);
    this.acc = createVector(0, 0);
    this.lifespan = 255;
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.lifespan -= 2;

    if (
      this.pos.x < -width / 2 ||
      this.pos.x > width / 2 ||
      this.pos.y < -height / 2 ||
      this.pos.y > height / 2
    ) {
      this.pos = createVector(0, 0);
      this.winkel = test;
      this.sector = floor(map(this.winkel, 0, 360, 0, 7));
      //this.speed = map(this.sector, 0, 6, 1, 10);
      this.speed = 1;
      this.vel = p5.Vector.fromAngle(this.winkel, this.speed);
      this.acc = createVector(0, 0);
      this.lifespan = 255;
    }
    console.log(this.sector);
  }

  show() {
    noStroke();
    fill(255);
    ellipse(this.pos.x, this.pos.y, 10, 10);
  }
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
