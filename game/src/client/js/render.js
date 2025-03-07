const global = require("./global");

const FULL_ANGLE = 2 * Math.PI;

const drawRoundObject = (position, radius, graph) => {
    const sides = 12; // Dodecagon for a more circular appearance
    const angleStep = FULL_ANGLE / sides;

    graph.beginPath();
    for (let i = 0; i < sides; i++) {
        const theta = i * angleStep;
        const point = {
            x: position.x + radius * Math.cos(theta),
            y: position.y + radius * Math.sin(theta),
        };
        if (i === 0) {
            graph.moveTo(point.x, point.y);
        } else {
            graph.lineTo(point.x, point.y);
        }
    }
    graph.closePath();
    graph.fill();
    graph.stroke();
};

const drawFood = (position, food, graph) => {
    const size = 30;
    const image = new Image(size, size);
    const foods = [
        global.itemImages.cheese,
        global.itemImages.cherry,
        global.itemImages.steak,
    ];
    const remainderOfFloat = food.mass % 1;
    // Randomly select a food image
    image.src = foods[Math.floor(remainderOfFloat * foods.length)];

    graph.drawImage(image, position.x, position.y, size, size);
};

const drawVirus = (position, virus, graph) => {
    const image = new Image(100, 100);

    image.src = global.itemImages.bomb;

    graph.drawImage(image, position.x, position.y, 100, 100);
};

const drawFireFood = (position, mass, playerConfig, graph) => {
    graph.strokeStyle = "hsl(" + mass.hue + ", 100%, 45%)";
    graph.fillStyle = "hsl(" + mass.hue + ", 100%, 50%)";
    graph.lineWidth = playerConfig.border + 2;
    drawRoundObject(position, mass.radius - 1, graph);
};

const valueInRange = (min, max, value) => Math.min(max, Math.max(min, value));

const circlePoint = (origo, radius, theta) => ({
    x: origo.x + radius * Math.cos(theta),
    y: origo.y + radius * Math.sin(theta),
});

const cellTouchingBorders = (cell, borders) =>
    cell.x - cell.radius <= borders.left ||
    cell.x + cell.radius >= borders.right ||
    cell.y - cell.radius <= borders.top ||
    cell.y + cell.radius >= borders.bottom;

const regulatePoint = (point, borders) => ({
    x: valueInRange(borders.left, borders.right, point.x),
    y: valueInRange(borders.top, borders.bottom, point.y),
});

const drawCellWithLines = (cell, borders, graph) => {
    let pointCount = 30 + ~~(cell.mass / 5);
    let points = [];
    for (let theta = 0; theta < FULL_ANGLE; theta += FULL_ANGLE / pointCount) {
        let point = circlePoint(cell, cell.radius, theta);
        points.push(regulatePoint(point, borders));
    }
    graph.beginPath();
    graph.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        graph.lineTo(points[i].x, points[i].y);
    }
    graph.closePath();
    graph.fill();
    graph.stroke();
};

const drawCells = (cells, playerConfig, toggleMassState, borders, graph) => {
    for (let cell of cells) {
        // Draw the cell itself
        graph.fillStyle = cell.color;
        graph.strokeStyle = cell.borderColor;
        graph.lineWidth = 6;
        if (cellTouchingBorders(cell, borders)) {
            // Asssemble the cell from lines
            drawCellWithLines(cell, borders, graph);
        } else {
            // Border corrections are not needed, the cell can be drawn as a circle
            drawRoundObject(cell, cell.radius, graph);
        }

        // Draw the name of the player
        let fontSize = Math.max(cell.radius / 3, 12);
        graph.lineWidth = playerConfig.textBorderSize;
        graph.fillStyle = playerConfig.textColor;
        graph.strokeStyle = playerConfig.textBorder;
        graph.miterLimit = 1;
        graph.lineJoin = "round";
        graph.textAlign = "center";
        graph.textBaseline = "middle";
        graph.font = "bold " + fontSize + "px sans-serif";
        // graph.strokeText(cell.name, cell.x, cell.y);
        // graph.fillText(cell.name, cell.x, cell.y);
        cell.skin = new Image();
        <div class="flex gap-4">
            <div
                id="noun5"
                class="w-1/2 cursor-pointer rounded-lg border hover:border-blue-500"
            >
                <img
                    src="https://res.cloudinary.com/brunoeleodoro/image/upload/v1720861295/noun_9.png"
                    class="rounded-lg"
                    data-name="noun5"
                />
            </div>
            <div
                id="noun6"
                class="w-1/2 cursor-pointer rounded-lg border hover:border-blue-500"
            >
                <img
                    src="https://res.cloudinary.com/brunoeleodoro/image/upload/v1720861295/noun_10.png"
                    class="rounded-lg"
                    data-name="noun6"
                />
            </div>
            <div
                id="noun7"
                class="w-1/2 cursor-pointer rounded-lg border hover:border-blue-500"
            >
                <img
                    src="https://res.cloudinary.com/brunoeleodoro/image/upload/v1720861295/noun_6.png"
                    class="rounded-lg"
                    data-name="noun7"
                />
            </div>
            <div
                id="noun8"
                class="w-1/2 cursor-pointer rounded-lg border hover:border-blue-500"
            >
                <img
                    src="https://res.cloudinary.com/brunoeleodoro/image/upload/v1720861295/noun_7.png"
                    class="rounded-lg"
                    data-name="noun8"
                />
            </div>
        </div>;
        if (cell.img === "noun1") {
            cell.skin.src =
                "https://res.cloudinary.com/brunoeleodoro/image/upload/v1720774464/noun_1.png";
        } else if (cell.img === "noun2") {
            cell.skin.src =
                "https://res.cloudinary.com/brunoeleodoro/image/upload/v1720774464/noun_2.png";
        } else if (cell.img === "noun3") {
            cell.skin.src =
                "https://res.cloudinary.com/brunoeleodoro/image/upload/v1720774464/noun.png";
        } else if (cell.img === "noun4") {
            cell.skin.src =
                "https://res.cloudinary.com/brunoeleodoro/image/upload/v1720774464/noun_3.png";
        } else if (cell.img === "noun5") {
            cell.skin.src =
                "https://res.cloudinary.com/brunoeleodoro/image/upload/v1720861295/noun_9.png";
        } else if (cell.img === "noun6") {
            cell.skin.src =
                "https://res.cloudinary.com/brunoeleodoro/image/upload/v1720861295/noun_10.png";
        } else if (cell.img === "noun7") {
            cell.skin.src =
                "https://res.cloudinary.com/brunoeleodoro/image/upload/v1720861295/noun_6.png";
        } else if (cell.img === "noun8") {
            cell.skin.src =
                "https://res.cloudinary.com/brunoeleodoro/image/upload/v1720861295/noun_7.png";
        }

        graph.save();
        graph.beginPath();
        graph.arc(cell.x, cell.y, cell.radius, 0, FULL_ANGLE);
        graph.clip();
        graph.drawImage(
            cell.skin,
            cell.x - cell.radius,
            cell.y - cell.radius,
            2 * cell.radius,
            2 * cell.radius
        );
        graph.restore();

        // graph.drawImage(cell.skin, cell.x - cell.radius, cell.y - cell.radius, 2 * cell.radius, 2 * cell.radius);
        // }

        // Draw the mass (if enabled)
        if (toggleMassState === 1) {
            graph.font =
                "bold " + Math.max((fontSize / 3) * 2, 10) + "px sans-serif";
            if (cell.name.length === 0) fontSize = 0;
            graph.strokeText(Math.round(cell.mass), cell.x, cell.y + fontSize);
            // TODO: bring back the text if you want
            graph.fillText(Math.round(cell.mass), cell.x, cell.y + fontSize);
        }
    }
};

const drawGrid = (global, player, screen, graph) => {
    graph.lineWidth = 1;
    graph.strokeStyle = global.lineColor;
    graph.globalAlpha = 0.15;
    graph.beginPath();

    for (let x = -player.x; x < screen.width; x += screen.height / 18) {
        graph.moveTo(x, 0);
        graph.lineTo(x, screen.height);
    }

    for (let y = -player.y; y < screen.height; y += screen.height / 18) {
        graph.moveTo(0, y);
        graph.lineTo(screen.width, y);
    }

    graph.stroke();
    graph.globalAlpha = 1;
};

const drawBorder = (borders, graph) => {
    graph.lineWidth = 1;
    graph.strokeStyle = "#000000";
    graph.beginPath();
    graph.moveTo(borders.left, borders.top);
    graph.lineTo(borders.right, borders.top);
    graph.lineTo(borders.right, borders.bottom);
    graph.lineTo(borders.left, borders.bottom);
    graph.closePath();
    graph.stroke();
};

const drawErrorMessage = (message, graph, screen) => {
    graph.fillStyle = "#333333";
    graph.fillRect(0, 0, screen.width, screen.height);
    graph.textAlign = "center";
    graph.fillStyle = "#FFFFFF";
    graph.font = "bold 30px sans-serif";
    graph.fillText(message, screen.width / 2, screen.height / 2);
};

module.exports = {
    drawFood,
    drawVirus,
    drawFireFood,
    drawCells,
    drawErrorMessage,
    drawGrid,
    drawBorder,
};
