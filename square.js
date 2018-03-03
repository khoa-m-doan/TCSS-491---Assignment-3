function Square(game, player, clockTick) {
	this.player = player;
    this.side = 50;
    this.clockTick = clockTick;
    //this.visualside = 500;

    switch(player) {
    	case 1:
    		Entity.call(this, game, 0, 0); 
    		this.x = 0; 
    		this.y = 0;
    		this.color = "Red";
    		this.team = 1;
    		break;
    	case 2: 
    		Entity.call(this, game, 800, 400); 
    		this.x = 0; 
    		this.y = 750;
    		this.color = "Green";
    		this.team = 1;
    		break;
    	case 3:
    		Entity.call(this, game, 400, 800);
    		this.x = 750;
    		this.y = 0;
    		this.color = "Blue";
    		this.team = 2;
    		break;
    	case 4: 
    		Entity.call(this, game, 400, 0);
    		this.x = 750;
    		this.y = 750;
    		this.color = "Yellow";
    		this.team = 2;
    		break;
    	default: console.log("something else");
    }
};

Square.prototype = new Entity();
Square.prototype.constructor = Square;

Square.prototype.collide = function (other) {
    return distance(this, other) < this.side + other.radius;
};

Square.prototype.collideLeft = function () {
    return (this.x - this.side) < 0;
};

Square.prototype.collideRight = function () {
    return (this.x + this.side) > 800;
};

Square.prototype.collideTop = function () {
    return (this.y - this.side) < 0;
};

Square.prototype.collideBottom = function () {
    return (this.y + this.side) > 800;
};

Square.prototype.update = function () {
	
    Entity.prototype.update.call(this);

    this.clockTick++;
    if(this.clockTick > 120) {
    	var radius = Math.floor(Math.random() * 3 + 1) * 10;

        var maxSpeed = 200;
        var velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
        var speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        if (speed > maxSpeed) {
            var ratio = maxSpeed / speed;
            velocity.x *= ratio;
            velocity.y *= ratio;
        }
    	var circle = new Circle(this.game, radius, this.player, 0, this.x, this.y, velocity.x, velocity.y, maxSpeed);

    	this.game.addEntity(circle);
        this.clockTick = 0;
    }
};

Square.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    //ctx.arc(this.x, this.y, this.side, 0, Math.PI * 2, false);
    ctx.rect(this.x, this.y, this.side, this.side);
    ctx.fill();
    ctx.closePath();
    Entity.prototype.draw.call(this)
};