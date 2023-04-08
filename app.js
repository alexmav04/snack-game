const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");

const unit = 20;
const row = canvas.height / unit;
const col = canvas.width / unit;

let snake = [];
function creatSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };

  snake[1] = {
    x: 60,
    y: 0,
  };

  snake[2] = {
    x: 40,
    y: 0,
  };

  snake[3] = {
    x: 20,
    y: 0,
  };
}

class Food {
  constructor() {
    this.x = Math.floor(Math.random() * col) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFood() {
    ctx.fillStyle = "rgb(238, 44, 44)";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickLocation() {
    let isOverlapping = false;
    let new_x;
    let new_y;

    function checkOverlapping(x, y) {
      for (let i = 0; i < snake.length; i++) {
        if (x == snake[i].x && y == snake[i].y) {
          isOverlapping = true;
          return;
        } else {
          isOverlapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * col) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlapping(new_x, new_y);
    } while (isOverlapping);

    this.x = new_x;
    this.y = new_y;
  }
}

//initial setting
creatSnake();
let snakeFood = new Food();
window.addEventListener("keydown", changeDirection);
let direction = "Right"; //snake's initial direction
let score = 0;
let topScore;
loadTopScore();
document.getElementById("score1").innerHTML = "Score: " + score;
document.getElementById("score2").innerHTML = "Top Score: " + topScore;

function changeDirection(e) {
  if (e.key == "ArrowRight" && direction != "Left") {
    direction = "Right";
  } else if (e.key == "ArrowDown" && direction != "Up") {
    direction = "Down";
  } else if (e.key == "ArrowUp" && direction != "Down") {
    direction = "Up";
  } else if (e.key == "ArrowLeft" && direction != "Right") {
    direction = "Left";
  }
  //prevent multiple click
  window.removeEventListener("keydown", changeDirection);
}

function drawAll() {
  // check if the snake bites itself
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(snakeGame);
      alert("Game over!");
      return;
    }
  }

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  snakeFood.drawFood();

  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "rgb(193, 255, 193)";
    } else {
      ctx.fillStyle = "lightblue";
    }
    ctx.strokeStyle = "white";

    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    } else if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    } else if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    } else if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction == "Right") {
    snakeX += unit;
  } else if (direction == "Down") {
    snakeY += unit;
  } else if (direction == "Left") {
    snakeX -= unit;
  } else if (direction == "Up") {
    snakeY -= unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // check if the snake eat the food
  if (snake[0].x == snakeFood.x && snake[0].y == snakeFood.y) {
    snakeFood.pickLocation();
    score++;
    setTopScore(score);
    document.getElementById("score1").innerHTML = "Score: " + score;
    document.getElementById("score2").innerHTML = "Top Score: " + topScore;
  } else {
    snake.pop();
  }
  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

let snakeGame = setInterval(drawAll, 100);

function loadTopScore() {
  if (localStorage.getItem("topScore") == null) {
    topScore = 0;
  } else {
    topScore = Number(localStorage.getItem("topScore"));
  }
}

function setTopScore(score) {
  if (score > topScore) {
    localStorage.setItem("topScore", score);
    topScore = score;
  }
}
