
// GameBoard code below

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// the "main" code begins here
var friction = 1;
var acceleration = 1000000;
var maxSpeed = 200;

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
ASSET_MANAGER.queueDownload("./img/white.png");

var socket = io.connect("http://24.16.255.56:8888");

socket.on("load", function (data) {
    console.log(data);
});

window.onload = function () {
    ASSET_MANAGER.downloadAll(function () {
        console.log("starting up da sheild");
        var canvas = document.getElementById('gameWorld');
        var ctx = canvas.getContext('2d');

        var gameEngine = new GameEngine();

        for (var i = 1; i <= 4; i++) {
            var square = new Square(gameEngine, i, 0);
            gameEngine.addEntity(square);
        }

        gameEngine.init(ctx);
        gameEngine.start();

        // load states
        socket.on("load", function(data) {
            var entities = data.gameState;
            //empty the entities so you can add the loaded data in
            gameEngine.entities = [];

            console.log("Trying to load");
            for (var i = 0; i < entities.length; i++) {
                if (entities[i].name === "circle") {
                    var circle = new Circle(
                            gameEngine,
                            entities[i].radius,
                            entities[i].player,
                            entities[i].circleClockTick,
                            entities[i].x,
                            entities[i].y, 
                            entities[i].velocityX,
                            entities[i].velocityY,
                    );
                    console.log(circle);
                    gameEngine.addEntity(circle);
                    console.log("Data loaded for Circle");
                } else if (entities[i].name === "square") {
                    var square = new Square(gameEngine,
                            entities[i].player, 
                            entities[i].squareClockTick);
                    gameEngine.addEntity(square);
                    console.log("Data loaded for Square");
                }
            }
        });

        //save states
        document.getElementById("save").onclick = function(e) {
            e.preventDefault();
            console.log("Trying to save");
            console.log(gameEngine.entities);
            var entities = gameEngine.entities;
            //the data that is to be sended
            var saveState = {studentname: "Khoa Doan", statename: "doanData", gameState: []};
            for (var i = 0; i < gameEngine.entities.length; i++) {
                if (gameEngine.entities[i] instanceof Circle) {
                    var circle = gameEngine.entities[i];
                    saveState.gameState.push({
                        name: "circle",
                        player: circle.player,
                        radius: circle.radius,
                        maxSpeed: circle.maxSpeed, 
                        x: circle.x,
                        y: circle.y, 
                        velocityX: circle.velocity.x,
                        velocityY: circle.velocity.y,
                        circleClockTick: circle.clockTick
                    });
                    console.log("Data saved for Circle");
                } else if(gameEngine.entities[i] instanceof Square) {
                    var square = gameEngine.entities[i];
                    saveState.gameState.push({name: "square",
                        player: square.player,
                        squareClockTick: square.clockTick
                    });
                    console.log("Data saved for Square");
                }
            }

            //send the data to the server to be saved
            socket.emit("save", saveState);  
        }

        document.getElementById("load").onclick = function(e) {
            e.preventDefault();
            console.log("Trying to load");
            socket.emit("load", {studentname: "Khoa Doan", statename: "doanData"});
        }


        socket.on("connect", function () {
            console.log("Socket connected.")
        });
        socket.on("disconnect", function () {
            console.log("Socket disconnected.")
        });
        socket.on("reconnect", function () {
            console.log("Socket reconnected.")
        });

    });
}
