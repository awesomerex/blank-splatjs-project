game.scenes.add("title", new Splat.Scene(canvas, function() {
	// initialization
	var scene = this;
	var cloud = game.animations.get("cloud");
	scene.cloud = new Splat.AnimatedEntity(0,0, canvas.width, canvas.height, cloud, 0, 0);
	scene.cloud2 = new Splat.AnimatedEntity(400,0, canvas.width, canvas.height, cloud, 0, 0);
	scene.player = createPlayer(100,100,50,50);
	//scene.camera = new Splat.EntityBoxCamera(scene.player, canvas.width - 200, canvas.height + 100, canvas.width /2, canvas.height/2);
	scene.camera = new Splat.Camera(0,0,384, 224);

}, function(elapsedMillis) {
	// simulation
	if(this.camera.x >= 0){
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

	this.player.vx = 0;
	this.player.vy = 0;
	// set the boundary for the scrolling camera
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

}, function(context) {
	// draw
	context.clearRect(this.camera.x, this.camera.y , canvas.width, canvas.height);

	context.fillStyle = "#092227";
	context.fillRect(0, 0, canvas.width * 200, canvas.height + 100);

	context.fillStyle = "#fff";
	context.font = "18px helvetica";
	centerText(context, "Blank SplatJS Project", 0, canvas.height / 2 - 13);
	this.player.draw(context);
}));