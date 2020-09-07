const rulesBtn = document.getElementById("rules-btn");
const rules = document.getElementById("rules");
const closeBtn = document.getElementById("close-btn");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

rulesBtn.addEventListener("click", () => rules.classList.add("show"));
closeBtn.addEventListener("click", () => rules.classList.remove("show"));

let score = 0;
const brickRows = 5;
const brickColumns = 9;
const bricks = [];

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 5,
  speed: 4,
  dx: 4,
  dy: -4,
};

const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};

const brick = {
  w: 70,
  h: 10,
  padding: 10,
  visible: true,
};

function drawBall() {
  ctx.beginPath();

  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);

  ctx.fillStyle = "#fff";
  ctx.fill();

  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();

  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);

  ctx.fillStyle = "#fff";
  ctx.fill();

  ctx.closePath();
}

function drawScore() {
  ctx.font = "20px Impact";
  ctx.fillStyle = "#fff";
  ctx.fillText(`Score: ${score}`, canvas.width - 90, 30);
}

// setup coordinates
let y = 40;
for (let i = 0; i < brickRows; i++) {
  bricks[i] = [];
  let x = -50;
  y += i + brick.padding + brick.h;
  for (let j = 0; j < brickColumns; j++) {
    x += j + brick.padding + brick.w;
    bricks[i][j] = { x, y, ...brick };
  }
}

function drawBricks() {
  // render
  bricks.forEach((row) => {
    row.forEach((column) => {
      ctx.beginPath();
      ctx.rect(column.x, column.y, brick.w, brick.h);
      ctx.fillStyle = column.visible ? "#fff" : "transparent";
      ctx.fill();

      ctx.closePath();
    });
  });
}

function movePaddle() {
  paddle.x += paddle.dx;

  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w - 5;
  }

  if (paddle.x < 0) {
    paddle.x = 5;
  }
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // wall collision
  if (ball.x + ball.size > canvas.width || ball.x + ball.size < 0) {
    ball.dx *= -1;
  }

  if (ball.y + ball.size > canvas.height || ball.y + ball.size < 0) {
    ball.dy *= -1;
  }
  // brick collision
  bricks.forEach((row) => {
    row.forEach((column) => {
      console.log(column);
      if (column.visible) {
        if (
          ball.x - ball.size > column.x &&
          ball.x + ball.size < column.x + column.w &&
          ball.y + ball.size > column.y &&
          ball.y - ball.size < column.y + column.h
        ) {
          ball.dy *= -1;
          increaseScore();
          column.visible = false;
        }
      }
    });
  });

  // paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy *= -1;
  }

  // bottom collision
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}

function increaseScore() {
  score++;
  if (score === brickRows * brickColumns) {
    score = 0;
    showAllBricks();
  }
}

function showAllBricks() {
  bricks.forEach((row) => {
    row.forEach((column) => (column.visible = true));
  });
}

function keyDown(e) {
  if (e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
  // if (e.key === "ArrowRight") {
  //   paddle.x += paddle.dx;
  // }
}

function keyUp(e) {
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    paddle.dx = 0;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

function update() {
  movePaddle();
  moveBall();

  // re-rendering
  draw();

  requestAnimationFrame(update);
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

update();
