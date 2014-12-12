// Enemies our player must avoid
var Enemy = function(x,y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.velocity = Math.floor(Math.random()*(121)+100);// this found at http://stackoverflow.com/questions/4959975/generate-random-value-between-two-numbers-in-javascript
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
	if ( this.x <= ctx.canvas.width) {// let the Enemy appear to smoothly move past right side
		this.x += this.velocity*dt;
	} else {
		this.x = -(Resources.get(this.sprite).width);// Start enemy entirely beyond left side, then have it appear to move smoothly into canvas
	}
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x,y,xStep,yStep) {
	
	this.sprite = 'images/char-boy.png';// Might allow user to select this at start
	Resources.load(this.sprite);
	//define start position and number of pixels to move when user hits movement key
	this.x = x;
	this.y = y;
	this.xStep = xStep;
	this.yStep = yStep;
}


Player.prototype.intersects = function(enemy) {
	  
	return !( enemy.x != this.x || enemy.y != this.y);
	
	/*
	Use the following if we decide to allow for smoother left/right movement.
	This method adapted from an example found at
	http://stackoverflow.com/questions/20846944/check-if-two-items-overlap-on-a-canvas-using-javascript
	
	var pw = Resources.get(this.sprite).width;
	var ew = Resources.get(enemy.sprite).width;
	return !( enemy.x > (this.x + pw - 20) || 
            (enemy.x + ew) <  (this.x + 20) || 
             enemy.y != this.y);
	*/
}

Player.prototype.update = function(x,y) {
	
}

Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite),this.x, this.y);
}

Player.prototype.handleInput = function(kc) {
	// The way I've written this, the player sprite moves on the image?
	// 		A: sort of - the "main()" function in engine.js redraws the entire frame, using
	//			the x/y values we've set here. 
	var ph = Resources.get(this.sprite).height;
	var pw = Resources.get(this.sprite).width;
	console.clear();
	switch (true) {
		case (kc === 'up'):
			if (this.y - this.yStep > 0) this.y -= this.yStep;//y = 0 is top
			break;
		case (kc === 'down'):
			if (this.y + ph + this.yStep <= ctx.canvas.height) this.y += this.yStep;
			break;
		case (kc === 'left'):
			if (this.x - this.xStep >= 0) this.x -= this.xStep;
			break;
		case (kc === 'right'):
			if (this.x + pw + this.xStep <= ctx.canvas.width) this.x += this.xStep;
			break;
	}
	for (thisEnemy in allEnemies) {
		console.log("Touching enemy " + thisEnemy + "? " + this.intersects(allEnemies[thisEnemy]) + "(Player: " + this.x + "," + this.y + " - Enemy: " + allEnemies[thisEnemy]);
	}
	
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
for (var i = 0;i < 4;i++) {// Ideally, we'd set the number of enemies in resources.js, possibly based on user input
	var x = 0;
	var y = (83 * i) + 50;// Magic numbers. Bleh. Need to find a way to make the 50 and 83 values "globally accessible".
	allEnemies.push(new Enemy(x,y));
}

var player = new Player(0,382,101,83);// I hate magic numbers - 101 is width of all blocks, 83 is defined in engine.js as the default y step size when adding the blocks.

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
//dummy comment here
