const React = require("react");
const ReactDOM = require("react-dom/client");
var io = require("socket.io-client");
var render = require("./render");
var ChatClient = require("./chat-client");
var Canvas = require("./canvas");
var global = require("./global");
const { default: FlowingBalance } = require("../react/FlowingBalance");

var playerNameInput = document.getElementById("playerNameInput");
var socket;

var debug = function (args) {
    if (console && console.log) {
        console.log(args);
    }
};

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    global.mobile = true;
}

function nounIsPicked() {
    return Boolean(global.img);
}

function startGame({ type, playerName, initialFlowRate, balance }) {
    // global.playerName = playerNameInput.value
    //     .replace(/(<([^>]+)>)/gi, "")
    //     .substring(0, 25);
    if (!playerName) {
        window.alert("Please enter a name");
        return;
    }
    if (!global.img) {
        window.alert("Please select your nouns image");
        return;
    }
    global.playerName = playerName;
    global.playerType = type;
    global.player = {
        balance,
        initialFlowRate,
    };

    console.log(global.player);

    ReactDOM.createRoot(document.getElementById("points")).render(
        <React.StrictMode>
            <FlowingBalance
                startingBalance={global.player.balance}
                startingBalanceDate={new Date()}
                flowRate={global.player.initialFlowRate}
            />
        </React.StrictMode>
    );

    global.screen.width = window.innerWidth;
    global.screen.height = window.innerHeight;

    document.getElementById("startMenuWrapper").style.maxHeight = "0px";
    document.getElementById("startMenuWrapper").style.display = "none";
    document.getElementById("gameAreaWrapper").style.opacity = 1;
    if (!socket) {
        // socket = io({ query: "type=" + type });
        socket = io({ query: "type=" + type + "&img=" + global.img });
        setupSocket(socket);
    }
    if (!global.animLoopHandle) animloop();
    socket.emit("respawn");
    window.chat.socket = socket;
    window.chat.registerFunctions();
    window.canvas.socket = socket;
    global.socket = socket;
}

// Checks if the nick chosen contains valid alphanumeric characters (and underscores).
function validNick() {
    // var regex = /^\w*$/;
    // debug("Regex Test", regex.exec(playerNameInput.value));
    // return regex.exec(playerNameInput.value) !== null;
    return true;
}

window.onload = function () {
    var btn = document.getElementById("startButton"),
        btnS = document.getElementById("spectateButton"),
        nickErrorText = document.querySelector("#startMenu .input-error");
    console.log("Loaded", btn);
    btnS.onclick = function () {
        startGame("spectator");
    };
    window.startGame = startGame;
    window.nounIsPicked = nounIsPicked;

    // whenever an image is selected, it should set the global.playerName to the image name
    document.querySelectorAll("img").forEach((img) => {
        img.addEventListener("click", () => {
            // global.playerName = img.getAttribute("data-name");
            global.img = img.getAttribute("data-name");
            document.querySelectorAll("img").forEach((resetImg) => {
                resetImg.style.border = "";
            });
            img.style.border = "2px solid blue"; // Highlight the selected image
        });
    });
    document.querySelectorAll("img")[0].click(); // Select the first image by default
    // btn.addEventListener("click", function () {
    //     if (validNick()) {
    //         startGame("player");
    //     }
    // });

    var settingsMenu = document.getElementById("settingsButton");
    var settings = document.getElementById("settings");

    settingsMenu.onclick = function () {
        if (settings.style.maxHeight == "300px") {
            settings.style.maxHeight = "0px";
        } else {
            settings.style.maxHeight = "300px";
        }
    };

    playerNameInput.addEventListener("keypress", function (e) {
        var key = e.which || e.keyCode;

        if (key === global.KEY_ENTER) {
            if (validNick()) {
                startGame("player");
            }
        }
    });
};

// TODO: Break out into GameControls.

var playerConfig = {
    border: 6,
    textColor: "#FFFFFF",
    textBorder: "#000000",
    textBorderSize: 3,
    defaultSize: 30,
};

var player = {
    id: -1,
    x: global.screen.width / 2,
    y: global.screen.height / 2,
    screenWidth: global.screen.width,
    screenHeight: global.screen.height,
    target: { x: global.screen.width / 2, y: global.screen.height / 2 },
};
global.player = player;

var foods = [];
var viruses = [];
var fireFood = [];
var users = [];
var leaderboard = [];
var target = { x: player.x, y: player.y };
global.target = target;

window.canvas = new Canvas();
window.chat = new ChatClient();

var visibleBorderSetting = document.getElementById("visBord");
visibleBorderSetting.onchange = settings.toggleBorder;

var showMassSetting = document.getElementById("showMass");
showMassSetting.onchange = settings.toggleMass;

var continuitySetting = document.getElementById("continuity");
continuitySetting.onchange = settings.toggleContinuity;

var roundFoodSetting = document.getElementById("roundFood");
roundFoodSetting.onchange = settings.toggleRoundFood;

var c = window.canvas.cv;
var graph = c.getContext("2d");
// is it possible to add an image to thie graph
// graph.drawImage('img', 0, 0, 100, 100);

$("#feed").click(function () {
    socket.emit("1");
    window.canvas.reenviar = false;
});

$("#split").click(function () {
    socket.emit("2");
    window.canvas.reenviar = false;
});

function handleDisconnect() {
    socket.close();
    if (!global.kicked) {
        // We have a more specific error message
        render.drawErrorMessage("Disconnected!", graph, global.screen);
    }
}

// socket stuff.
function setupSocket(socket) {
    function youDied(customMsg = "Yoiu died!") {
        global.gameStart = false;
        render.drawErrorMessage(customMsg, graph, global.screen);
        window.setTimeout(() => {
            document.getElementById("gameAreaWrapper").style.opacity = 0;
            document.getElementById("startMenuWrapper").style.maxHeight =
                "1000px";
            document.getElementById("startMenuWrapper").style.display = "block";
            if (global.animLoopHandle) {
                window.cancelAnimationFrame(global.animLoopHandle);
                global.animLoopHandle = undefined;
            }
        }, 2500);
    }
    // Handle ping.
    socket.on("pongcheck", function () {
        var latency = Date.now() - global.startPingTime;
        debug("Latency: " + latency + "ms");
        window.chat.addSystemLine("Ping: " + latency + "ms");
    });

    $("#endGame").click(() => {
        if (confirm("Are you sure you want to end the game?")) {
            youDied("Game over!");
        }
    });
    // Handle error.
    socket.on("connect_error", handleDisconnect);
    socket.on("disconnect", handleDisconnect);

    // Handle connection.
    socket.on("welcome", function (playerSettings, gameSizes) {
        player = playerSettings;
        player.name = global.playerName;
        player.screenWidth = global.screen.width;
        player.screenHeight = global.screen.height;
        player.target = window.canvas.target;
        global.player = player;
        window.chat.player = player;
        socket.emit("gotit", player);
        global.gameStart = true;
        window.chat.addSystemLine("Connected to the game!");
        window.chat.addSystemLine("Type <b>-help</b> for a list of commands.");
        if (global.mobile) {
            document
                .getElementById("gameAreaWrapper")
                .removeChild(document.getElementById("chatbox"));
        }
        c.focus();
        global.game.width = gameSizes.width;
        global.game.height = gameSizes.height;
        resize();
    });

    socket.on("playerDied", (data) => {
        const player = isUnnamedCell(data.playerEatenName)
            ? "An unnamed cell"
            : data.playerEatenName;
        //const killer = isUnnamedCell(data.playerWhoAtePlayerName) ? 'An unnamed cell' : data.playerWhoAtePlayerName;

        //window.chat.addSystemLine('{GAME} - <b>' + (player) + '</b> was eaten by <b>' + (killer) + '</b>');
        window.chat.addSystemLine("{GAME} - <b>" + player + "</b> was eaten");
    });

    socket.on("playerDisconnect", (data) => {
        window.chat.addSystemLine(
            "{GAME} - <b>" +
                (isUnnamedCell(data.name) ? "An unnamed cell" : data.name) +
                "</b> disconnected."
        );
    });

    socket.on("playerJoin", (data) => {
        window.chat.addSystemLine(
            "{GAME} - <b>" +
                (isUnnamedCell(data.name) ? "An unnamed cell" : data.name) +
                "</b> joined."
        );
    });

    socket.on("leaderboard", (data) => {
        leaderboard = data.leaderboard;
        var status = '<span class="title">Leaderboard</span>';

        const formatAddress = (address) => {
            return (
                address.substring(0, 6) +
                "..." +
                address.substring(address.length - 4)
            );
        };

        for (var i = 0; i < leaderboard.length; i++) {
            status += "<br />";
            const formattedName =
                leaderboard[i].name.length !== 0
                    ? formatAddress(leaderboard[i].name)
                    : "An unnamed cell";
            if (leaderboard[i].id == player.id) {
                status +=
                    '<span class="me">' +
                    (i + 1) +
                    ". " +
                    formattedName +
                    "</span>";
            } else {
                status += i + 1 + ". " + formattedName;
            }
        }
        document.getElementById("status").innerHTML = status;
    });

    socket.on("serverMSG", function (data) {
        window.chat.addSystemLine(data);
    });

    // Chat.
    socket.on("serverSendPlayerChat", function (data) {
        window.chat.addChatLine(data.sender, data.message, false);
    });

    // Handle movement.
    socket.on(
        "serverTellPlayerMove",
        function (playerData, userData, foodsList, massList, virusList) {
            if (global.playerType == "player") {
                player.x = playerData.x;
                player.y = playerData.y;
                player.hue = playerData.hue;
                player.img = playerData.img;
                player.massTotal = playerData.massTotal;
                player.cells = playerData.cells;
            }
            users = userData;
            foods = foodsList;
            viruses = virusList;
            fireFood = massList;
        }
    );

    // Death.
    socket.on("RIP", function () {
        youDied();
    });

    socket.on("kick", function (reason) {
        global.gameStart = false;
        global.kicked = true;
        if (reason !== "") {
            render.drawErrorMessage(
                "You were kicked for: " + reason,
                graph,
                global.screen
            );
        } else {
            render.drawErrorMessage("You were kicked!", graph, global.screen);
        }
        socket.close();
    });
}

const isUnnamedCell = (name) => name.length < 1;

const getPosition = (entity, player, screen) => {
    return {
        x: entity.x - player.x + screen.width / 2,
        y: entity.y - player.y + screen.height / 2,
    };
};

window.requestAnimFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
})();

window.cancelAnimFrame = (function (handle) {
    return window.cancelAnimationFrame || window.mozCancelAnimationFrame;
})();

function animloop() {
    global.animLoopHandle = window.requestAnimFrame(animloop);
    gameLoop();
}

function gameLoop() {
    if (global.gameStart) {
        graph.fillStyle = global.backgroundColor;
        graph.fillRect(0, 0, global.screen.width, global.screen.height);

        // render.drawGrid(global, player, global.screen, graph);
        foods.forEach((food) => {
            let position = getPosition(food, player, global.screen);
            render.drawFood(position, food, graph);
        });
        fireFood.forEach((fireFood) => {
            let position = getPosition(fireFood, player, global.screen);
            render.drawFireFood(position, fireFood, playerConfig, graph);
        });
        viruses.forEach((virus) => {
            let position = getPosition(virus, player, global.screen);
            render.drawVirus(position, virus, graph);
        });

        let borders = {
            // Position of the borders on the screen
            left: global.screen.width / 2 - player.x,
            right: global.screen.width / 2 + global.game.width - player.x,
            top: global.screen.height / 2 - player.y,
            bottom: global.screen.height / 2 + global.game.height - player.y,
        };
        if (global.borderDraw) {
            render.drawBorder(borders, graph);
        }

        var cellsToDraw = [];
        for (var i = 0; i < users.length; i++) {
            let color = "hsl(" + users[i].hue + ", 100%, 50%)";
            let borderColor = "hsl(" + users[i].hue + ", 100%, 45%)";
            for (var j = 0; j < users[i].cells.length; j++) {
                cellsToDraw.push({
                    color: color,
                    borderColor: borderColor,
                    mass: users[i].cells[j].mass,
                    name: users[i].name,
                    img: users[i].img,
                    radius: users[i].cells[j].radius,
                    x: users[i].cells[j].x - player.x + global.screen.width / 2,
                    y:
                        users[i].cells[j].y -
                        player.y +
                        global.screen.height / 2,
                });
            }
        }
        cellsToDraw.sort(function (obj1, obj2) {
            return obj1.mass - obj2.mass;
        });
        render.drawCells(
            cellsToDraw,
            playerConfig,
            global.toggleMassState,
            borders,
            graph
        );

        socket.emit("0", window.canvas.target); // playerSendTarget "Heartbeat".
    }
}

window.addEventListener("resize", resize);

function resize() {
    if (!socket) return;

    player.screenWidth =
        c.width =
        global.screen.width =
            global.playerType == "player"
                ? window.innerWidth
                : global.game.width;
    player.screenHeight =
        c.height =
        global.screen.height =
            global.playerType == "player"
                ? window.innerHeight
                : global.game.height;

    if (global.playerType == "spectator") {
        player.x = global.game.width / 2;
        player.y = global.game.height / 2;
    }

    socket.emit("windowResized", {
        screenWidth: global.screen.width,
        screenHeight: global.screen.height,
    });
}

const { default: Provider } = require("../react/Provider");
const { default: ConnectButton } = require("../react/ConnectButton");

ReactDOM.createRoot(document.getElementById("connect-button")).render(
    <React.StrictMode>
        <Provider>
            <ConnectButton />
        </Provider>
    </React.StrictMode>
);
