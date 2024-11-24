const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 320;
canvas.height = 480;

let bird, pipes, score, gameOver, gravity, coins;
const pipeImage = new Image();
const backgroundImage = new Image();

pipeImage.src = "images/pipe.png";
backgroundImage.src = "images/bg.jpg";

class Bird {
  constructor() {
    this.x = 50;
    this.y = canvas.height / 2;
    this.width = 25;
    this.height = 20;
    this.speed = 0;
    this.lift = -4;
  }

  update() {
    this.speed += gravity;
    this.y += this.speed;

    if (this.y + this.height > canvas.height) {
      this.y = canvas.height - this.height;
      this.speed = 0;
    } else if (this.y < 0) {
      this.y = 0;
      this.speed = 0;
    }
  }

  jump() {
    this.speed = this.lift;
  }

  draw() {
    ctx.fillStyle = "#FF0";
    ctx.beginPath();
    ctx.ellipse(this.x + 12, this.y + 10, 12, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#FF0";
    ctx.beginPath();
    ctx.arc(this.x + 12, this.y - 6, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(this.x + 14, this.y - 6, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#F00";
    ctx.beginPath();
    ctx.moveTo(this.x + 18, this.y - 6);
    ctx.lineTo(this.x + 22, this.y - 2);
    ctx.lineTo(this.x + 18, this.y);
    ctx.fill();
  }
}

class Pipe {
  constructor() {
    this.width = 100;
    this.gap = 100;
    this.top = Math.random() * (canvas.height / 2);
    this.bottom = canvas.height - (this.top + this.gap);
    this.x = canvas.width;
    this.speed = 2;
  }

  update() {
    this.x -= this.speed;
  }

  draw() {
    ctx.drawImage(pipeImage, this.x, 0, this.width, this.top);
    ctx.drawImage(pipeImage, this.x, canvas.height - this.bottom, this.width, this.bottom);
  }

  offscreen() {
    return this.x + this.width < 0;
  }

  collision(bird) {
    if (bird.x + bird.width > this.x && bird.x < this.x + this.width) {
      if (bird.y < this.top || bird.y + bird.height > canvas.height - this.bottom) {
        return true;
      }
    }
    return false;
  }
}

// Fungsi untuk memulai permainan
function init() {
  bird = new Bird();
  pipes = [];
  score = 0;
  coins = 0;  // Inisialisasi koin
  gameOver = false;
  gravity = 0.2;
  document.getElementById("gameOver").style.display = "none";

  gameLoop();
}

// Fungsi game loop
function gameLoop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  bird.update();
  bird.draw();

  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    pipes.push(new Pipe());
  }

  pipes.forEach((pipe, index) => {
    pipe.update();
    pipe.draw();

    if (pipe.offscreen()) {
      pipes.splice(index, 1);
      score++;
      coins += 10; // Setiap skor bertambah, koin bertambah 10
      document.getElementById("coinCount").textContent = coins; // Update tampilan koin
    }

    if (pipe.collision(bird)) {
      gameOver = true;
      document.getElementById("final-score").textContent = score;
      document.getElementById("gameOver").style.display = "block";
    }
  });

  ctx.fillStyle = "#fff";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  requestAnimationFrame(gameLoop);
}

// Mengatur event listener untuk tombol loncat
document.addEventListener("keydown", function (event) {
  if (event.key === " " || event.key === "ArrowUp") {
    bird.jump();
  }
});

canvas.addEventListener("click", function () {
  if (!gameOver) {
    bird.jump();
  }
});

document.getElementById("backHomeBtn").addEventListener("click", function () {
  document.getElementById("home").style.display = "block";
  document.getElementById("gameCanvasContainer").style.display = "none";
  document.getElementById("gameOver").style.display = "none";
  bird.y = canvas.height / 2;
  pipes = [];
  score = 0;
  coins = 0;  // Reset koin saat kembali ke home
  gameOver = false;
});

document.getElementById("restart-btn").addEventListener("click", function () {
  bird.y = canvas.height / 2;
  pipes = [];
  score = 0;
  coins = 0; // Reset koin saat restart
  gameOver = false;
  document.getElementById("gameOver").style.display = "none";
  gameLoop();
});

document.getElementById("playBtn").addEventListener("click", function () {
  document.getElementById("home").style.display = "none";
  document.getElementById("gameCanvasContainer").style.display = "block";
  init();
});

