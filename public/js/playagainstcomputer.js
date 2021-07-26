const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

var score = 0;
var otherscore = 0;
var down = false;
var up = false;
var otherdown = false;
var otherup = false;
const paddleX = canvas.width - 20;
var paddleY = canvas.height / 2 - 50;
const otherPaddleX = 0;
var otherPaddleY = canvas.height / 2 - 50;
const paddleHeight = 100;
const radius = 25;
var x = canvas.width / 2;
var y = canvas.height / 2;
var dx = 10;
var dy = Math.floor(Math.random() * 10);
if(Math.random() > 0.5){
  dy = -dy;
}

startGame();

document.addEventListener("keydown", e => {
	if(e.key == "ArrowDown"){
		down = true;
	}
	if(e.key == "ArrowUp"){
		up = true;
	}
});

document.addEventListener("keyup", e => {
  if(e.key == "ArrowDown"){
    down = false;
  }
  if(e.key == "ArrowUp"){
    up = false;
  }
});

function drawBg(){
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.beginPath();
  c.strokeStyle = "white";
  c.moveTo(400, 0);
  c.lineTo(400, 500);
  c.stroke();
}

function drawPaddle(x, y){
  c.beginPath();
  c.rect(x, y, 20, paddleHeight);
  c.fillStyle = "blue";
  c.fill();
}

function drawBall(x, y){
  c.beginPath();
  c.arc(x, y, 25, 0, 7);
  c.fillStyle = "white";
  c.fill();
}

function animate(){
  drawBg();
  if((y + radius) > paddleY && (x + radius) > paddleX && (y - radius) < (paddleY + 100)) {
		dx = Math.abs(dx) * -1;
    document.getElementById("pong_sound").play();
	}
  else if((y + radius) > otherPaddleY && (x - radius) < otherPaddleX + 20 && (y - radius) < (otherPaddleY + 100)) {
		dx = Math.abs(dx);
    document.getElementById("pong_sound").play();
	}
  else {
    if(x + radius > canvas.width){
      otherscore += 1;
      dx = -dx;
    }
    if(x - radius < 0){
      score += 1;
      dx = -dx;;
    }
    if(y < radius || y + radius > canvas.height){
      dy = -dy;
    }
  }
  x += dx;
  y += dy;
  number = Math.random();
  if(number < 0.05){
    if(y < otherPaddleY){
      otherup = true;
      otherdown = false;
    } else {
      otherup = false;
      otherdown = true;
    }
  }
	if(up && paddleY > 0) {
		paddleY -= 7;
	}
	else if(down && paddleY < 400) {
		paddleY += 7;
	}
	if(otherup && otherPaddleY > 0) {
		otherPaddleY -= 7;
	}
	else if(otherdown && otherPaddleY < 400) {
		otherPaddleY += 7;
	}
  document.getElementById("firstscore").innerHTML = score;
  document.getElementById("secondscore").innerHTML = otherscore;
  if(score == 10){
    alertmodal("Game Over!", `You beat the computer ${score} to ${otherscore}!`, ok="Play Again").then(() => location.reload());
    return;
  }
  if(otherscore == 10){
    alertmodal("Game Over!", `The computer beat you ${otherscore} to ${score}!`, ok="Play Again").then(() => location.reload());
    return;
  }
  drawPaddle(paddleX, paddleY);
  drawPaddle(otherPaddleX, otherPaddleY);
  drawBall(x, y);
  requestAnimationFrame(animate);
}

function startGame(){
  setTimeout(() => {
    animate();
  }, 1000);
}
