// Initialize constants and variables
const SIZE = 20;
const WIDTH = 800;
const HEIGHT = 600;
const MAX_X = WIDTH / SIZE;
const MAX_Y = HEIGHT / SIZE;
let FPS = 15;
let score = 0;
let highScore = 0;
let gameOver = false;
let intervalId;

// Set up the canvas
const canvasElement = document.getElementById('canvas')
canvasElement.width = WIDTH;
canvasElement.height = HEIGHT;
const canvas = canvasElement.getContext('2d');

// Create snake and apple objects
const snake = [{
  x: Math.floor(WIDTH / SIZE / 2),
  y: Math.floor(HEIGHT / SIZE / 2),
  dx: 0,
  dy: 0
}];
let head = snake[0];
const apple = { x: 0, y: 0 };

const getApplePosition = () => {
  apple.x = Math.floor(Math.random() * WIDTH / SIZE);
  apple.y = Math.floor(Math.random() * HEIGHT / SIZE);
  if (apple.x === head.x && apple.y === head.y) getApplePosition();
}

const drawCanvas = () => {
  // Draw background
  canvas.fillStyle = 'lightgreen';
  canvas.fillRect(0, 0, WIDTH, HEIGHT);

  // Draw snake
  let green = 100;
  snake.forEach(segment => {
    canvas.fillStyle = `rgb(0, ${green}, 0)`;
    canvas.fillRect(segment.x * SIZE, segment.y * SIZE, SIZE, SIZE);
    green = green === 100 ? 150 : 100;
  });

  // Draw apple
  canvas.fillStyle = 'darkred';
  canvas.fillRect(apple.x * SIZE, apple.y * SIZE, SIZE, SIZE);

  // Render GAME OVER text if necessary
  if (gameOver) renderGameOver();
}

const handleKeys = (event) => {
  switch (event.key) {
    case 'ArrowUp':
      head.dy = -1;
      head.dx = 0;
      break;
    case 'ArrowDown':
      head.dy = 1;
      head.dx = 0;
      break;
    case 'ArrowLeft':
      head.dx = -1;
      head.dy = 0;
      break;
    case 'ArrowRight':
      head.dx = 1;
      head.dy = 0;
      break;
  }
}

const moveSnake = () => {
  const newHead = { ...head, x: head.x, y: head.y };
  newHead.x += newHead.dx;
  newHead.y += newHead.dy;

  snake.splice(0, 0, newHead);
  snake.pop();
  head = snake[0];
}

const checkCollisions = () => {
  // Check if off the canvas
  if (head.x < 0 || head.x >= MAX_X || head.y < 0 || head.y >= MAX_Y) {
    endGame();
    return;
  }

  // Check if collided with self
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGame();
      return;
    }
  }

  // Check if collided with apple
  if (head.x === apple.x && head.y === apple.y) {
    score++;
    snake.push({ x: head.x, y: head.y });
    getApplePosition();
  }
}

const endGame = () => {
  clearInterval(intervalId);
  gameOver = true;
}

const renderGameOver = () => {
  canvas.fillStyle = 'black';
  canvas.font = '100px sans-serif';
  canvas.textAlign = 'center';
  canvas.textBaseline = 'middle';
  canvas.fillText('GAME OVER', WIDTH / 2, HEIGHT / 2);
}

const updateScore = () => {
  if (score > highScore) highScore = score;
  const spanScore = document.getElementById('score');
  const spanHighScore = document.getElementById('high-score');
  spanScore.textContent = `Score: ${score}`;
  spanHighScore.textContent = `High Score: ${highScore}`;
}

const setSpeed = (event) => {
  switch (event.target.value) {
    case 'slow':
      FPS = 10;
      break;
    case 'medium':
      FPS = 15;
      break;
    case 'fast':
      FPS = 20;
      break;
    case 'insane':
      FPS = 25;
  }
  clearInterval(intervalId);
  intervalId = setInterval(loopGame, (1000 / FPS));
}

const resetGame = () => {
  clearInterval(intervalId);
  score = 0;
  snake.splice(1);
  head.x = Math.floor(WIDTH / SIZE / 2);
  head.y = Math.floor(HEIGHT / SIZE / 2);
  head.dx = 0;
  head.dy = 0;
  gameOver = false;
  startGame();
}

const loopGame = () => {
  moveSnake();
  checkCollisions();
  drawCanvas();
  updateScore();
}

const startGame = () => {
  getApplePosition();
  window.addEventListener('keydown', handleKeys);
  const buttonRestart = document.getElementById('restart');
  const selectSpeed = document.getElementById('speed');
  buttonRestart.addEventListener('click', resetGame);
  selectSpeed.addEventListener('change', setSpeed);
  intervalId = setInterval(loopGame, (1000 / FPS));
}

startGame();