"use strict";

var Splat = require("splatjs");
var canvas = document.getElementById("canvas");

var manifest = {
	"images": {
		"cloud" : "assets/images/8bit_cloud.png"
	},
	"sounds": {
	},
	"fonts": {
	},
	"animations": {
		"cloud": {
			"strip": "assets/images/8bit_cloud.png",
			"frames": 1,
			"msPerFrame": 100
		}
	}
};

var game = new Splat.Game(canvas, manifest);

function centerText(context, text, offsetX, offsetY) {
	var w = context.measureText(text).width;
	var x = offsetX + (canvas.width / 2) - (w / 2) | 0;
	var y = offsetY | 0;
	context.fillText(text, x, y);
}

function createEntity(x, y, width, height, color){
	var entity = new Splat.Entity(x,y,width,height);
	entity.color = color;
	entity.draw = function(context){
		context.fillStyle = this.color;
		context.fillRect(this.x|0, this.y|0, this.width, this.height);
		//console.log(this.x|0);
	};

	return entity;
}

game.scenes.add("title", new Splat.Scene(canvas, function() {
	// initialization
	var scene = this;
	var cloud = game.animations.get("cloud");
	scene.cloud = new Splat.AnimatedEntity(0,0, canvas.width, canvas.height, cloud, 0, 0);
	scene.cloud2 = new Splat.AnimatedEntity(400,0, canvas.width, canvas.height, cloud, 0, 0);
	scene.player = createEntity(100,100,50,50,"orange");
	//scene.camera = new Splat.EntityBoxCamera(scene.player, canvas.width - 200, canvas.height + 100, canvas.width /2, canvas.height/2);
	scene.camera = new Splat.Camera(0,0,384, 224);
	scene.camera.vx = 0.1;
	scene.player.vx = 0.1;
}, function(elapsedMillis) {
	// simulation
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
	this.player.x = this.camera.x + ox;
	this.player.y = this.camera.y + oy;

	//console.log(this.player.x - this.camera.x);
	this.player.vx = 0;
	this.player.vy = 0;
	if (game.keyboard.isPressed("left")) {
		this.player.vx = -0.2;
	}
	if (game.keyboard.isPressed("right")) {
		this.player.vx = 0.2;
	}
	if (game.keyboard.isPressed("up")) {
		this.player.vy = -0.2;
	}
	if (game.keyboard.isPressed("down")) {
		this.player.vy = 0.2;
	}

	//control the camera
	if (game.keyboard.isPressed("o")){
		this.camera.x += 0.9;
	}

	if (game.keyboard.isPressed("p")){
		this.camera.x -= 0.9;
	}

	this.player.move(elapsedMillis);

	// player boundaries in relation to the camera
	if (this.player.x <= this.camera.x){
		this.player.x = this.camera.x;
	}
	if (this.player.x >= this.camera.x + this.camera.width - this.player.width){
		this.player.x = this.camera.x + this.camera.width - this.player.width;
	}
	//keep player inbetween top and bottom of screen
	if (this.player.y <= 0){
		this.player.y = 0;
	}
	if (this.player.y >= canvas.height - this.player.height){
		this.player.y = canvas.height - this.player.height;
	}

	console.log(this.camera.x);

}, function(context) {
	// draw
	context.clearRect(this.camera.x, this.camera.y , canvas.width, canvas.height);

	context.fillStyle = "#092227";
	context.fillRect(0, 0, canvas.width * 200, canvas.height + 100);

	context.fillStyle = "#fff";
	context.font = "18px helvetica";
	centerText(context, "Blank SplatJS Project", 0, canvas.height / 2 - 13);

	this.player.draw(context);
	this.cloud.draw(context);
	this.cloud2.draw(context);

}));

game.scenes.switchTo("loading");
