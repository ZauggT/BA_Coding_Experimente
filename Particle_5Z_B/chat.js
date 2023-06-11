let speeds = [
  2, 3, 4, 6, 7, 2, 3, 9, 5, 3, 4, 6, 4, 3, 6, 7, 4, 9, 5, 3, 5, 4, 2, 3, 4, 5,
  6, 7, 4, 3, 4, 5, 6, 7, 5, 4, 6, 7, 5, 4, 4, 3,
]; // Array mit den Geschwindigkeiten für jeden Sektor
let particles = []; // Array für Partikel
let currentHour = 0; // Aktuelle Stunde
let interpolationValue = 0; // Interpolationswert für die Geschwindigkeit und den Zeitsprung
let interpolationSpeed = 0.02; // Geschwindigkeit der Interpolation

function setup() {
  createCanvas(800, 400);

  // Partikel initialisieren
  for (let i = 0; i < 500; i++) {
    let particle = {
      x: random(width), // Zufällige X-Position des Partikels
      y: random(height), // Zufällige Y-Position des Partikels
      speed: 0, // Geschwindigkeit des Partikels
      sector: 0, // Sektor, in dem sich das Partikel befindet
    };
    particles.push(particle);
  }

  // Timer für den Zeitsprung
  setInterval(updateHour, 2000);
}

function draw() {
  background(220);

  // Interpolation für Geschwindigkeit und Zeitsprung
  interpolationValue += interpolationSpeed;
  if (interpolationValue > 1) {
    interpolationValue = 0;
    currentHour++;
    if (currentHour >= speeds.length / 24) {
      currentHour = 0;
    }
  }

  // Partikel zeichnen und aktualisieren
  for (let i = 0; i < particles.length; i++) {
    let particle = particles[i];

    // Sektor berechnen
    let exactSectorPos = particle.y / (height / 24);
    particle.sector = Math.floor(exactSectorPos);

    // Geschwindigkeit interpolieren
    let prevHour = currentHour - 1;
    if (prevHour < 0) {
      prevHour = speeds.length / 24 - 1;
    }
    let prevSpeed = speeds[prevHour * 24 + particle.sector];
    let nextSpeed = speeds[currentHour * 24 + particle.sector];
    particle.speed = lerp(prevSpeed, nextSpeed, interpolationValue);

    // Partikelposition aktualisieren
    particle.x += particle.speed;

    // Partikel zeichnen
    ellipse(particle.x, particle.y, 10, 10);
  }
}

function updateHour() {
  interpolationValue += interpolationSpeed;
  if (interpolationValue > 1) {
    interpolationValue = 0;
    currentHour++;
    if (currentHour >= speeds.length / 24) {
      currentHour = 0;
    }
  }
}
