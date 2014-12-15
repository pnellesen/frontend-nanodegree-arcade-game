/* create a new object to use as base for
 * all objects which we'll be putting on our
 * canvas. Every object has, at minimum,
 * a position, an image, and a render function which
 * should not differ between different types (player, enemy, any pickups/blockers, etc.) 
 */ 
var CanvasItem = function(x,y,sprite) {
	this.x = x || 0;
	this.y = y || 0;
	this.sprite = sprite || "";
	this.width = Resources.get(this.sprite).width || 0;
	this.height = Resources.get(this.sprite).height || 0;
	this.render = function() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	};
};

// Enemies our player must avoid
var Enemy = function(x,y) {
	this.base = CanvasItem;
	this.base(x,y,'images/enemy-bug.png');
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
		this.x = -this.width;// Start enemy entirely beyond left side, then have it appear to move smoothly into canvas
	}
	if (checkCollision(player,this)) {
		player.reset();
	}
}

// Draw the enemy on the screen, required method for game
/* Moved render function into CanvasItem constructor
 * 
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

*/
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x,y,xStep,yStep) {
	this.base = CanvasItem;
	this.base(x,y,'images/char-boy.png');

	this.xInit = x;//starting x and y values. Will be used to reset player if it collides with enemy
	this.yInit = y;
	
	this.xStep = xStep;//Number of pixels to move per keystroke in both x and y directions. Might not be needed.
	this.yStep = yStep;
}

Player.prototype.reset = function() {
	this.x = this.xInit;
	this.y = this.yInit;
}
Player.prototype.update = function(x,y) {
	// this is called every time main is called in engine.js

}
/*
 * Moved render function into CanvasItem constructor
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite),this.x, this.y);
}
*/
Player.prototype.handleInput = function(kc) {
	// The way I've written this, the player sprite moves on the image?
	// 		A: sort of - the "main()" function in engine.js redraws the entire frame, using
	//			the x/y values we've set here. 
	switch (true) {
		case (kc === 'up'):
			if (this.y - this.yStep > 0) this.y -= this.yStep;//y = 0 is top
			break;
		case (kc === 'down'):
			if (this.y + this.height + this.yStep <= ctx.canvas.height) this.y += this.yStep;
			break;
		case (kc === 'left'):
			if (this.x - this.xStep >= 0) this.x -= this.xStep;
			break;
		case (kc === 'right'):
			if (this.x + this.width + this.xStep <= ctx.canvas.width) this.x += this.xStep;
			break;
	}
	for (thisEnemy in allEnemies) {
		//console.log("Touching enemy " + thisEnemy + "? " + checkCollision(this,allEnemies[thisEnemy]) + "(Player: " + this.x + "," + this.y + " - Enemy: " + allEnemies[thisEnemy]);
		if (checkCollision(this,allEnemies[thisEnemy])) {
			this.reset();
			break;
		}
		
	}
	
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player;
function buildAll() {
	console.log("got to buildAll");
	for (var i = 0;i < 4;i++) {// Ideally, we'd set the number of enemies in resources.js, possibly based on user input
		var x = 0;
		var y = (83 * i) + 50;// Magic numbers. Bleh. Need to find a way to make the 50 and 83 values "globally accessible".
		allEnemies.push(new Enemy(x,y));
	}
	player = new Player(0,382,101,83);// I hate magic numbers - 101 is width of all blocks, 83 is defined in engine.js as the default y step size when adding the blocks.
	
}
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
/*
The following function adapted from an example found at
http://stackoverflow.com/questions/20846944/check-if-two-items-overlap-on-a-canvas-using-javascript
Note: we're subtracting 20px from left and right side of player to account for some transparency in player image
*/
function checkCollision(pl,en) {
	return !( en.x > (pl.x + pl.width - 20) || 
            (en.x + en.width) <  (pl.x + 20) || 
             en.y != pl.y);
}
//dummy comment here
