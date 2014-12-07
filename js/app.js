// Enemies our player must avoid
var Enemy = function(x,y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    //this.w = Resources.get(this.sprite).width;
    this.y = y;
    //this.h = Resources.get(this.sprite).height;
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
	Resources.load([this.sprite]);//Add the player image to the global resources, so that we have access to height/width attributes.
	
	//define start position and number of pixels to move when user hits movement key
	this.x = x;
	this.y = y;
	this.xStep = xStep;
	this.yStep = yStep;
}

// The following 'intersects' method adapted from an example found at
// http://stackoverflow.com/questions/20846944/check-if-two-items-overlap-on-a-canvas-using-javascript
Player.prototype.intersects = function(enemy) {// 
	var pw = Resources.get(this.sprite).width;// Surely we can set these up in the player/enemy constructors?
	var ph = Resource.get(this.sprite).height;
	var ew = Resources.get(enemy.sprite).width;
	var eh = Resource.get(enemy.sprite).height;
	
    	return !( enemy.x > (this.x + pw) || 
             (enemy.x + ew) <  this.x           || 
              enemy.y > (this.y + ph) ||
             (enemy.y + eh) <  this.y);
}

Player.prototype.update = function(x,y) {
	//Check to see where new player x,y values are. If they touch an Enemy, they're DOOOOOO000MMEDDD!!ONE1
	if (allEnemies) {
		for (thisEnemy in allEnemies) {
			Console.log("Touching enemy " + thisEnemy + "? " + this.intersects(allEnemies[thisEnemy]));
		}
	}
}

Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite),this.x, this.y);
}

Player.prototype.handleInput = function(kc) {
	// The way I've written this, the player sprite moves on the image?
	// 		A: sort of - the "main()" function in engine.js redraws the entire frame, using
	//			the x/y values we've set here. 
	var ph = Resource.get(this.sprite).height;
	var pw = Resource.get(this.sprite).width;
	switch (true) {
		case (kc === 'up'):
			if (this.y > this.yStep) this.y -= this.yStep;//y = 0 is top
			break;
		case (kc === 'down'):
			if (this.y + ph + this.yStep < ctx.canvas.height) this.y += this.yStep;
			break;
		case (kc === 'left'):
			if (this.x >= this.xStep) this.x -= this.xStep;
			break;
		case (kc === 'right'):
			if (this.x + pw + this.xStep < ctx.canvas.width) this.x += this.xStep;
			break;
	}
	this.update(this.x,this.y);
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
