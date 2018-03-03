function Circle(game, radius, player, clockTick, x, y, velocityX, velocityY, maxSpeed) { 
    this.player = player;
    this.radius = radius;
    this.clockTick = clockTick;
    this.visualRadius = 3000;
    this.maxSpeed = maxSpeed;

    Entity.call(this, game, x, y);
    this.x = x;
    this.y = y;

    switch(player) {
        case 1:
            this.color = "Red";
            this.team = 1;
            break;
        case 2: 
            this.color = "Green";
            this.team = 1;
            break;
        case 3:
            this.color = "Blue";
            this.team = 2;
            break;
        case 4: 
            this.color = "Yellow";
            this.team = 2;
            break;
        default: console.log("something else");
    }

    this.velocity = {x: velocityX, y: velocityY};
};

Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;

Circle.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Circle.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Circle.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

Circle.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Circle.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

Circle.prototype.update = function () {
    Entity.prototype.update.call(this);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    // only consider collision between circle and circle
    // circle and square dont collide
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];

        // only consider collision between two Circles
        if(ent instanceof Circle) {
            if (this.clockTick > 0) this.clockTick--;

            if (ent !== this && this.collide(ent)) {
                // same team
                if (this.team === ent.team) {
                    var temp = { x: this.velocity.x, y: this.velocity.y };

                    var dist = distance(this, ent);
                    var delta = this.radius + ent.radius - dist;
                    var difX = (this.x - ent.x)/dist;
                    var difY = (this.y - ent.y)/dist;

                    this.x += difX * delta / 2;
                    this.y += difY * delta / 2;
                    ent.x -= difX * delta / 2;
                    ent.y -= difY * delta / 2;

                    this.velocity.x = ent.velocity.x * friction;
                    this.velocity.y = ent.velocity.y * friction;
                    ent.velocity.x = temp.x * friction;
                    ent.velocity.y = temp.y * friction;
                    this.x += this.velocity.x * this.game.clockTick;
                    this.y += this.velocity.y * this.game.clockTick;
                    ent.x += ent.velocity.x * this.game.clockTick;
                    ent.y += ent.velocity.y * this.game.clockTick;

                    // same team but different colors
                    if (this.color !== ent.color
                            && this.clockTick === 0
                            && ent.clockTick === 0) {
                        this.radius += 5;
                        ent.radius += 5;
                        this.clockTick = 120;
                        ent.clockTick = 120;

                        // if the circle gets too big, remove from world
                        if (this.radius > 90) {
                            this.removeFromWorld = true;
                        }

                        // resize the circle if it gets slightly too big
                        if (this.radius > 60) {
                            this.radius = 20;
                            this.clockTick = 0;
                        }
                    }
                } else { //different team
                    this.radius -= 10;
                    ent.radius -= 10;
                    if(this.radius <= 0) {
                        this.removeFromWorld = true;
                    }
                    if(ent.radius <= 0) {
                        ent.removeFromWorld = true;
                    }                       
                }
            }


            // only 2 circles from 2 different teams will pull each other
            if (ent != this && ent.team != this.team 
                    && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius })) {
                var dist = distance(this, ent);
                if (this.it && dist > this.radius + ent.radius + 10) {
                    var difX = (ent.x - this.x)/dist;
                    var difY = (ent.y - this.y)/dist;
                    this.velocity.x += difX * acceleration / (dist*dist);
                    this.velocity.y += difY * acceleration / (dist * dist);
                    var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
                    if (speed > maxSpeed) {
                        var ratio = maxSpeed / speed;
                        this.velocity.x *= ratio;
                        this.velocity.y *= ratio;
                    }
                }
                if (ent.it && dist > this.radius + ent.radius) {
                    var difX = (ent.x - this.x) / dist;
                    var difY = (ent.y - this.y) / dist;
                    this.velocity.x -= difX * acceleration / (dist * dist);
                    this.velocity.y -= difY * acceleration / (dist * dist);
                    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                    if (speed > maxSpeed) {
                        var ratio = maxSpeed / speed;
                        this.velocity.x *= ratio;
                        this.velocity.y *= ratio;
                    }
                }
            }

        }

    }

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
};

Circle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

};