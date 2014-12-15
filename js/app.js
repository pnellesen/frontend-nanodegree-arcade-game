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
	
	// Set up timers to track total time per round and best time.
	this.startTime = new Date();
	this.timer = this.startTime;
	this.totalTime = null;
	this.bestTime = null;// this might be a global variable if more than one player
	console.log("Player start time: " + this.timer);
}

Player.prototype.reset = function(checkTime) {//send player back to start, update best time if player has reached top, reset player timer
	this.totalTime = this.timer - this.startTime;// time in milliseconds.
	this.startTime = new Date();
	this.timer = this.startTime;
	if (!checkTime) {
		this.x = this.xInit;
		this.y = this.yInit;
		console.log("Hit by enemy! Start over");
	} else {
		if (this.bestTime === null || this.totalTime < this.bestTime) this.bestTime = this.totalTime;
		console.log("You win! Total time: " + formatTimeString(this.totalTime) + " - Best Time: " + formatTimeString(this.bestTime));	
	}

}
Player.prototype.update = function(x,y) {
	/* this is called every time main is called in engine.js.
	 * simply update the timer to the new system time.
	 * When game ends, start time will be subtracted from this.timer value
	 */
	if (this.y - this.yStep <= 0) {// Player wins!
		animate=false;// Global variable set in engine.js to control animation
		this.reset(true);
	}
	this.timer = new Date();
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

function formatTimeString(thisTime) {
	// see http://stackoverflow.com/questions/5588465/javascript-parse-time-minutesseconds-from-miliseconds
	var thisMins = Math.round((thisTime/1000/60) << 0);
	var thisSecs = Math.round((thisTime/1000) % 60);
	
	if (thisMins < 10) thisMins = "0" + thisMins.toString(); 
	if (thisSecs < 10) thisSecs = "0" + thisSecs.toString();
	
	return (thisMins + ":" + thisSecs);
}
//dummy comment here
