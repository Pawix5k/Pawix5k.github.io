// import { Grid } from './grid.js'
// import { Cell } from './cell.js'


var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");


c.width = window.innerWidth;
c.height = window.innerHeight;



window.addEventListener('resize', adjustCanvasSize);
//window.addEventListener('pointerdown', logCoordinates);

// c.addEventListener('mousedown', (event) => {
//     move.loadNewDownInput(event.offsetX, event.offsetY);
// });

// c.addEventListener('mousemove', (event) => {
//     move.loadNewMoveInput(event.offsetX, event.offsetY);
// });

// c.addEventListener('mouseup', (event) => {
//     console.log('and here');
//     move.loadNewUpInput(event.offsetX, event.offsetY);
// });


// c.addEventListener('touchstart', (event) => {
//     event.preventDefault();
//     console.log(event.changedTouches[0].pageX);
//     move.loadNewDownInput(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
// });

// c.addEventListener('touchmove', (event) => {
//     event.preventDefault();
//     move.loadNewMoveInput(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
// });

// c.addEventListener('touchend', (event) => {
//     event.preventDefault();
//     console.log('here');
//     move.loadNewUpInput(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
// });

var state = "menu";

var levelsData = [
    [6, 6, [[0, 0, "right", 0], [0, 2, "right", 2], [2, 2, "right", 2], [1, 5, "right", 2]]],
    [6, 6, [[0, 0, "right", 0], [0, 2, "right", 2], [2, 2, "right", 2], [1, 5, "right", 3]]],
    [6, 6, [[0, 0, "right", 0], [0, 2, "right", 2], [2, 2, "right", 2], [1, 5, "right", 4]]],
    [6, 6, [[0, 0, "right", 0], [0, 2, "right", 2], [2, 2, "right", 2], [1, 5, "right", 5]]]];


c.addEventListener('mousedown', (event) => {
    //move.loadNewDownInput(event.offsetX, event.offsetY);
    handleStartInput(event.offsetX, event.offsetY)
});

c.addEventListener('mousemove', (event) => {
    //move.loadNewMoveInput(event.offsetX, event.offsetY);
    handleMoveInput(event.offsetX, event.offsetY);
});

c.addEventListener('mouseup', (event) => {
    //move.loadNewUpInput(event.offsetX, event.offsetY);
    handleEndInput(event.offsetX, event.offsetY);
});


c.addEventListener('touchstart', (event) => {
    event.preventDefault();
    //move.loadNewDownInput(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
    handleStartInput(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
});

c.addEventListener('touchmove', (event) => {
    event.preventDefault();
    //move.loadNewMoveInput(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
    handleMoveInput(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
});

c.addEventListener('touchend', (event) => {
    event.preventDefault();
    //move.loadNewUpInput(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
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

    cells;

    cellSize;
    basicMargin = 32;
    cellsX;
    cellsY;
    topSpaceHeight;
    cellsContainerTranslationX;
    cellsContainerTranslationY;

    buttons = [new Button("to-menu"), new Button("clear-cells")];


    constructor(x, y, cluesArray) {
        let cells = [];
        for (let i = 0; i < x; i++) {
            let col = [];
            for (let j = 0; j < y; j++) {
                col.push(new Cell(ctx, c));
            }
            cells.push(col);
        }

        cluesArray.forEach((element) => {
            let x = element[0];
            let y = element[1];
            let clueDirection = element[2];
            let clueNumber = element[3];

            cells[x][y].lines.add('clue');
            cells[x][y].clueDirection = clueDirection;
            cells[x][y].clueNumber = clueNumber;
        });

        this.cells = cells;
        this.cellsX = x;
        this.cellsY = y;
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
        ctx.fillStyle = "floralwhite";

        for (let i = 0; i < this.cellsX; i++) {
            for (let j = 0; j < this.cellsY; j++) {
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
        let x = parseInt((coordinate_x - this.cellsContainerTranslationX) / this.cellSize);
        let y = parseInt((coordinate_y - this.cellsContainerTranslationY) / this.cellSize);

        return [x, y];
    }

    clearCells() {
        // this.cells.forEach((col) => {
        //     col.forEach((cell) => {
        //         console.log('d');
        //         cell.clear();
        //     });
        // });
        for (let i = 0; i < this.cellsX; i++) {
            for (let j = 0; j < this.cellsY; j++) {
                this.cells[i][j].clear();
            }
        }
        this.drawCells();
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
                console.log(console.log(this));
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

    draw() {
        // border
        ctx.fillStyle = this.color;
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

        //place for validator
        this.startCell = cellCoordinates;
        this.pointerDown = true;

        //grid.drawBoard();
    }

    //loadNewMoveInput(grid, coordinateX, coordinateY) {
    loadNewMoveInput(coordinateX, coordinateY) {
        //place for validator
        if (this.pointerDown) {
            let cellCoordinates = grid.convertCoordinatesToCells(coordinateX, coordinateY);

            if (this.startCell[0] != cellCoordinates[0] || this.startCell[1] != cellCoordinates[1]) {
                this.leftOriginalCell = true;
                if (this.transitCell == null) {
                    let direction = (directionInOriginalCell(this.startCell, cellCoordinates));
                    if (grid.cells[this.startCell[0]][this.startCell[1]].lines.has(direction)) {
                        this.erasing = true;
                    }
                }
                this.transitCell = cellCoordinates;
                
                // let x1 = this.startCell[0];
                // let y1 = this.startCell[1];

                // let x2 = this.transitCell[0];
                // let y2 = this.transitCell[1];

                // grid.cells[x1][y1].color = "blue";
                // grid.cells[x2][y2].color = "green";

                //this.resolveLinesInCells(grid);
                this.resolveLinesInCells();

                //grid.drawBoard();

                this.startCell = cellCoordinates;
            }
        }
    }

    //loadNewUpInput(grid, coordinateX, coordinateY) {
    loadNewUpInput(coordinateX, coordinateY) {
        if (this.leftOriginalCell == false) {
            let cellCoordinates = grid.convertCoordinatesToCells(coordinateX, coordinateY);

            grid.cells[cellCoordinates[0]][cellCoordinates[1]].click();
            grid.cells[cellCoordinates[0]][cellCoordinates[1]].draw();
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
    index;

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
                initializeGame(this.index);
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
        levelsData.forEach((element, index) => {
            let btn = new Button("level");
            btn.index = index;
            this.levelButtons.push(btn)
        });
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
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, c.width, c.height);
        //top bar
        ctx.fillStyle = "crimson";
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


function initializeGame(index) {
    state = "game";
    move = new Move();
    grid = new Grid(levelsData[index][0], levelsData[index][1], levelsData[index][2]);

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