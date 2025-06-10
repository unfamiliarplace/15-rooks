const nCols = 8;
const nRows = 8;
const initialCells = [];

const clClickedState = "gridCellChecked";

var mousePressed = null;
var cellStates = [];
var cellsTouched = [];

function setCellSizes() {
    // let mp = $('#mainPanel');
    let gp = $('#gridPanel');
    let gcs = $('.gridCell');

    gp.css('width', `90%`);
    gp.css('height', `90%`);

    // let wPanel = 0.9 * mp.width();
    // let hPanel = 0.9 * mp.height();
    let wPanel = gp.width();
    let hPanel = gp.height();

    let smaller = Math.min(wPanel, hPanel);
    gp.css('width', `${smaller}px`);
    gp.css('height', `${smaller}px`);

    let nEquivalentCells = nCols * 1.2;
    let cellSize = (1 / nEquivalentCells) * smaller;
    let gapSize = 0.2 * cellSize;
    let borderRadius = 0.1 * cellSize;

    gcs.css('width', cellSize);
    gcs.css('height', cellSize);
    gcs.css('border-radius', borderRadius);
    gp.css('gap', gapSize);
}

function createGrid() {
    $("#gridPanel").empty();

    let row, cell;
    for (let i = 0; i < nRows; i++) {
        row = [];
        cell = "";

        for (let j = 0; j < nCols; j++) {
            row.push(false);
            cell = `<div class='gridCell' id='cell-${i}-${j}' data-row="${i}" data-col="${j}"></div>`;
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

function handleCellClick(el) {
    let row = parseInt(el.attr('data-row'));
    let col = parseInt(el.attr('data-col'));

    if (! cellsTouched[row][col]) {
        cellsTouched[row][col] = true;
        toggleCell(row, col);
        draw();

        setTimeout(() => {
            cellsTouched[row][col] = false;
        }, 15);
    }
}

function handleMouseDown(e) {
    mousePressed = true;
}

function handleMouseUp(e) {
    mousePressed = false;
    resetCellsTouched();
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

function toggleHelp() {
    showingHelp = !showingHelp;
    if (showingHelp) {
        $('#gridPanel').addClass('hide');
        $('#helpPanel').removeClass('hide');
        $('#btnHelp').text('Game');

    } else {
        $('#gridPanel').removeClass('hide');
        $('#helpPanel').addClass('hide');
        $('#btnHelp').text('Help');
    }
}

function bind() {
    bindCells();

    $(document).mousedown(handleMouseDown);
    $(document).mouseup(handleMouseUp);

    $('#btnReset').click(reset);
    $('#btnHelp').click(toggleHelp);

    resizeObserver.observe(document.getElementById('app'));
}

const resizeObserver = new ResizeObserver(() => {
    setCellSizes();
});

var showingHelp = false;

$(document).ready((e) => {
    setup();
    bind();
});
