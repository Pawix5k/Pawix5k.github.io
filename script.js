var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");


c.width = window.innerWidth;
c.height = window.innerHeight;



window.addEventListener('resize', adjustCanvasSize);

var state = "menu";

var levelsData = new Map()
levelsData.set("tutorial", [4, 4, [[0, 0, "right", 0], [0, 2, "down", 1], [3, 3, "up", 1]],
'[[["clue"],["solid"],["clue"],["solid"]],\
[["down","right"],["down","up"],["down","up"],["right","up"]],\
[["left","right"],["down","right"],["down","up"],["left","up"]],\
[["down","left"],["left","up"],["solid"],["clue"]]]'
]);
levelsData.set("manual1", [6, 6, [[0, 0, "right", 0], [0, 2, "right", 2], [2, 2, "right", 2], [1, 5, "right", 2]],
'[[["clue"],["solid"],["clue"],["down","right"],["right","up"],["solid"]],\
[["down","right"],["down","up"],["down","up"],["left","up"],["left","right"],["clue"]],\
[["down","left"],["right","up"],["clue"],["down","right"],["left","up"],["solid"]],\
[["down","right"],["left","up"],["solid"],["down","left"],["down","up"],["right","up"]],\
[["left","right"],["down","right"],["down","up"],["right","up"],["down","right"],["left","up"]],\
[["down","left"],["left","up"],["solid"],["down","left"],["left","up"],["solid"]]]'
]);
levelsData.set("manual2", [6, 8, [[0, 7, "right", 1], [1, 2, "up", 1], [3, 2, "down", 3], [5, 4, "up", 0]],
'[[["down","right"],["down","up"],["down","up"],["down","up"],["down","up"],["down","up"],["right","up"],["clue"]],\
[["left","right"],["solid"],["clue"],["down","right"],["down","up"],["right","up"],["down","left"],["right","up"]],\
[["left","right"],["down","right"],["down","up"],["left","up"],["down","right"],["left","up"],["down","right"],["left","up"]],\
[["left","right"],["left","right"],["clue"],["solid"],["left","right"],["solid"],["left","right"],["solid"]],\
[["left","right"],["down","left"],["down","up"],["right","up"],["down","left"],["right","up"],["down","left"],["right","up"]],\
[["down","left"],["down","up"],["down","up"],["left","up"],["clue"],["down","left"],["down","up"],["left","up"]]]'
]);
levelsData.set("manual3", [7, 10, [[0, 6, "down", 0], [1, 1, "right", 2], [2, 6, "up", 1], [3, 2, "left", 0], [3, 4, "right", 2], [4, 7, "left", 0], [5, 4, "down", 2], [5, 6, "down", 2], [6, 9, "left", 2]],
'[[["down","right"],["down","up"],["down","up"],["down","up"],["down","up"],["right","up"],["clue"],["down","right"],["down","up"],["right","up"]],\
[["left","right"],["clue"],["down","right"],["down","up"],["right","up"],["down","left"],["down","up"],["left","up"],["down","right"],["left","up"]],\
[["left","right"],["solid"],["down","left"],["right","up"],["down","left"],["right","up"],["clue"],["down","right"],["left","up"],["solid"]],\
[["down","left"],["right","up"],["clue"],["left","right"],["clue"],["down","left"],["right","up"],["down","left"],["down","up"],["right","up"]],\
[["down","right"],["left","up"],["down","right"],["left","up"],["solid"],["down","right"],["left","up"],["clue"],["down","right"],["left","up"]],\
[["left","right"],["solid"],["down","left"],["right","up"],["clue"],["left","right"],["clue"],["solid"],["left","right"],["solid"]],\
[["down","left"],["down","up"],["down","up"],["left","up"],["solid"],["down","left"],["down","up"],["down","up"],["left","up"],["clue"]]]'
]);

// var solutionStr = '[[["clue"],["solid"],["clue"],["down","right"],["right","up"],["solid"]],\
// [["down","right"],["down","up"],["down","up"],["left","up"],["left","right"],["clue"]],\
// [["down","left"],["right","up"],["clue"],["down","right"],["left","up"],["solid"]],\
// [["down","right"],["left","up"],["solid"],["down","left"],["down","up"],["right","up"]],\
// [["left","right"],["down","right"],["down","up"],["right","up"],["down","right"],["left","up"]],\
// [["down","left"],["left","up"],["solid"],["down","left"],["left","up"],["solid"]]]';

// var solutionsStr2 = '[[["down","right"],["down","up"],["down","up"],["down","up"],["down","up"],["down","up"],["right","up"],["clue"]],\
// [["left","right"],["solid"],["clue"],["down","right"],["down","up"],["right","up"],["down","left"],["right","up"]],\
// [["left","right"],["down","right"],["down","up"],["left","up"],["down","right"],["left","up"],["down","right"],["left","up"]],\
// [["left","right"],["left","right"],["clue"],["solid"],["left","right"],["solid"],["left","right"],["solid"]],\
// [["left","right"],["down","left"],["down","up"],["right","up"],["down","left"],["right","up"],["down","left"],["right","up"]],\
// [["down","left"],["down","up"],["down","up"],["left","up"],["clue"],["down","left"],["down","up"],["left","up"]]]';

// var solutionStr3 = '[[["down","right"],["down","up"],["down","up"],["down","up"],["down","up"],["right","up"],["clue"],["down","right"],["down","up"],["right","up"]],\
// [["left","right"],["clue"],["down","right"],["down","up"],["right","up"],["down","left"],["down","up"],["left","up"],["down","right"],["left","up"]],\
// [["left","right"],["solid"],["down","left"],["right","up"],["down","left"],["right","up"],["clue"],["down","right"],["left","up"],["solid"]],\
// [["down","left"],["right","up"],["clue"],["left","right"],["clue"],["down","left"],["right","up"],["down","left"],["down","up"],["right","up"]],\
// [["down","right"],["left","up"],["down","right"],["left","up"],["solid"],["down","right"],["left","up"],["clue"],["down","right"],["left","up"]],\
// [["left","right"],["solid"],["down","left"],["right","up"],["clue"],["left","right"],["clue"],["solid"],["left","right"],["solid"]],\
// [["down","left"],["down","up"],["down","up"],["left","up"],["solid"],["down","left"],["down","up"],["down","up"],["left","up"],["clue"]]]';

// varSolutionStrTutorial = '[[["clue"],["solid"],["clue"],["solid"]],\
// [["down","right"],["down","up"],["down","up"],["right","up"]],\
// [["left","right"],["down","right"],["down","up"],["left","up"]],\
// [["down","left"],["left","up"],["solid"],["clue"]]]';


// var levelsData = [
//     [6, 6, [[0, 0, "right", 0], [0, 2, "right", 2], [2, 2, "right", 2], [1, 5, "right", 2]]],
//     [6, 6, [[0, 0, "right", 0], [0, 2, "right", 2], [2, 2, "right", 2], [1, 5, "right", 3]]],
//     [6, 6, [[0, 0, "right", 0], [0, 2, "right", 2], [2, 2, "right", 2], [1, 5, "right", 4]]],
//     [6, 6, [[0, 0, "right", 0], [0, 2, "right", 2], [2, 2, "right", 2], [1, 5, "right", 5]]]
// ];


c.addEventListener('mousedown', (event) => {
    handleStartInput(event.offsetX, event.offsetY)
});

c.addEventListener('mousemove', (event) => {
    handleMoveInput(event.offsetX, event.offsetY);
});

c.addEventListener('mouseup', (event) => {
    handleEndInput(event.offsetX, event.offsetY);
});


c.addEventListener('touchstart', (event) => {
    event.preventDefault();
    handleStartInput(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
});

c.addEventListener('touchmove', (event) => {
    event.preventDefault();
    handleMoveInput(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
});

c.addEventListener('touchend', (event) => {
    event.preventDefault();
    handleEndInput(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
});


function handleStartInput(x, y) {
    switch (state) {
        case 'menu':
            break;
        case 'game':
            move.loadNewDownInput(x, y);
            break;
    }
}

function handleMoveInput(x, y) {
    switch (state) {
        case 'menu':
            break;
        case 'game':
            move.loadNewMoveInput(x, y);
            break;
    }
}


function handleEndInput(x, y) {
    switch (state) {
        case 'menu':
            menu.checkCollisionWithButtons(x, y);
            break;
        case 'game':
            grid.checkCollisionWithButtons(x, y);
            move.loadNewUpInput(x, y);
            break;
    }
}


function adjustCanvasSize() {
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    switch (state) {
        case "menu":
            menu.calculateTopSpaceHeight();
            menu.calculateContainerVariables();
            menu.calculateButtonsPositionsAndSize(4);
            menu.draw();
            break;
        case "game":
            grid.calculateAllAndDraw();
            break;
    }
}


class Grid {
    name;
    cells;

    cellSize;
    basicMargin = 32;
    cellsX;
    cellsY;
    topSpaceHeight;
    cellsContainerTranslationX;
    cellsContainerTranslationY;

    playerSolution;
    correctSolutionStr;
    solved = false;

    buttons = [new Button("to-menu"), new Button("clear-cells")];


    constructor(name, levelData) {
        let x = levelData[0];
        let y = levelData[1];
        let cluesArray = levelData[2];
        let correctSolutionStr = levelData[3];
        
        let cells = [];
        for (let i = 0; i < x; i++) {
            let col = [];
            for (let j = 0; j < y; j++) {
                col.push(new Cell());
            }
            cells.push(col);
        }

        let playerSolution = []
        for (let i = 0; i < x; i++) {
            let col = [];
            for (let j = 0; j < y; j++) {
                col.push([]);
            }
            playerSolution.push(col);
        }

        cluesArray.forEach((element) => {
            let x = element[0];
            let y = element[1];
            let clueDirection = element[2];
            let clueNumber = element[3];

            cells[x][y].lines.add('clue');
            cells[x][y].clueDirection = clueDirection;
            cells[x][y].clueNumber = clueNumber;

            playerSolution[x][y].push('clue');
        });

        this.name = name;
        this.correctSolutionStr = correctSolutionStr;
        this.playerSolution = playerSolution;
        this.cells = cells;
        this.cellsX = x;
        this.cellsY = y;
    }

    saveDataToLocalStorage() {
        window.localStorage.setItem(this.name, JSON.stringify(this.playerSolution));
    }

    retrieveDataFromLocalStorage() {
        let data = window.localStorage.getItem(this.name);
        if (data) {
            data = JSON.parse(data);
            for (let i = 0; i < this.cellsX; i++) {
                for (let j = 0; j < this.cellsY; j++) {
                    this.cells[i][j].lines.clear();
                    this.playerSolution[i][j] = [];
                    for (const info of data[i][j]) {
                        this.cells[i][j].lines.add(info);
                        this.playerSolution[i][j].push(info);
                    }
                }
            }
        }
        grid.drawBoard();
        this.manageSolvedState();
    }

    checkIfSolved() {
        console.log(JSON.stringify(grid.playerSolution) == this.correctSolutionStr);
        return JSON.stringify(grid.playerSolution) == this.correctSolutionStr;
    }

    manageSolvedState() {
        let solved = this.checkIfSolved();
        if (this.solved == false && solved == true) {
            this.solved = solved;
            grid.changeCellsColorAndDraw("limegreen");
        }
        else if (this.solved == true && solved == false) {
            this.solved = solved;
            grid.changeCellsColorAndDraw("floralwhite");
        }
        this.saveDataToLocalStorage();
    }

    checkIfValidCell(x, y) {
        return (x >= 0 && x < this.cellsX && y >= 0 && y < this.cellsY)
    }

    createArrayOfSolve() {
        let arr = [];
        for (let i = 0; i < this.cellsX; i++) {
            let col = [];
            for (let j = 0; j < this.cellsY; j++) {
                col.push(Array.from(this.cells[i][j].lines).sort());
            }
            arr.push(col);
        }

        let str = '[';
        for (const line of arr) {
            str += JSON.stringify(line) + ',\\\n';
        }
        str = str.slice(0, -3);
        str += ']';

        console.log(str);
    }

    checkCollisionWithButtons(x, y) {
        this.buttons.forEach((element) => {
            if (x >= element.x && x <= element.x + element.size && y >= element.y && y <= element.y + element.size) {
                element.triggerAction();
            }
        });
    }

    calculateAllAndDraw() {
        grid.calculateCellsSizeAndMargins();
        grid.calculateCellsPositions();
        grid.calculateButtonsPositionsAndSize();
        grid.drawBoard()
    }

    calculateButtonsPositionsAndSize() {
        let size = fitRectInSpace(1, 1, c.width, this.topSpaceHeight, this.basicMargin)[0];
        this.buttons[0].size = size;
        this.buttons[0].x = this.basicMargin;
        this.buttons[0].y = this.basicMargin;

        let rightButtonPosX = c.width - size - this.basicMargin;
        this.buttons[1].size = size;
        this.buttons[1].x = rightButtonPosX;
        this.buttons[1].y = this.basicMargin;
    }

    calculateCellsSizeAndMargins() {
        let topSpaceHeight = parseInt(0.16 * c.height);

        this.basicMargin = Math.floor(0.035 * c.height);

        let boardSizes = fitRectInSpace(this.cellsX, this.cellsY, c.width, c.height - topSpaceHeight, this.basicMargin);
        let boardSizeX = boardSizes[0];
        let boardSizeY = boardSizes[1];
        let cellSize = Math.min(parseInt(boardSizeX / this.cellsX), parseInt(boardSizeY / this.cellsY));

        this.topSpaceHeight = topSpaceHeight;
        this.cellSize = cellSize;
        this.cellsContainerTranslationX = parseInt((c.width - boardSizeX) / 2);
        this.cellsContainerTranslationY = parseInt((c.height - topSpaceHeight - boardSizeY) / 2 + topSpaceHeight);
    }

    calculateCellsPositions() {
        for (let i = 0; i < this.cellsX; i++) {
            for (let j = 0; j < this.cellsY; j++) {
                let pos_x = this.cellsContainerTranslationX + i * this.cellSize;
                let pos_y = this.cellsContainerTranslationY + j * this.cellSize;
                this.cells[i][j].pos_x = pos_x;
                this.cells[i][j].pos_y = pos_y;
                this.cells[i][j].size = this.cellSize;
                this.cells[i][j].center_x = pos_x + this.cellSize / 2;
                this.cells[i][j].center_y = pos_y + this.cellSize / 2;
            }
        }
    }

    drawBoard() {
        this.drawBackground();
        this.drawBorders();
        this.drawCells();

        //draw top bar
        ctx.fillStyle = "coral";
        ctx.fillRect(0, 0, c.width, this.topSpaceHeight); 

        //draw buttons
        this.buttons.forEach((element) => element.draw());
    }

    drawCells() {
        for (let i = 0; i < this.cellsX; i++) {
            for (let j = 0; j < this.cellsY; j++) {
                this.cells[i][j].draw();
            }
        }
    }

    changeCellsColorAndDraw(color) {
        for (let i = 0; i < this.cellsX; i++) {
            for (let j = 0; j < this.cellsY; j++) {
                this.cells[i][j].color = color;
                this.cells[i][j].draw();
            }
        }
    }

    drawBorders() {
        let x1 = this.cellsContainerTranslationX - 2;
        let y1 = this.cellsContainerTranslationY - 2;
        let x2 = this.cellsX * this.cellSize + 4;
        let y2 = this.cellsY * this.cellSize + 4;

        ctx.fillStyle = "black";
        ctx.fillRect(x1, y1, x2, y2);
    }

    drawBackground() {
        ctx.fillStyle = "crimson";
        ctx.fillRect(0, 0, c.width, c.height);
    }

    convertCoordinatesToCells(coordinate_x, coordinate_y) {
        let x = Math.floor((coordinate_x - this.cellsContainerTranslationX) / this.cellSize);
        let y = Math.floor((coordinate_y - this.cellsContainerTranslationY) / this.cellSize);

        return [x, y];
    }

    clearCells() {
        for (let i = 0; i < this.cellsX; i++) {
            for (let j = 0; j < this.cellsY; j++) {
                this.cells[i][j].clear();
                if (!this.playerSolution[i][j].includes("clue")) {
                    this.playerSolution[i][j] = [];
                }
            }
        }
        this.drawCells();
        this.manageSolvedState();
    }
}


class Cell {
    pos_x;
    pos_y;
    size;
    center_x;
    center_y;
    color = "floralwhite";
    solidColor = "#2A2A2A";

    clueDirection = null;
    clueNumber = null;

    lines = new Set();

    click() {
        if (this.lines.has('up') || this.lines.has('right') || this.lines.has('down') || this.lines.has('left')) {
            this.lines.clear();
            this.lines.add('solid');
        }
        else if (this.lines.has('solid')) {
            this.lines.clear();
        }
        else if (this.lines.has('non-solid')) {
            this.lines.clear();
            this.lines.add('solid');
        }
        else if (this.lines.size == 0) {
            this.lines.clear();
            this.lines.add('non-solid');
        }
    }

    put(direction) {
        if (this.lines.has('up') || this.lines.has('right') || this.lines.has('down') || this.lines.has('left')) {
            this.lines.add(direction);
        }
        else if (this.lines.has('solid')) {
            //pass
        }
        else if (this.lines.has('non-solid')) {
            this.lines.clear();
            this.lines.add(direction);
        }
        else if (this.lines.size == 0) {
            this.lines.add(direction);
        }
    }

    erase(direction) {
        if (this.lines.has(direction)) {
            this.lines.delete(direction);
        }
    }

    clear() {
        if (!(this.lines.has('clue'))) {
            this.lines.clear();
        }
    }

    drawLine(direction) {
        ctx.strokeStyle = "gray";
        ctx.fillStyle = "gray";
        ctx.lineWidth = 3;

        //console.log("drawing ", grid.convertCoordinatesToCells(this.pos_x, this.pos_y), " lines ", direction);

        switch (direction) {
            case 'up':
                ctx.fillRect(this.center_x - 2, this.center_y, 4, - this.size / 2 + 2);
                break;
            case 'right':
                ctx.fillRect(this.center_x, this.center_y - 2, this.size / 2 - 2, 4);
                break;
            case 'down':
                ctx.fillRect(this.center_x - 2, this.center_y, 4, this.size / 2 - 2);
                break;
            case 'left':
                ctx.fillRect(this.center_x, this.center_y - 2, - this.size / 2 + 2, 4);
                break;
            case 'solid':
                ctx.fillStyle = this.solidColor;
                ctx.fillRect(this.pos_x + 2, this.pos_y + 2, this.size - 4, this.size - 4);
                break;
            case 'non-solid':
                ctx.fillStyle = "gray";
                ctx.fillRect(this.center_x - 6, this.center_y - 6, 12, 12);
                break;
            case 'clue':
                ctx.fillStyle = this.solidColor;
                let font = (this.size * 0.55).toString().concat('px sans-serif');
                ctx.font = font;
                ctx.fillText(this.clueNumber.toString(), this.center_x - this.size * 0.3, this.center_y + this.size * 0.3);
                this.drawArrow();
                break;
            default:
                console.log(this);
        }
    }

    drawArrow() {
        if (this.clueDirection == 'up') {
            ctx.fillStyle = this.solidColor;
            ctx.fillRect(this.center_x + 0.2 * this.size, this.center_y + 0.3 * this.size, 0.06 * this.size, - 0.51 * this.size);

            ctx.beginPath();
            ctx.moveTo(this.center_x + 0.23 * this.size, this.center_y - 0.3 * this.size);
            ctx.lineTo(this.center_x + 0.15 * this.size, this.center_y - 0.2 * this.size);
            ctx.lineTo(this.center_x + 0.31 * this.size, this.center_y - 0.2 * this.size);
            ctx.fill();
        }
        if (this.clueDirection == 'right') {
            ctx.fillStyle = this.solidColor;
            ctx.fillRect(this.center_x - 0.3 * this.size, this.center_y - 0.2 * this.size, + 0.51 * this.size, - 0.06 * this.size);

            ctx.beginPath();
            ctx.moveTo(this.center_x + 0.3 * this.size, this.center_y - 0.23 * this.size);
            ctx.lineTo(this.center_x + 0.2 * this.size, this.center_y - 0.15 * this.size);
            ctx.lineTo(this.center_x + 0.2 * this.size, this.center_y - 0.31 * this.size);
            ctx.fill();
        }
        if (this.clueDirection == 'down') {
            ctx.fillStyle = this.solidColor;
            ctx.fillRect(this.center_x + 0.2 * this.size, this.center_y - 0.3 * this.size, 0.06 * this.size, + 0.51 * this.size);

            ctx.beginPath();
            ctx.moveTo(this.center_x + 0.23 * this.size, this.center_y + 0.3 * this.size);
            ctx.lineTo(this.center_x + 0.15 * this.size, this.center_y + 0.2 * this.size);
            ctx.lineTo(this.center_x + 0.31 * this.size, this.center_y + 0.2 * this.size);
            ctx.fill();
        }
        if (this.clueDirection == 'left') {
            ctx.fillStyle = this.solidColor;
            ctx.fillRect(this.center_x + 0.3 * this.size, this.center_y - 0.2 * this.size, - 0.51 * this.size, - 0.06 * this.size);

            ctx.beginPath();
            ctx.moveTo(this.center_x - 0.3 * this.size, this.center_y - 0.23 * this.size);
            ctx.lineTo(this.center_x - 0.2 * this.size, this.center_y - 0.15 * this.size);
            ctx.lineTo(this.center_x - 0.2 * this.size, this.center_y - 0.31 * this.size);
            ctx.fill();
        }
    }

    draw(color = this.color) {
        // border
        ctx.fillStyle = color;
        ctx.fillRect(this.pos_x + 2, this.pos_y + 2, this.size - 4, this.size - 4);
        this.lines.forEach(element => this.drawLine(element));
    }
}


class Move {
    startCell = null;
    transitCell = null;
    leftOriginalCell = false;
    pointerDown = false;
    erasing = false;

    //loadNewDownInput(grid, coordinateX, coordinateY) {
    loadNewDownInput(coordinateX, coordinateY) {
        let cellCoordinates = grid.convertCoordinatesToCells(coordinateX, coordinateY);

        if (grid.checkIfValidCell(cellCoordinates[0], cellCoordinates[1])) {
            this.startCell = cellCoordinates;
            this.pointerDown = true;
        }
    }

    //loadNewMoveInput(grid, coordinateX, coordinateY) {
    loadNewMoveInput(coordinateX, coordinateY) {
        let cellCoordinates = grid.convertCoordinatesToCells(coordinateX, coordinateY);

        if (this.pointerDown && grid.checkIfValidCell(cellCoordinates[0], cellCoordinates[1])) {
            if (this.startCell[0] != cellCoordinates[0] || this.startCell[1] != cellCoordinates[1]) {
                this.leftOriginalCell = true;
                if (this.transitCell == null) {
                    let direction = (directionInOriginalCell(this.startCell, cellCoordinates));
                    if (grid.cells[this.startCell[0]][this.startCell[1]].lines.has(direction)) {
                        this.erasing = true;
                    }
                }
                this.transitCell = cellCoordinates;

                this.resolveLinesInCells();

                let x1 = this.startCell[0];
                let y1 = this.startCell[1]
                let x2 = cellCoordinates[0];
                let y2 = cellCoordinates[1]

                grid.playerSolution[x1][y1] = Array.from(grid.cells[x1][y1].lines).sort();
                grid.playerSolution[x2][y2] = Array.from(grid.cells[x2][y2].lines).sort();

                this.startCell = cellCoordinates;
                console.log("move");
                grid.manageSolvedState();
            }
        }
    }

    //loadNewUpInput(grid, coordinateX, coordinateY) {
    loadNewUpInput(coordinateX, coordinateY) {
        console.log("UPP", coordinateX, coordinateY);
        console.log(grid.convertCoordinatesToCells(coordinateX, coordinateY));
        if (this.leftOriginalCell == false) {
            let cellCoordinates = grid.convertCoordinatesToCells(coordinateX, coordinateY);
            let x = cellCoordinates[0];
            let y = cellCoordinates[1];

            if (grid.checkIfValidCell(x, y)) {
                grid.cells[x][y].click();
                grid.cells[x][y].draw();
    
                grid.playerSolution[x][y] = Array.from(grid.cells[x][y].lines).sort();
    
                console.log("up");
                grid.manageSolvedState();
            }
        }

        this.startCell = null;
        this.transitCell = null;
        this.leftOriginalCell = false;
        this.pointerDown = false;
        this.erasing = false;



        //grid.drawBoard();
    }

    resolveLinesInCells() {
        let x1 = this.startCell[0];
        let y1 = this.startCell[1];

        let x2 = this.transitCell[0];
        let y2 = this.transitCell[1];

        if (this.erasing == false) {
            if (x1 == x2) {
                if (y1 > y2) {
                    grid.cells[x1][y1].put('up');
                    grid.cells[x2][y2].put('down');
                }
                else {
                    grid.cells[x1][y1].put('down');
                    grid.cells[x2][y2].put('up');
                }
            }
            else {
                if (x1 > x2) {
                    grid.cells[x1][y1].put('left');
                    grid.cells[x2][y2].put('right');
                }
                else {
                    grid.cells[x1][y1].put('right');
                    grid.cells[x2][y2].put('left');
                }
            }
        }
        else {
            if (x1 == x2) {
                if (y1 > y2) {
                    grid.cells[x1][y1].erase('up');
                    grid.cells[x2][y2].erase('down');
                }
                else {
                    grid.cells[x1][y1].erase('down');
                    grid.cells[x2][y2].erase('up');
                }
            }
            else {
                if (x1 > x2) {
                    grid.cells[x1][y1].erase('left');
                    grid.cells[x2][y2].erase('right');
                }
                else {
                    grid.cells[x1][y1].erase('right');
                    grid.cells[x2][y2].erase('left');
                }
            }
        }

        grid.cells[x1][y1].draw();
        grid.cells[x2][y2].draw();
    }
}


class Button {
    type;
    x;
    y;
    size;
    levelName;

    constructor(type) {
        this.type = type;
    }

    draw() {
        ctx.fillStyle = "beige";
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    triggerAction() {
        switch(this.type) {
            case "level":
                initializeGame(this.levelName);
                break;
            case "to-menu":
                initializeMenu();
                break;
            case "clear-cells":
                grid.clearCells();
                break;
        }
    }
}


class Menu {
    basicMargin = 32;
    topSpaceHeight;

    levelsContainerX;
    levelsContainerY;
    levelsContainerTranslationX;
    levelsContainerTranslationY;

    levelButtons = [];

    checkCollisionWithButtons(x, y) {
        this.levelButtons.forEach((element) => {
            if (x >= element.x && x <= element.x + element.size && y >= element.y && y <= element.y + element.size) {
                element.triggerAction();
            }
        });
    }

    addLevelButtons() {
        // levelsData.forEach((element, index) => {
        //     let btn = new Button("level");
        //     btn.index = index;
        //     this.levelButtons.push(btn)
        // });
        for (const name of levelsData.keys()) {
            let btn = new Button("level");
            btn.levelName = name;
            this.levelButtons.push(btn);
        }
    }

    calculateButtonsPositionsAndSize(nInRow) {
        let spacesToButtonsRatio = 0.4
        let buttonSize = parseInt(this.levelsContainerX / (nInRow + (nInRow + 1) * spacesToButtonsRatio));
        let spaceBetween = parseInt(spacesToButtonsRatio * buttonSize);
        
        for (let i = 0; i < this.levelButtons.length; i++) {
            let column = i % nInRow;
            let row = Math.floor(i/nInRow);

            this.levelButtons[i].size = buttonSize;
            this.levelButtons[i].x = this.levelsContainerTranslationX + (column + 1) * spaceBetween + column * buttonSize;
            this.levelButtons[i].y = this.levelsContainerTranslationY + (row + 1) * spaceBetween + row * buttonSize;
        }
    }

    draw() {
        ctx.fillStyle = "crimson";
        ctx.fillRect(0, 0, c.width, c.height);
        //top bar
        ctx.fillStyle = "coral";
        ctx.fillRect(0, this.topSpaceHeight, c.width, - this.topSpaceHeight);

        //bottom square
        ctx.fillStyle = "coral";
        ctx.fillRect(this.levelsContainerTranslationX, this.levelsContainerTranslationY, this.levelsContainerX, this.levelsContainerY);

        //levelButtons
        this.levelButtons.forEach(element => element.draw());
    }

    calculateContainerVariables() {
        let containerSizes = fitRectInSpace(1, 1, c.width, c.height - this.topSpaceHeight, this.basicMargin);
        this.levelsContainerX = containerSizes[0];
        this.levelsContainerY = containerSizes[1];

        this.levelsContainerTranslationX = parseInt((c.width - this.levelsContainerX) / 2);
        this.levelsContainerTranslationY = parseInt((c.height - this.topSpaceHeight - this.levelsContainerY) / 2 + this.topSpaceHeight);
    }

    calculateTopSpaceHeight() {
        this.topSpaceHeight = parseInt(0.16 * c.height);

        this.basicMargin = Math.floor(0.035 * c.height);
    }
}

function fitRectInSpace(rectX, rectY, spaceX, spaceY, margin) {
    if (rectX / rectY > (spaceX - 2 * margin) / (spaceY - 2 * margin)) {
        let x = spaceX - 2 * margin;
        let y = x  * rectY / rectX
        return [parseInt(x), parseInt(y)];
    }
    let y = spaceY - 2 * margin;
    let x = y  * rectX / rectY;
    return [parseInt(x), parseInt(y)];
}

function directionInOriginalCell(startCell, endCell) {
    let x1 = startCell[0];
    let y1 = startCell[1];

    let x2 = endCell[0];
    let y2 = endCell[1];

    if (x1 == x2) {
        if (y1 > y2) {
            return 'up'
        }
        else {
            return 'down'
        }
    }
    else {
        if (x1 > x2) {
            return 'left'
        }
        else {
            return 'right'
        }
    }
}

var move;
var grid;
var menu;


function initializeGame(levelName) {
    let levelData = levelsData.get(levelName);
    state = "game";
    move = new Move();
    grid = new Grid(levelName, levelData);
    grid.retrieveDataFromLocalStorage();

    grid.calculateAllAndDraw();
}

function initializeMenu() {
    state = "menu";
    menu = new Menu();
    menu.calculateTopSpaceHeight();
    menu.calculateContainerVariables();
    menu.addLevelButtons();
    menu.calculateButtonsPositionsAndSize(4);
    menu.draw();
}

initializeMenu();