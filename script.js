const nCols = 8;
const nRows = 8;
const initialCells = [];

const clClickedState = "gridCellChecked";

var mousePressed = null;
var cellStates = [];
var cellsTouched = [];

function setCellSizes() {
    let wPanel = $('#gridPanel').width();
    let nEquivalentCells = nCols * 1.2;
    let cellSize = (1 / nEquivalentCells) * wPanel;
    let gapSize = 0.2 * cellSize;

    $('.gridCell').css('width', cellSize);
    $('.gridCell').css('height', cellSize);
    $('#gridPanel').css('gap', gapSize);
}

function createGrid() {
    $("#gridPanel").empty();

    let row, cell;
    for (let i = 0; i < nRows; i++) {
        row = [];
        cell = "";

        for (let j = 0; j < nCols; j++) {
            row.push(false);
            cell = `<button class='gridCell' id='cell-${i}-${j}' data-row="${i}" data-col="${j}"></button>`;
            $("#gridPanel").append(cell);
        }

        cellStates.push(row);
    }

    setCellSizes();
    resetCellsTouched();
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
    cellStates[row][col] = ! cellStates[row][col];
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

    // if (mousePressed === 0) {
    //     activateCell(row, col);
    //
    // } else if ((mousePressed === 2) || (mousePressed === 1)) {
    //     // different accounting on different OSes
    //     deactivateCell(row, col);
    // }

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

function handleMouseDown(e) {
    mousePressed = e.button;
    console.log(mousePressed);
    resetCellsTouched();
}

function handleMouseUp(e) {
    mousePressed = null;
}

function bindCells() {
    $(".gridCell").mouseenter((e) => {
        if (mousePressed !== null) {
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

function showHelp() {
    $('#gridPanel').addClass('hide');
    $('#btnHelp').addClass('hide');
    $('#helpPanel').removeClass('hide');
    $('#btnGame').removeClass('hide');
}

function showGame() {
    $('#gridPanel').removeClass('hide');
    $('#btnHelp').removeClass('hide');
    $('#helpPanel').addClass('hide');
    $('#btnGame').addClass('hide');
}

function bind() {
    bindCells();
    // $(document).contextmenu(() => { return false; });
    $(document).mousedown(handleMouseDown);
    $(document).mouseup(handleMouseUp);
    $('#btnReset').click(reset);
    $('#btnHelp').click(showHelp);
    $('#btnGame').click(showGame);
}

$(document).ready((e) => {
    setup();
    bind();
});
