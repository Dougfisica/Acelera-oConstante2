let x0 = 0;
let v0 = 10;
let a = 0;
let time = 0;
let isRunning = false;

let carPosition = 0;
let carVelocity = 0;

let startTime;

function setup() {
  let canvas = createCanvas(600, 200);
  canvas.parent('simulation');
  resetSimulation();
  updateEquation();
}

function draw() {
  background(243, 244, 246);
  
  // Desenhar pista
  stroke(102);
  strokeWeight(4);
  line(0, height - 50, width, height - 50);
  
  // Desenhar carro
  fill(239, 68, 68);
  noStroke();
  ellipse(carPosition * (width / 1000), height - 70, 30, 30);
  
  if (isRunning) {
    time = (millis() - startTime) / 1000;
    carPosition = x0 + v0 * time + 0.5 * a * time * time;
    carVelocity = v0 + a * time;
    
    // Atualizar valores na tela
    document.getElementById('currentTime').innerText = `Tempo: ${time.toFixed(2)} s`;
    document.getElementById('currentPosition').innerText = `Posição: ${carPosition.toFixed(2)} m`;
    document.getElementById('currentVelocity').innerText = `Velocidade: ${carVelocity.toFixed(2)} m/s`;
    
    // Se o carro sair da pista, parar a simulação
    if (carPosition * (width / 1000) > width || carPosition < 0) {
      isRunning = false;
    }
  }
}

document.getElementById('x0').addEventListener('input', (e) => {
  x0 = parseFloat(e.target.value);
  document.getElementById('x0Value').innerText = `${x0} m`;
  updateEquation();
  resetSimulation();
});

document.getElementById('v0').addEventListener('input', (e) => {
  v0 = parseFloat(e.target.value);
  document.getElementById('v0Value').innerText = `${v0} m/s`;
  updateEquation();
  resetSimulation();
});

document.getElementById('a').addEventListener('input', (e) => {
  a = parseFloat(e.target.value);
  document.getElementById('aValue').innerText = `${a} m/s²`;
  updateEquation();
  resetSimulation();
});

document.getElementById('startButton').addEventListener('click', () => {
  if (!isRunning) {
    isRunning = true;
    startTime = millis();
  }
});

document.getElementById('resetButton').addEventListener('click', resetSimulation);

function resetSimulation() {
  isRunning = false;
  time = 0;
  carPosition = x0;
  carVelocity = v0;
  
  document.getElementById('currentTime').innerText = `Tempo: ${time.toFixed(2)} s`;
  document.getElementById('currentPosition').innerText = `Posição: ${carPosition.toFixed(2)} m`;
  document.getElementById('currentVelocity').innerText = `Velocidade: ${carVelocity.toFixed(2)} m/s`;
}

function updateEquation() {
  let equation = `X = ${x0} + ${v0}t`;
  if (a !== 0) {
    equation += ` + ½(${a})t²`;
  }
  document.getElementById('motionEquation').innerText = equation;
}
