"use strict";

var Splat = require("splatjs");
var canvas = document.getElementById("canvas");
var gameMaker = require("./gamemaker.js");
var game = gameMaker.game;


function createEntity(x, y, width, height, color){
	var entity = new Splat.Entity(x,y,width,height);
	entity.color = color;
	entity.draw = function(context){
		context.fillStyle = this.color;
		context.fillRect(this.x|0, this.y|0, this.width, this.height);
	};
	return entity;
}

function createPlayer(x, y, width, height){
	var entity = new Splat.Entity(x,y,width,height);
	entity.sprite = game.images.get("eliya_placeholder");
	entity.draw = function(context){
		//fix the dragging images by math.floor
		context.drawImage(entity.sprite, Math.floor(this.x), this.y);
	};
	return entity;
}

//particle code
	var particles = new Splat.Particles(10000, 
	function(particle, config) {
		var img = "gradient";
		switch (config){
		case "lazer":
			img = "gradient";
			break;
		case "circle":
			img = "circle";
			break;
		}

		particle.image = img;
}, function(context, particle) {
	var img = game.images.get(particle.image);
	context.drawImage(img, particle.x - Math.floor(img.width / 2), particle.y - Math.floor(img.height / 2));
});

	console.log(particles);


game.scenes.add("title", new Splat.Scene(canvas, function() {
	// initialization
	var scene = this;

	scene.player = createEntity(100,100,50,50,"orange");
	scene.camera = new Splat.Camera(0,0,384, 224);
	scene.camera.vx = 0.1;
	scene.player.vx = 0.1;


	// initialization
	particles.reset();
	particles.gravity = 0;
	particles.maxAge = 1000;

	scene.bullets = [];
	scene.seatile = game.images.get("sea-tile");
	var cloud = game.animations.get("cloud");
	var hydra = game.animations.get("hydra");
	var fireball = game.animations.get("fireball");

	var hydraStream = function(){
		var bullet = new Splat.Entity(this.x, this.y, 1, 1);
		bullet.targetx = scene.player.x + scene.player.width/2;
		bullet.targety = scene.player.y + scene.player.height/2;
		bullet.speed = 1;
		bullet.distance =  Math.sqrt( Math.pow((bullet.targetx - bullet.x), 2) + Math.pow((bullet.targety - bullet.y),2));
		bullet.speedx = Math.abs(bullet.targetx - bullet.x)/bullet.distance * bullet.speed;
		bullet.speedy = Math.abs(bullet.targety - bullet.y)/bullet.distance * bullet.speed;
		if (bullet.targetx - bullet.x < 0){
			bullet.speedx *= -1;
		}
		if (bullet.targety - bullet.y < 0){
			bullet.speedy *= -1;
		}
		//go function added since animated entities use move.
		bullet.go = function(){
			this.x += this.speedx;
			this.y += this.speedy;
		};
		scene.bullets.push(bullet);
	};

	var hydraFire = function(){
		var bullet = new Splat.AnimatedEntity(this.x, this.y, 1, 1, fireball.copy(), 0, 0);
		bullet.targetx = scene.player.x + scene.player.width/2;
		bullet.targety = scene.player.y + scene.player.height/2;
		bullet.speed = 1;
		bullet.distance =  Math.sqrt( Math.pow((bullet.targetx - bullet.x), 2) + Math.pow((bullet.targety - bullet.y),2));
		bullet.speedx = Math.abs(bullet.targetx - bullet.x)/bullet.distance * bullet.speed;
		bullet.speedy = Math.abs(bullet.targety - bullet.y)/bullet.distance * bullet.speed;
		if (bullet.targetx - bullet.x < 0){
			bullet.speedx *= -1;
		}
		if (bullet.targety - bullet.y < 0){
			bullet.speedy *= -1;
		}
		//go function added since animated entities use move.
		bullet.go = function(){
			this.x += this.speedx;
			this.y += this.speedy;
		};
		scene.bullets.push(bullet);
	};

	scene.cloud = new Splat.AnimatedEntity(0,0, canvas.width, canvas.height, cloud, 0, 0);
	scene.cloud2 = new Splat.AnimatedEntity(400,0, canvas.width, canvas.height, cloud, 0, 0);
	scene.player = createPlayer(100,100,50,50);
	scene.camera = new Splat.Camera(0,0,384, 224);
	scene.arrow = game.animations.get("eliya_arrow");
	scene.hydra = new Splat.AnimatedEntity(400, 20, hydra.width, hydra.height , hydra, 0, 0);
	scene.hydra.spawner1 = new Splat.Entity(scene.hydra.x + 24, scene.hydra.y+75, 0, 0);
	scene.hydra.spawner1.fire = hydraFire;
	scene.hydra.spawner2 = new Splat.Entity(scene.hydra.x + 70, scene.hydra.y+28, 0, 0);
	scene.hydra.spawner2.fire = hydraFire;
	scene.hydra.spawner3 = new Splat.Entity(scene.hydra.x + 117, scene.hydra.y+73, 0, 0);
	scene.hydra.spawner3.fire = hydraStream;

	scene.timers.hydraFire = new Splat.Timer(undefined, 5000, function(){
		scene.hydra.spawner1.fire();
		this.reset();
		this.start();
	});
	scene.timers.hydraFire.start();

}, function(elapsedMillis) {
	// simulation
	var scene = this;
	// set the boundary for the scrolling camera

	if(this.camera.x >= 200){
		this.camera.vx =0;
	}
	else
	{
		this.camera.vx = 0.1;
	}
	var ox = this.player.x - this.camera.x;
	var oy = this.player.y - this.camera.y;

	this.camera.move(elapsedMillis);

	this.camera.vx = 0;
	this.player.vx = 0;
	this.player.vy = 0;

	this.player.x = this.camera.x + ox;
	this.player.y = this.camera.y + oy;

	//console.log(this.player.x - this.camera.x, this.player.x, this.camera.x);
	
	
	// set the boundary for the scrolling camera
	if (game.keyboard.isPressed("left")) {
		scene.player.vx = -0.2;
	}
	if (game.keyboard.isPressed("right")) {
		scene.player.vx = 0.2;
	}
	if (game.keyboard.isPressed("up")) {
		scene.player.vy = -0.2;
	}
	if (game.keyboard.isPressed("down")) {
		scene.player.vy = 0.2;
	}

	if (game.keyboard.isPressed("q")) {
		console.log(this.player.x, this.camera.x, ox);
	}

	scene.player.move(elapsedMillis);
	scene.hydra.move(elapsedMillis);
	

	//control the camera
	if (game.keyboard.isPressed("o")){
		scene.camera.x += 0.9;
	}

	if (game.keyboard.isPressed("p")){
		scene.camera.x -= 0.9;
	}

	if (game.mouse.consumePressed(0)){
		console.log("x:" + game.mouse.x, "y:" + game.mouse.y);
	}

	if (game.mouse.consumePressed(2)){
		scene.hydra.spawner1.fire();
		scene.hydra.spawner2.fire();
		scene.hydra.spawner3.fire();
	}

	// player boundaries in relation to the camera
	if (scene.player.x <= scene.camera.x){
		scene.player.x = scene.camera.x;
	}
	if (scene.player.x >= scene.camera.x + scene.camera.width - scene.player.width){
		scene.player.x = scene.camera.x + scene.camera.width - scene.player.width;
	}
	//keep player inbetween top and bottom of screen
	if (scene.player.y <= 0){
		scene.player.y = 0;
	}
	if (scene.player.y >= canvas.height - scene.player.height){
		scene.player.y = canvas.height - scene.player.height;
	}
	
	//projectile management
	for(var x = 0; x < scene.bullets.length; x++){
		scene.bullets[x].go();
		scene.bullets[x].move(elapsedMillis);
		if(scene.bullets[x].y > scene.camera.height || 
		   scene.bullets[x].y < 0 || scene.bullets[x].x < scene.camera.x || 
		   scene.bullets[x].x > scene.camera.x + scene.camera.width){
			this.bullets.splice(x,1);
		}
	}

	//collision detection with player
	for(x = 0; x < scene.bullets.length; x++){
		if(scene.bullets[x].collides(scene.player)){
			console.log("hit!");
			scene.bullets.splice(x,1);
		}
	}


		for(var y; y < scene.bullets.length; y++){
		scene.bullets[y].move(elapsedMillis);	
		}

		particles.move(elapsedMillis);



}, function(context) {
	// draw
	this.player.draw(context);

	var scene = this;
	context.clearRect(this.camera.x, this.camera.y , canvas.width, canvas.height);

	context.fillStyle = "#092227";
	context.fillRect(0, 0, canvas.width * 200, canvas.height + 100);

	context.fillStyle = "#fff";

	scene.player.draw(context);
	scene.hydra.draw(context);
	for(var x=0 ; x< scene.bullets.length; x++){
		scene.bullets[x].draw(context);
		// particles.add(3, scene.bullets[x].x, scene.bullets[x].y, 0, "circle");
	}
	particles.draw(context);
}));

game.scenes.switchTo("loading");
