// Enemies our player must avoid
var Enemy = function(x,y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
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
	
	//define start position and number of pixels to move when user hits movement key
	this.x = x;
	this.y = y;
	this.xStep = xStep;
	this.yStep = yStep;
}

Player.prototype.update = function(x,y) {
	//player sprite is a
}
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite),this.x, this.y);
}

Player.prototype.handleInput = function(kc) {
	console.log("key pressed: " + kc);
	console.log("x before: " + this.x + " - y before: " + this.y);
	// The way I've written this, the player sprite moves on the image?
	// 		A: sort of - the "main()" function in engine.js redraws the entire frame, using
	//			the x/y values we've set here. 
	switch (true) {
		case (kc === 'up'):
			if (this.y > this.yStep) this.y -= this.yStep;//y = 0 is top
			break;
		case (kc === 'down'):
			this.y += this.yStep;
			break;
		case (kc === 'left'):
			if (this.x >= this.xStep) this.x -= this.xStep;
			break;
		case (kc === 'right'):
			this.x += this.xStep;
			break;
	}
	console.log("x after: " + this.x + " - y after: " + this.y);
	/*
	 * this.update(kc);
	 * this.render();
	 */
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
for (var i = 0;i < 4;i++) {// Ideally, we'd set the number of enemies in resources.js, possibly based on user input
	var x = 0;
	var y = 100 * i;
	allEnemies.push(new Enemy(x,y));
}

var player = new Player(100,55,50,50);

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
