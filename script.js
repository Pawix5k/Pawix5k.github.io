// import { Grid } from './grid.js'
// import { Cell } from './cell.js'


var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");


c.width = window.innerWidth;
c.height = window.innerHeight;

ctx.fillStyle = "crimson";
ctx.fillRect(0, 0, c.width, c.height);

window.addEventListener('resize', reportWindowSize);
//window.addEventListener('pointerdown', logCoordinates);

c.addEventListener('mousedown', (event) => {
    move.loadNewDownInput(event.offsetX, event.offsetY);
});

c.addEventListener('mousemove', (event) => {
    move.loadNewMoveInput(event.offsetX, event.offsetY);
});

c.addEventListener('mouseup', (event) => {
    console.log('and here');
    move.loadNewUpInput(event.offsetX, event.offsetY);
});


c.addEventListener('touchstart', (event) => {
    event.preventDefault();
    console.log(event.changedTouches[0].pageX);
    move.loadNewDownInput(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
});

c.addEventListener('touchmove', (event) => {
    event.preventDefault();
    move.loadNewMoveInput(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
});

c.addEventListener('touchend', (event) => {
    event.preventDefault();
    console.log('here');
    move.loadNewUpInput(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
});




// c.addEventListener('touchstart', (event) => {
// 	console.log(`Mouse X: ${event.pageX}, Mouse Y: ${event.pageY}`);

//     console.log(grid.convertCoordinatesToCells(event.offsetX, event.pageY));
//     move.loadNewDownInput(grid, event.pageX, event.pageY);

// });

// c.addEventListener('touchmove', (event) => {
// 	//console.log(`Mouse X: ${event.offsetX}, Mouse Y: ${event.offsetY}`);
//     move.loadNewMoveInput(grid, event.pageX, event.pageY);

// });

// c.addEventListener('touchend', (event) => {
// 	console.log(`Mouse X: ${event.pageX}, Mouse Y: ${event.pageY}`);
//     move.loadNewUpInput(grid, event.pageX, event.pageY);

// });




function reportWindowSize() {
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    grid.calculateCellSizeAndMargins(c.width, c.height);
    grid.calculateCellsPositions();
    grid.drawBoard();
}










class Grid {

    cells;

    cell_size;
    basic_margin = 32;
    left_margin;
    top_margin;
    border_width = 5;
    buttonTopMargin;
    buttonLeftMargin;
    buttonSize;

    cells_x;
    cells_y;

    constructor(x, y) {
        let cells = [];
        for (let i = 0; i < x; i++) {
            let col = [];
            for (let j = 0; j < y; j++) {
                col.push(new Cell(ctx, c));
            }
            cells.push(col);
        }

        this.cells = cells;
        this.cells_x = x;
        this.cells_y = y;
    }

    drawButton() {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.buttonTopMargin, this.buttonTopMargin, this.buttonSize, this.buttonSize);

        ctx.fillStyle = "blue";
        ctx.fillRect(c.width - this.buttonTopMargin - this.buttonSize, this.buttonTopMargin, this.buttonSize, this.buttonSize);
    }

    calculateCellSizeAndMargins(canvas_width, canvas_height) {
        this.buttonSize = parseInt(0.18 * Math.min(canvas_width, canvas_height));
        this.buttonTopMargin = parseInt(0.03 * Math.min(canvas_width, canvas_height));
        this.buttonLeftMargin = parseInt(0.3 * canvas_width);

        // vertical fit first
        let verticalSpace = canvas_height - 2 * this.buttonTopMargin - this.buttonSize - 2 * this.basic_margin;
        let cell_size = parseInt(verticalSpace / this.cells_y);
        let width_threshold = cell_size * this.cells_x + 2 * this.basic_margin;

        // horizontal fit if vertical failed
        if (width_threshold > canvas_width) {
            let horizontalSpace = canvas_width - 2 * this.basic_margin;
            cell_size = parseInt(horizontalSpace / this.cells_x);
        }

        let left_margin = parseInt((canvas_width - this.cells_x * cell_size) / 2);
        let top_margin = parseInt((verticalSpace - this.cells_y * cell_size) / 2 + 2 * this.buttonTopMargin + this.buttonSize);

        this.cell_size = cell_size;
        this.left_margin = left_margin;
        this.top_margin = top_margin;
    }

    calculateCellsPositions() {
        for (let i = 0; i < this.cells_x; i++) {
            for (let j = 0; j < this.cells_y; j++) {
                let pos_x = this.left_margin + i * this.cell_size;
                let pos_y = this.top_margin + j * this.cell_size;
                this.cells[i][j].pos_x = pos_x;
                this.cells[i][j].pos_y = pos_y;
                this.cells[i][j].size = this.cell_size;
                this.cells[i][j].center_x = pos_x + this.cell_size / 2;
                this.cells[i][j].center_y = pos_y + this.cell_size / 2;
            }
        }
    }

    drawBoard() {
        this.drawBackground();
        this.drawBorders();
        this.drawCells();
        this.drawButton();
    }

    drawCells() {
        ctx.fillStyle = "floralwhite";

        for (let i = 0; i < this.cells_x; i++) {
            for (let j = 0; j < this.cells_y; j++) {
                this.cells[i][j].draw();
            }
        }
    }

    drawBorders() {
        let x1 = this.left_margin - 2;
        let y1 = this.top_margin - 2;
        let x2 = this.cells_x * this.cell_size + 4;
        let y2 = this.cells_y * this.cell_size + 4;

        ctx.fillStyle = "black";
        ctx.fillRect(x1, y1, x2, y2);
    }

    drawBackground() {
        ctx.fillStyle = "crimson";
        ctx.fillRect(0, 0, c.width, c.height);
    }

    convertCoordinatesToCells(coordinate_x, coordinate_y) {
        let x = parseInt((coordinate_x - this.left_margin) / this.cell_size);
        let y = parseInt((coordinate_y - this.top_margin) / this.cell_size);

        return [x, y];
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

    // 0 = up, 1 = right, 2 = down, 3 = left, 4 = solid, 5 = non-solid
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

    drawLine(direction) {
        ctx.strokeStyle = "gray";
        ctx.fillStyle = "gray";
        ctx.lineWidth = 3;

        console.log("drawing ", grid.convertCoordinatesToCells(this.pos_x, this.pos_y), " lines ", direction);

        // switch (direction) {
        //     case 'up':
        //         //ctx.strokeStyle = "yellow";// ???????????????????????????

        //         ctx.moveTo(this.center_x, this.center_y);
        //         ctx.lineTo(this.center_x, this.center_y - this.size / 2 + 2);
        //         ctx.stroke();
        //         break;
        //     case 'right':
        //         ctx.moveTo(this.center_x, this.center_y);
        //         ctx.lineTo(this.center_x + this.size / 2 - 2, this.center_y);
        //         ctx.stroke();
        //         break;
        //     case 'down':
        //         ctx.moveTo(this.center_x, this.center_y);
        //         ctx.lineTo(this.center_x, this.center_y + this.size / 2 - 2);
        //         ctx.stroke();
        //         break;
        //     case 'left':
        //         ctx.moveTo(this.center_x, this.center_y);
        //         ctx.lineTo(this.center_x - this.size / 2 + 2, this.center_y);
        //         ctx.stroke();
        //         break;
        //     case 'solid':
        //         ctx.fillStyle = this.solidColor;
        //         ctx.fillRect(this.pos_x + 2, this.pos_y + 2, this.size - 4, this.size - 4);
        //         break;
        //     case 'non-solid':
        //         ctx.fillStyle = this.solidColor;
        //         ctx.fillRect(this.center_x - 6, this.center_y - 6, 12, 12);
        //         break;
        //     default:
        //         console.log('default');
        //   }

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
                console.log(font);
                ctx.font = font;
                ctx.fillText(this.clueNumber.toString(), this.center_x - this.size * 0.3, this.center_y + this.size * 0.3);
                this.drawArrow();
            default:
                console.log('default');
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

        console.log(grid.cells[0][0]);
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


var move = new Move();
var grid = new Grid(6, 9);

// grid.cells[0][0].border_color = "blue";
// grid.cells[1][2].border_color = "red";

grid.calculateCellSizeAndMargins(c.width, c.height);
grid.calculateCellsPositions();
grid.cells[0][0].lines.add('clue');
grid.cells[0][0].clueDirection = 'right';
grid.cells[0][0].clueNumber = 0;

grid.cells[0][2].lines.add('clue');
grid.cells[0][2].clueDirection = 'right';
grid.cells[0][2].clueNumber = 2;

grid.cells[2][2].lines.add('clue');
grid.cells[2][2].clueDirection = 'right';
grid.cells[2][2].clueNumber = 2;

grid.cells[1][5].lines.add('clue');
grid.cells[1][5].clueDirection = 'right';
grid.cells[1][5].clueNumber = 2;

// grid.drawCells();
// grid.drawBorders();

grid.drawBoard()


