// Enemies our player must avoid
var Enemy = function(x,y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    //this.w = Resources.get(this.sprite).width;
    
    //this.h = Resources.get(this.sprite).height;
    this.eh = 70;//need to crop the image so that collisions work properly;
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
	//var eh = Resources.get(this.sprite).height;
	//var eh = 70;
	var ew = Resources.get(this.sprite).width;
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	//console.log("ctx.drawImage(" + Resources.get(this.sprite) + ",0,40," + ew + ",50," + this.x + "," + this.y + "," + ew + ",50);");
	//ctx.drawImage(Resources.get(this.sprite),0,75,ew,this.eh,this.x,this.y,ew,this.eh);
	
    
    ctx.rect(this.x,this.y,Resources.get(this.sprite).width,Resources.get(this.sprite).height);
    ctx.strokeStyle = "red";
    ctx.stroke()
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
	var ph = Resources.get(this.sprite).height;
	var ew = Resources.get(enemy.sprite).width;
	var eh = Resources.get(enemy.sprite).height;
	
    	return !( enemy.x > (this.x + pw) || 
                (enemy.x + ew) <  this.x || 
                 enemy.y > (this.y + ph) ||
                (enemy.y + eh) <  this.y );
}

Player.prototype.update = function(x,y) {
	
}

Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite),this.x, this.y);
	 ctx.rect(this.x,this.y,Resources.get(this.sprite).width,Resources.get(this.sprite).height);
	    ctx.strokeStyle = "blue";
	    ctx.stroke()
}

Player.prototype.handleInput = function(kc) {
	// The way I've written this, the player sprite moves on the image?
	// 		A: sort of - the "main()" function in engine.js redraws the entire frame, using
	//			the x/y values we've set here. 
	var ph = Resources.get(this.sprite).height;
	var pw = Resources.get(this.sprite).width;
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
	/*
	console.clear();
	for (thisEnemy in allEnemies) {
		console.log("Touching enemy " + thisEnemy + "? " + this.intersects(allEnemies[thisEnemy]) + "(Player: " + this.x + "," + this.y + " - Enemy: " + allEnemies[thisEnemy]);
	}
	*/
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
for (var i = 0;i < 4;i++) {// Ideally, we'd set the number of enemies in resources.js, possibly based on user input
	var x = 0;
	var y = (120 * i) + 55;
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
//dummy comment here
