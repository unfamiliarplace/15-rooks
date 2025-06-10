const nCols = 8;
const nRows = 8;
const initialCells = [];

const clClickedState = "gridCellChecked";

var mousePressed = false;
var cellStates = [];
var cellsTouched = [];

function createGrid() {
    $("#gridPanel").html("");
    let rows = "";
    let cols = "";
    let row;

    for (let i = 0; i < nRows; i++) {
        row = [];
        for (let j = 0; j < nCols; j++) {
            row.push(false);
            cols += `<button class='flex flexCol gridCell' id='cell-${i}-${j}' data-row="${i}" data-col="${j}"></button>`;
        }
        rows += `<div class='flex flexRow gridRow' id='row-${i}' data-row="${i}">${cols}</div>`;
        cols = "";
        cellStates.push(row);
    }

    resetCellsTouched();

    let inner = `<div class='flex flexCol'>${rows}</div>`;
    $("#gridPanel").html(inner);
}

function clearCells() {
    for (let row = 0; row < nRows; row++) {
        for (let col = 0; col < nCols; col++) {
            cellStates[row][col] = false;
        }
    }
}

function activateInitialCells() {
    for (let [row, col] of initialCells) {
        activateCell(row, col);
    }
}

function activateCell(row, col) {
    cellStates[row][col] = true;
}

function deactivateCell(row, col) {
    cellStates[row][col] = false;
}

function toggleCell(row, col) {
    console.log('tc1', row, col, cellStates[row][col]);
    cellStates[row][col] = ! cellStates[row][col];
    console.log('tc2', row, col, cellStates[row][col]);
}

function countNRooks() {
    let n = 0;
    for (let row of cellStates) {
        for (let col of row) {
            n += (!! col);
        }
    }
    return n;
}

function drawNRooks() {
    $("#nRooks").html(countNRooks());
}

function draw() {
    drawCellStates();
    drawNRooks();
}

function drawCellStates() {
    let cell;
    for (let row = 0; row < nRows; row++) {
        for (let col = 0; col < nCols; col++) {
            cell = $(`#cell-${row}-${col}`);
            cell.removeClass(clClickedState);
            if (cellStates[row][col]) {
                cell.addClass(clClickedState);
            }
        }
    }
}

function handleCellClick(el) {
    let row = parseInt(el.attr('data-row'));
    let col = parseInt(el.attr('data-col'));

    console.log('hc', row, col, cellsTouched[row][col]);
    if (! cellsTouched[row][col]) {
        cellsTouched[row][col] = true;
        toggleCell(row, col);
    }

    draw();
}

function resetCellsTouched() {
    cellsTouched.length = 0;
    let row_;
    for (let row = 0; row < nRows; row++) {
        row_ = [];
        for (let col = 0; col < nCols; col++) {
            row_.push(false);
        }
        cellsTouched.push(row_);
    }
}

function handleMouseDown() {
    mousePressed = true;
    resetCellsTouched();
}

function handleMouseUp() {
    mousePressed = false;
}

function bindCells() {
    $(".gridCell").mouseenter((e) => {
        if (mousePressed) {
            handleCellClick($(e.target));
        }
    });

    $(".gridCell").mousedown((e) => {
        handleCellClick($(e.target));
    });
}

function setup() {
    createGrid();
    activateInitialCells();
    draw();
}

function reset() {
    clearCells();
    activateInitialCells();
    draw();
}

function bind() {
    bindCells();
    $(document).mousedown(handleMouseDown);
    $(document).mouseup(handleMouseUp);
    $('#reset').click(reset);
}

$(document).ready((e) => {
    setup();
    bind();
});
