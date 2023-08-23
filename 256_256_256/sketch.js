let currentColor;
let nextColorTime;
let canvasContainer;
let saveButton;
let usedColors = [];
let colorRange = 255;
let timeAPI = "https://worldtimeapi.org/api/timezone/Europe/Rome"; // Cambia l'API

function setup() {
  canvasContainer = select('#canvasContainer');
  createCanvas(400, 400).parent(canvasContainer);
  updateNextColorTime(); // Imposta il prossimo momento per cambiare colore

  // Crea un riferimento al bottone e assegna un'azione al click
  saveButton = select('#saveButton');
  saveButton.mousePressed(saveImage);
}

function draw() {
  if (currentColor) {
    background(currentColor);
    displayColorInfo(currentColor);
  }
}

function changeColor() {
  let newColor;
  do {
    const red = round(random(colorRange));
    const green = round(random(colorRange));
    const blue = round(random(colorRange));
    newColor = color(red, green, blue);
  } while (colorUsed(newColor));

  currentColor = newColor;
  usedColors.push(newColor);
  if (usedColors.length > 10) {
    usedColors.shift();
  }

  updateNextColorTime(); // Imposta il prossimo momento per cambiare colore
}

function colorUsed(newColor) {
  for (let i = 0; i < usedColors.length; i++) {
    if (colorEquals(newColor, usedColors[i])) {
      return true;
    }
  }
  return false;
}

function colorEquals(col1, col2) {
  return red(col1) === red(col2) && green(col1) === green(col2) && blue(col1) === blue(col2);
}

function updateNextColorTime() {
  // Utilizza l'API per ottenere l'orario attuale
  loadJSON(timeAPI, gotTime);
}

function gotTime(data) {
  const now = new Date(data.utc_datetime);
  nextColorTime = now.getTime() + 1000; // Aggiungi un secondo
}

function displayColorInfo(col) {
  const redValue = red(col);
  const greenValue = green(col);
  const blueValue = blue(col);

  fill(255);
  textSize(20); // Aumenta la dimensione del testo a 20

  stroke(0);
  strokeWeight(0);

  text(`R: ${redValue}`, 20, height - 60);
  text(`G: ${greenValue}`, 20, height - 40);
  text(`B: ${blueValue}`, 20, height - 20);

  noStroke();
}

// Cambia il colore ogni x millisecondi
setInterval(changeColor, 60000);

// Funzione per salvare l'immagine
function saveImage() {
  saveCanvas('colored_canvas', 'png');
}
