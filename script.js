let x0 = 0;
let v0 = 10;
let a = 0;
let time = 0;
let isRunning = false;

let carPosition = 0;
let carVelocity = 0;

let startTime;
let dataPoints = [];

let simulationCanvas;
let graphCanvas;

let positionChart;
let velocityChart;

function setup() {
  // Cria o canvas para a simulação
  simulationCanvas = createCanvas(600, 200);
  simulationCanvas.parent('simulation');
  
  // Cria o canvas para os gráficos
  graphCanvas = createCanvas(600, 200);
  graphCanvas.parent('graphs');
  
  resetSimulation();
  updateEquation();
  
  // Inicializa os gráficos
  initCharts();
}

function draw() {
  if (isRunning) {
    time = (millis() - startTime) / 1000;
    carPosition = x0 + v0 * time + 0.5 * a * time * time;
    carVelocity = v0 + a * time;
    
    // Atualiza valores na tela
    document.getElementById('currentTime').innerText = `Tempo: ${time.toFixed(2)} s`;
    document.getElementById('currentPosition').innerText = `Posição: ${carPosition.toFixed(2)} m`;
    document.getElementById('currentVelocity').innerText = `Velocidade: ${carVelocity.toFixed(2)} m/s`;
    
    // Adiciona pontos aos gráficos
    dataPoints.push({ t: time, x: carPosition, v: carVelocity });
    
    updateCharts();
    
    // Se o carro sair da pista, parar a simulação
    if (carPosition * (simulationCanvas.width / 1000) > simulationCanvas.width || carPosition < 0) {
      isRunning = false;
    }
  }
  
  // Desenha a simulação
  drawSimulation();
}

function drawSimulation() {
  // Desenha no canvas da simulação
  simulationCanvas.background(243, 244, 246);
  
  // Desenhar pista
  simulationCanvas.stroke(102);
  simulationCanvas.strokeWeight(4);
  simulationCanvas.line(0, simulationCanvas.height - 50, simulationCanvas.width, simulationCanvas.height - 50);
  
  // Desenhar carro
  simulationCanvas.fill(239, 68, 68);
  simulationCanvas.noStroke();
  let carX = carPosition * (simulationCanvas.width / 1000);
  simulationCanvas.ellipse(carX, simulationCanvas.height - 70, 30, 30);
}

function initCharts() {
  // Configurações comuns para os gráficos
  let chartOptions = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: { display: true, text: 'Tempo (s)' }
      },
      y: {
        title: { display: true, text: '' }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };
  
  // Gráfico de posição
  let positionCtx = graphCanvas.drawingContext.canvas.getContext('2d');
  positionChart = new Chart(positionCtx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Posição',
        data: [],
        borderColor: 'blue',
        fill: false
      }]
    },
    options: {
      ...chartOptions,
      scales: {
        ...chartOptions.scales,
        y: { ...chartOptions.scales.y, title: { display: true, text: 'Posição (m)' } }
      }
    }
  });
  
  // Gráfico de velocidade
  let velocityCtx = graphCanvas.drawingContext.canvas.getContext('2d');
  velocityChart = new Chart(velocityCtx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Velocidade',
        data: [],
        borderColor: 'green',
        fill: false
      }]
    },
    options: {
      ...chartOptions,
      scales: {
        ...chartOptions.scales,
        y: { ...chartOptions.scales.y, title: { display: true, text: 'Velocidade (m/s)' } }
      }
    }
  });
}

function updateCharts() {
  // Atualiza dados do gráfico de posição
  positionChart.data.datasets[0].data = dataPoints.map(dp => ({ x: dp.t, y: dp.x }));
  positionChart.update('none');
  
  // Atualiza dados do gráfico de velocidade
  velocityChart.data.datasets[0].data = dataPoints.map(dp => ({ x: dp.t, y: dp.v }));
  velocityChart.update('none');
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
    dataPoints = [];
  }
});

document.getElementById('resetButton').addEventListener('click', resetSimulation);

function resetSimulation() {
  isRunning = false;
  time = 0;
  carPosition = x0;
  carVelocity = v0;
  dataPoints = [];
  
  document.getElementById('currentTime').innerText = `Tempo: ${time.toFixed(2)} s`;
  document.getElementById('currentPosition').innerText = `Posição: ${carPosition.toFixed(2)} m`;
  document.getElementById('currentVelocity').innerText = `Velocidade: ${carVelocity.toFixed(2)} m/s`;
  
  // Reinicia os gráficos
  if (positionChart && velocityChart) {
    positionChart.data.datasets[0].data = [];
    positionChart.update('none');
    
    velocityChart.data.datasets[0].data = [];
    velocityChart.update('none');
  }
}

function updateEquation() {
  let equation = `X = ${x0} + ${v0}t`;
  if (a !== 0) {
    equation += ` + ½(${a})t²`;
  }
  document.getElementById('motionEquation').innerText = equation;
}
