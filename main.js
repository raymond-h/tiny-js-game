var canvas;
var ctx;

var gameScreen;
var player = { x: 0, y: 0 };
var enemies = [];

var keys = {};

var counter = 0;
var score = 0;
var highscore = 0;

function main() {
	init();
	
	var tick = function() {
		logic();
		render();
		
		setTimeout(tick, 1000/60);
	}
	
	var spawnNewEnemy = function() {
		addEnemy();
	
		setTimeout(spawnNewEnemy, 1000 * 3 - enemies.length * 50);
	}
	
	tick();
	setTimeout(spawnNewEnemy, 1000 * 3);
}

function init() {
	canvas = document.getElementById('main');
	ctx = canvas.getContext('2d');
	
	$(document).keydown(keyhandler);
	$(document).keyup(keyhandler);
	
	gameScreen = { w: canvas.width, h: canvas.height };
	startGame();
}

function startGame() {
	counter = 0;
	score = 0;
	player.x = gameScreen.w / 2;
	player.y = gameScreen.h / 2;
	
	enemies = [];
	for(var i = 0; i < 3; i++) {
		addEnemy();
	}
}

function addEnemy() {
	function randomPos() {
		return {
			x: Math.random()*gameScreen.w,
			y: Math.random()*gameScreen.h
		};
	}
	
	var size = Math.floor(3 + enemies.length / 2);
	
	var e;
	do {
		e = randomPos();
		e.size = size;
	}
	while((Math.abs(e.x - player.x) < 50) || (Math.abs(e.y - player.y) < 50));
	
	enemies.push(e);
}

function keyhandler(event) {
	if(event.repeat) return;

	switch(event.which) {
		case 37: input('left', event.type === 'keydown'); break;
		case 38: input('up', event.type === 'keydown'); break;
		case 39: input('right', event.type === 'keydown'); break;
		case 40: input('down', event.type === 'keydown'); break;
	}
}

function input(key, pressed) {
	if(pressed && keys[key]) return;
	keys[key] = pressed;

	// console.log(key, pressed);
}

function logic() {
	counter++;
	score = Math.floor(counter / 60);
	highscore = Math.max(highscore, score);

	if(keys.left) player.x -= 5;
	if(keys.right) player.x += 5;
	if(keys.up) player.y -= 5;
	if(keys.down) player.y += 5;
	
	player.x = Math.max(0, Math.min(player.x, gameScreen.w));
	player.y = Math.max(0, Math.min(player.y, gameScreen.h));
	
	enemyLogic();
	hitEnemy();
}

function enemyLogic() {
	for(var i = 0; i < enemies.length; i++) {
		e = enemies[i];
		
		dir = Math.atan2(player.y - e.y, player.x - e.x);
		e.x += Math.cos(dir) * 2;
		e.y += Math.sin(dir) * 2;
	}
}

function hitEnemy() {
	for(var i = 0; i < enemies.length; i++) {
		e = enemies[i];
		
		if(Math.abs(player.x - e.x) < e.size && Math.abs(player.y - e.y) < e.size) {
			startGame();
			break;
		}
	}
}

function render() {
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, gameScreen.w, gameScreen.h);
	
	updateScore();
	renderPlayer();
	renderEnemies();
}

function updateScore() {
	$('#score').text('' + score);
	$('#highscore').text('' + highscore);
}

function renderPlayer() {
	ctx.save();
	ctx.translate(player.x, player.y);
	
	ctx.fillStyle = 'red';
	ctx.fillRect(-3, -3, 6, 6);	
	
	ctx.restore();
}

function renderEnemies() {
	for(var i = 0; i < enemies.length; i++) {
		e = enemies[i];
		ctx.save();
		ctx.translate(e.x, e.y);
	
		ctx.fillStyle = 'green';
		ctx.fillRect(-e.size, -e.size, e.size*2, e.size*2);	
	
		ctx.restore();
	}
}