let speedsBasel = [2, 5, 8, 3]; // Beispielgeschwindigkeiten
let currentIndex = 0; // Aktueller Geschwindigkeitsindex
let currentSpeed = speedsBasel[currentIndex]; // Aktuelle Geschwindigkeit
let nextSpeed = speedsBasel[currentIndex + 1]; // Nächste Geschwindigkeit
let startTime = millis(); // Startzeit des Übergangs

function setup() {
  // P5.js Setup-Code
}

function draw() {
  // P5.js Draw-Code
  background(255);

  // Partikelsystem-Logik hier...

  // Überprüfe, ob die aktuelle Geschwindigkeit geändert werden soll
  let elapsedTime = millis() - startTime;
  if (elapsedTime >= 2000 && currentIndex < speedsBasel.length - 1) {
    currentIndex++;
    currentSpeed = speedsBasel[currentIndex];
    nextSpeed = speedsBasel[currentIndex + 1];
    startTime = millis();
  }

  // Interpoliere die Geschwindigkeit zwischen currentSpeed und nextSpeed
  let t = map(elapsedTime, 0, 2000, 0, 1); // Berechne den Interpolationsfaktor t
  let interpolatedSpeed = lerp(currentSpeed, nextSpeed, t);

  // Verwende interpolatedSpeed im Partikelsystem
}
