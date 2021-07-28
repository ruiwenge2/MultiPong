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
var dx = -10;
var dy = 5;
var leave;

startGame();
socket.emit("joined", room, user);
alertmodal("Joined!", `${otheruser} is already in the game! Start playing!`)

socket.on("leave", username => {
  alertmodal("Left", `${username} has left the game!`).then(() => location.href = "/join");
  leave = true;
});

document.addEventListener("keydown", e => {
	if(e.key == "ArrowDown"){
		down = true;
    socket.emit("movedown", room);
	}
	if(e.key == "ArrowUp"){
		up = true;
    socket.emit("moveup", room);
	}
});

document.addEventListener("keyup", e => {
  if(e.key == "ArrowDown"){
    down = false;
    socket.emit("endmovedown", room);
  }
  if(e.key == "ArrowUp"){
    up = false;
    socket.emit("endmoveup", room);
  }
});

socket.on("movedown", () => {
  otherdown = true;
});
socket.on("moveup", () => {
  otherup = true;
});
socket.on("endmovedown", () => {
  otherdown = false;
});
socket.on("endmoveup", () => {
  otherup = false;
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
  if(leave) return;
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
      dx = -dx;
    }
    if(y < radius || y + radius > canvas.height){
      dy = -dy;
    }
  }
  x += dx;
  y += dy;
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
  document.getElementById("firstscore").innerHTML = otherscore;
  document.getElementById("secondscore").innerHTML = score;
  if(score == 10){
    alertmodal("Game Over!", `You beat ${otheruser} ${score} to ${otherscore}!`).then(() => location.href = "/join");
    return;
  }
  if(otherscore == 10){
    alertmodal("Game Over!", `${otheruser} beat you ${otherscore} to ${score}!`).then(() => location.href = "/join");
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
  }, 1000)
}
