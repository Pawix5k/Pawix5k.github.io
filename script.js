var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");


c.width = window.innerWidth;
c.height = window.innerHeight;

// var colors = {
//     winningCell: ""
// }



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


var tutorialStateArray;


var tutorialSubtitles = [
    ['Goal of this game is to draw a single', 'loop going through each cell.'],
    ['Number in clue indicates how many black',
     'blocks are between them and the puzzle',
     'wall indicated by the arrow direction.'],
    ['You must fill all the empty cells with', 'either lines, or black blocks.'],
    ['Click/tap twice on empty cell, or once',
     'on occupied cell to draw black block.'],
    ['Each segment of the loop contains lines',
     'going out in two directions. Slide over',
     'the cells to draw a line. Slide again to',
     'erase it.'],
    ['You can place a marker meaning the cell',
     'cannot be occupied by a black block.'],
    ['You cannot place two black blocks next',
     'to each other (sharing sides)...'],
    ['but tou can place them diagonally', '(touching corners).'],
    ['You can place a black block next to a', 'clue cell.'],
    ['Clue with 0 and arrow pointing right',
     'means there are no black blocks in the',
     'yellow area.'],
    ['Clue with 1 and arrow pointing up means',
     'there is exactly one black block in the',
     'yellow area, but we do not know where',
     'yet.'],
    ['Clue with 1 and arrow pointing down', 'points to only one cell...'],
    ['so we know we must place a black block', 'there.'],
    ['We can mark the cell next to the black',
     'block, since we know we cannot place',
     'another black block next to it, or solve',
     'it rightaway.'],
    ['Each segment of the loop contains 2',
     'lines going in different directions.We',
     'cannot go left (black block) or down',
     '(wall) so we can only go up and right.'],
    ['The only possible direction for this',
     'section of line is up (clue on the',
     'right, wall of the puzzle below).'],
    ['We cannot link the line to make a loop',
     'yet, because we would leftremaining',
     'cells blank...'],
    ['So we can only make this segment of the', 'loop go up.'],
    ['This clue indicates there cannot be any',
     'black blocks in the yellow area, so',
     'wecan put markers on the cells inside',
     'it...'],
    ['and then solve like the previous parts.'],
    ['Yellow cell on the left is blocked from',
     'all 4 sides, and the yellow cell on the',
     'right is the only empty cell left',
     'pointed by the right bottom clue...'],
    ['which means we must place black blocks', 'in them.'],
    ['We can finally link two ends of the', 'line and solve the puzzle.']
];

var tutorialSubtitlesMaxLength = longestSubtitle();

function longestSubtitle() {
    let maxLength = 0;
    for (let i = 0; i < tutorialSubtitles.length; i++) {
        for (let j = 0; j < tutorialSubtitles[i].length; j++) {
            console.log(tutorialSubtitles[i][j]);
            if (tutorialSubtitles[i][j].length > maxLength) {
                maxLength = tutorialSubtitles[i][j].length;
            }
        }
    }

    return maxLength;
}



function loadTutorialStateArray() {
    tutorialStateArray = [];

    tutorialStateArray.push([]);
    tutorialStateArray.push([]);
    tutorialStateArray.push([]);
    tutorialStateArray.push([[1, 1, "solid"]]);
    
    tutorialStateArray.push([[1, 1, "down"], [1, 1, "right"]]);
    tutorialStateArray.push([[1, 1, "non-solid"]]);
    tutorialStateArray.push([[1, 1, "solid"], [2, 1, "solid"]]);
    tutorialStateArray.push([[1, 1, "solid"], [2, 2, "solid"]]);
    
    tutorialStateArray.push([[1, 2, "solid"]]);
    tutorialStateArray.push([]);
    tutorialStateArray.push([]);
    tutorialStateArray.push([]);
    
    tutorialStateArray.push([[0, 3, "solid"]]);
    tutorialStateArray.push([[0, 3, "solid"], [1, 3, "non-solid"]]);
    tutorialStateArray.push([[0, 3, "solid"], [1, 2, "down"], [1, 3, "up"], [1, 3, "right"],
        [2, 3, "left"]
    ]);
    tutorialStateArray.push([[0, 3, "solid"], [1, 2, "down"], [1, 3, "up"], [1, 3, "right"],
        [2, 3, "left"], [2, 3, "up"], [2, 2, "down"]
    ]);
    
    
    tutorialStateArray.push([[0, 3, "solid"], [1, 2, "down"], [1, 3, "up"], [1, 3, "right"],
        [2, 3, "left"], [2, 3, "up"], [2, 2, "down"], [1, 2, "right"], [2, 2, "left"]
    ]);
    tutorialStateArray.push([[0, 3, "solid"], [1, 2, "down"], [1, 3, "up"], [1, 3, "right"],
        [2, 3, "left"], [2, 3, "up"], [2, 2, "down"], [1, 2, "up"], [1, 1, "down"]
    ]);
    tutorialStateArray.push([[0, 3, "solid"], [1, 2, "down"], [1, 3, "up"], [1, 3, "right"],
        [2, 3, "left"], [2, 3, "up"], [2, 2, "down"], [1, 2, "up"], [1, 1, "down"],
        [1, 0, "non-solid"], [2, 0, "non-solid"], [3, 0, "non-solid"]
    ]);
    tutorialStateArray.push([[0, 3, "solid"], [1, 2, "down"], [1, 3, "up"], [1, 3, "right"],
        [2, 3, "left"], [2, 3, "up"], [2, 2, "down"], [1, 2, "up"], [1, 1, "down"],
        [1, 1, "up"], [1, 0, "down"], [1, 0, "right"], [2, 0, "left"], [2, 0, "right"],
        [3, 0, "left"], [3, 0, "down"], [3, 1, "up"]
    ]);
    
    
    tutorialStateArray.push([[0, 3, "solid"], [1, 2, "down"], [1, 3, "up"], [1, 3, "right"],
        [2, 3, "left"], [2, 3, "up"], [2, 2, "down"], [1, 2, "up"], [1, 1, "down"],
        [1, 1, "up"], [1, 0, "down"], [1, 0, "right"], [2, 0, "left"], [2, 0, "right"],
        [3, 0, "left"], [3, 0, "down"], [3, 1, "up"]
    ]);
    tutorialStateArray.push([[0, 3, "solid"], [1, 2, "down"], [1, 3, "up"], [1, 3, "right"],
        [2, 3, "left"], [2, 3, "up"], [2, 2, "down"], [1, 2, "up"], [1, 1, "down"],
        [1, 1, "up"], [1, 0, "down"], [1, 0, "right"], [2, 0, "left"], [2, 0, "right"],
        [3, 0, "left"], [3, 0, "down"], [3, 1, "up"], [0, 1, "solid"], [3, 2, "solid"]
    ]);
    tutorialStateArray.push([[0, 3, "solid"], [1, 2, "down"], [1, 3, "up"], [1, 3, "right"],
        [2, 3, "left"], [2, 3, "up"], [2, 2, "down"], [1, 2, "up"], [1, 1, "down"],
        [1, 1, "up"], [1, 0, "down"], [1, 0, "right"], [2, 0, "left"], [2, 0, "right"],
        [3, 0, "left"], [3, 0, "down"], [3, 1, "up"], [0, 1, "solid"], [3, 2, "solid"],
        [2, 2, "up"], [2, 1, "down"], [2, 1, "right"], [3, 1, "left"]
    ]);
}


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
        case 'tutorial':
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
        case 'tutorial':
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
        case 'tutorial':
            tutorial.checkCollisionWithButtons(x, y);
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
        case "tutorial":
            tutorial.calculateAllAndDraw();
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
            //str += JSON.stringify(line) + ',\\\n';
            str += JSON.stringify(line) + ',\n';
        }
        //str = str.slice(0, -3);
        str = str.slice(0, -2);
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
        this.calculateCellsSizeAndMargins();
        this.calculateCellsPositions();
        this.calculateButtonsPositionsAndSize();
        this.drawBoard()
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
    }
}


class Tutorial extends Grid {
    buttons = [new Button("to-menu"), new Button("previous-slide"), new Button("next-slide")];
    sidePanelsWidth;
    bottomPanelHeight;
    slide = 0;
    lastSlide;

    constructor(name, levelData) {
        super(name, levelData);
        this.lastSlide = tutorialStateArray.length - 1;
    }

    calculateAllAndDraw() {
        this.calculateCellsSizeAndMargins();
        this.calculateCellsPositions();
        this.calculateButtonsPositionsAndSize();
        this.runSlide(this.slide);
    }

    calculateCellsSizeAndMargins() {
        let topSpaceHeight = parseInt(0.16 * c.height);
        let bottomSpaceHeight = parseInt(0.22 * c.height);
        let sidePanelsWidth = parseInt(0.2 * c.width);
        let basicMargin = Math.floor(0.035 * c.height);

        let boardSizes = fitRectInSpace(this.cellsX,
            this.cellsY,
            c.width - 2 * sidePanelsWidth,
            c.height - topSpaceHeight - bottomSpaceHeight,
            basicMargin);
        let boardSizeX = boardSizes[0];
        let boardSizeY = boardSizes[1];
        let cellSize = Math.min(parseInt(boardSizeX / this.cellsX), parseInt(boardSizeY / this.cellsY));

        this.basicMargin = basicMargin;
        this.topSpaceHeight = topSpaceHeight;
        this.bottomPanelHeight = bottomSpaceHeight;
        this.sidePanelsWidth = sidePanelsWidth;
        this.cellSize = cellSize;
        this.cellsContainerTranslationX = parseInt((c.width - boardSizeX) / 2);
        this.cellsContainerTranslationY = parseInt((c.height - topSpaceHeight - bottomSpaceHeight - boardSizeY) / 2 + topSpaceHeight);
    }

    calculateButtonsPositionsAndSize() {
        let sizeOfTopButton = fitRectInSpace(1, 1, c.width, this.topSpaceHeight, this.basicMargin)[0];
        this.buttons[0].size = sizeOfTopButton;
        this.buttons[0].x = this.basicMargin;
        this.buttons[0].y = this.basicMargin;

        let maxSizeInPanel = fitRectInSpace(1, 1, this.sidePanelsWidth, c.height - this.topSpaceHeight - this.bottomPanelHeight, 0)[0];
        let sizeOfSideButtons;
        if (maxSizeInPanel > sizeOfTopButton) {
            sizeOfSideButtons = sizeOfTopButton;
        }
        else {
            sizeOfSideButtons = maxSizeInPanel;
        }
        this.buttons[1].size = sizeOfSideButtons;
        this.buttons[2].size = sizeOfSideButtons;
        this.buttons[1].x = this.sidePanelsWidth - sizeOfSideButtons;
        this.buttons[2].x = c.width - this.sidePanelsWidth;
        this.buttons[1].y = parseInt((c.height - this.topSpaceHeight - this.bottomPanelHeight - sizeOfSideButtons) / 2 + this.topSpaceHeight);
        this.buttons[2].y = parseInt((c.height - this.topSpaceHeight - this.bottomPanelHeight - sizeOfSideButtons) / 2 + this.topSpaceHeight);
    }

    makeNaviagationButtonsVisible() {
        this.buttons[1].visible = true;
        this.buttons[1].clickable = true;
        this.buttons[2].visible = true;
        this.buttons[2].clickable = true;
    }

    loadStateFromArray(n) {
        for (let i = 0; i < this.cellsX; i++) {
            for (let j = 0; j < this.cellsY; j++) {
                if (!this.cells[i][j].lines.has("clue")){
                    this.cells[i][j].lines.clear();
                    for (const info of tutorialStateArray[n][i][j]) {
                        this.cells[i][j].lines.add(info);
                    }
                }
            }
        }
    }

    loadState(n) {
        this.clearCells();
        for (const info of tutorialStateArray[n]) {
            console.log(info);
            this.cells[info[0]][info[1]].lines.add(info[2]);
        }
    }

    runSlide() {
        console.log("run", this.slide);
        if (this.slide == 0) {
            this.buttons[1].visible = false;
            this.buttons[1].clickable = false;
        }
        else if (this.slide == this.lastSlide) {
            this.buttons[2].visible = false;
            this.buttons[2].clickable = false;
        }
        else {
            this.makeNaviagationButtonsVisible();
        }

        this.loadState(this.slide);
        
        switch (this.slide) {
            case 1:
                this.drawBackground();
                this.cells[0][0].draw();
                this.cells[0][2].draw();
                this.cells[3][3].draw();
                break;
            case 2:
                this.drawBackground();
                for (const col of this.cells) {
                    for (const cell of col) {
                        if (!cell.lines.has("clue")) {
                            cell.draw();
                        }
                    }
                }
                break;
            case 3:
            case 4:
            case 5:
                this.drawBackground();
                this.cells[1][1].draw();
                break;
            case 6:
                this.drawBackground();
                this.cells[1][1].draw();
                this.cells[2][1].draw();
                break;
            case 7:
                this.drawBackground();
                this.cells[1][1].draw();
                this.cells[2][2].draw();
                break;
            case 8:
                this.drawBackground();
                this.cells[0][2].draw();
                this.cells[1][2].draw();
                break;
            case 9:
                this.drawBoard();
                this.cells[0][0].draw("Khaki");
                this.cells[1][0].draw("Khaki");
                this.cells[2][0].draw("Khaki");
                this.cells[3][0].draw("Khaki");
                break;
            case 10:
                this.drawBoard();
                this.cells[3][0].draw("Khaki");
                this.cells[3][1].draw("Khaki");
                this.cells[3][2].draw("Khaki");
                this.cells[3][3].draw("Khaki");
                break;
            case 11:
                this.drawBoard();
                this.cells[0][2].draw("Khaki");
                this.cells[0][3].draw("Khaki");
                break;
            case 13:
                this.drawBoard();
                this.cells[1][3].draw("Khaki");
                break;
            case 14:
                this.drawBoard();
                this.cells[1][2].draw("Khaki");
                this.cells[1][3].draw("Khaki");
                this.cells[2][3].draw("Khaki");
                break;
            case 15:
                this.drawBoard();
                this.cells[2][3].draw("Khaki");
                this.cells[2][2].draw("Khaki");
                break;
            case 16:
                this.drawBoard();
                this.cells[1][2].draw("Khaki");
                this.cells[2][2].draw("Khaki");
                break;
            case 18:
                this.drawBoard();
                this.cells[0][0].draw("Khaki");
                this.cells[1][0].draw("Khaki");
                this.cells[2][0].draw("Khaki");
                this.cells[3][0].draw("Khaki");
                break;
            case 20:
                this.drawBoard();
                this.cells[0][1].draw("Khaki");
                this.cells[3][2].draw("Khaki");
                break;
            case 22:
                this.drawBackground();
                for (const col of this.cells) {
                    for (const cell of col) {
                        cell.draw("LightGreen");
                    }
                }
                break;
            default:
                this.drawBoard();
        }

        //fitRectInSpace();
        let fontSize = calculateMaxFontSize(4, tutorialSubtitlesMaxLength, c.width - 2 * this.basicMargin, this.bottomPanelHeight - this.basicMargin);
        console.log(fontSize);
        drawTextInBox(c.width, this.bottomPanelHeight, c.height - this.bottomPanelHeight, this.slide, fontSize);
    }

    nextSlide() {
        console.log("next before", this.slide);
        if (this.slide < this.lastSlide) {
            this.slide = this.slide + 1;
            this.runSlide();
        }
        console.log("next after", this.slide);
    }

    previousSlide() {
        console.log("prev before", this.slide);
        if (this.slide > 0) {
            this.slide = this.slide - 1;
            this.runSlide();
        }
        console.log("prev after", this.slide);
    }

    drawBoard() {
        this.drawBackground();
        this.drawCells();
    }

    drawBackground() {
        ctx.fillStyle = "Tomato";
        ctx.fillRect(0, 0, c.width, c.height);

        // //draw top bar
        // ctx.fillStyle = "coral";
        // ctx.fillRect(0, 0, c.width, this.topSpaceHeight);

        //draw bottom bar
        // ctx.fillStyle = "aqua";
        // ctx.fillRect(0, c.height - this.bottomPanelHeight, c.width, this.bottomPanelHeight);

        // //draw left side panel
        // ctx.fillStyle = "darkseagreen";
        // ctx.fillRect(0, this.topSpaceHeight, this.sidePanelsWidth, c.height - this.topSpaceHeight - this.bottomPanelHeight);

        // //draw left side panel
        // ctx.fillStyle = "darksalmon";
        // ctx.fillRect(c.width - this.sidePanelsWidth, this.topSpaceHeight, this.sidePanelsWidth, c.height - this.topSpaceHeight - this.bottomPanelHeight);

        //draw buttons
        this.buttons.forEach((element) => element.draw());
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
                ctx.textAlign = "left";
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
        ctx.fillStyle = "black";
        ctx.fillRect(this.pos_x - 2, this.pos_y - 2, this.size + 4, this.size + 4);
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
    visible = true;
    clickable = true;

    constructor(type) {
        this.type = type;
    }

    draw() {
        if (this.visible) {
            ctx.fillStyle = "beige";
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }

    triggerAction() {
        if (this.clickable) {
            switch(this.type) {
                case "level":
                    initializeGame(this.levelName);
                    break;
                case "to-menu":
                    initializeMenu();
                    break;
                case "clear-cells":
                    grid.clearCells();
                    grid.manageSolvedState();
                    break;
                case "next-slide":
                    tutorial.nextSlide();
                    break;
                case "previous-slide":
                    tutorial.previousSlide();
                    break;
                case "to-tutorial":
                    initializeTutorial();
                    break;
            }
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
    buttons = [new Button("to-tutorial")];

    checkCollisionWithButtons(x, y) {
        this.levelButtons.forEach((element) => {
            if (x >= element.x && x <= element.x + element.size && y >= element.y && y <= element.y + element.size) {
                element.triggerAction();
            }
        });
        this.buttons.forEach((element) => {
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

            let sizeOfTopButton = fitRectInSpace(1, 1, c.width, this.topSpaceHeight, this.basicMargin)[0];
            this.buttons[0].size = sizeOfTopButton;
            this.buttons[0].x = this.basicMargin;
            this.buttons[0].y = this.basicMargin;
        }
    }

    draw() {
        ctx.fillStyle = "Tomato";
        ctx.fillRect(0, 0, c.width, c.height);
        //top bar
        // ctx.fillStyle = "coral";
        // ctx.fillRect(0, this.topSpaceHeight, c.width, - this.topSpaceHeight);

        //bottom square
        ctx.fillStyle = "#47FFB1";
        ctx.fillRect(this.levelsContainerTranslationX, this.levelsContainerTranslationY, this.levelsContainerX, this.levelsContainerY);

        //levelButtons
        this.levelButtons.forEach(element => element.draw());
        this.buttons.forEach(element => element.draw());
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

function calculateMaxFontSize(lines, maxLength, boxX, boxY) {
    console.log(lines, maxLength, boxX, boxY);
    let x = maxLength * 0.55;
    let y = lines;

    let box = fitRectInSpace(x, y, boxX, boxY, 0);

    return box[1] / lines;
}

function drawTextInBox(width, height, translationY, n, fontSize) {
    let font = (fontSize).toString().concat('px consolas');
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.font = font;

    console.log(ctx.measureText("We can mark the cell next to the black block, since we know we cannot"));

    console.log(tutorialSubtitles[n]);
    for (let i = 0; i < tutorialSubtitles[n].length; i++) {
        console.log(tutorialSubtitles[n][i], width / 2, translationY + (i + 1) * fontSize);
        ctx.fillText(tutorialSubtitles[n][i], width / 2, translationY + (i + 1) * fontSize);
    }

    //console.log(ctx.measureText(text1));
}

var move;
var grid;
var menu;
var tutorial;


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

function initializeTutorial() {
    state = "tutorial";
    loadTutorialStateArray();
    let levelData = levelsData.get("tutorial");
    tutorial = new Tutorial("tutorial", levelData);
    tutorial.calculateAllAndDraw();
}

initializeMenu();