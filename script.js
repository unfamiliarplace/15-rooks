const nCols = 8;
const nRows = 8;
const initialCells = [];

const clClickedState = "gridCellChecked";
const clRedundantState = "gridCellRedundant";

var mousePressed = null;
var cellStates = [];
var cellsTouched = [];
var redundantRooks = [];

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
    resetRedundantRooks();
}

function clearCells() {
    cellStates = copyCellStates(false);
    redundantRooks = copyCellStates(false);
    cellsTouched = copyCellStates(false);
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
    updateRedundantRooks();
}

function updateRedundantRooks() {
    resetRedundantRooks();

    let rowCounts = new Array(nRows).fill(0);
    let colCounts =new Array(nCols).fill(0);

    for (let row = 0; row < nRows; row++) {
        for (let col = 0; col < nCols; col++) {
            if (cellStates[row][col]) {
                rowCounts[row] += 1;
                colCounts[col] += 1;
            }
        }
    }

    for (let row = 0; row < nRows; row++) {
        for (let col = 0; col < nCols; col++) {
            if (cellStates[row][col]) {
                if ((rowCounts[row] > 1) && (colCounts[col] > 1)) {
                    redundantRooks[row][col] = true;
                }
            }
        }
    }
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
    let checkRedundant = $('#highlightRedundant').is(':checked');

    let cell;
    for (let row = 0; row < nRows; row++) {
        for (let col = 0; col < nCols; col++) {
            cell = $(`#cell-${row}-${col}`);
            cell.removeClass(clClickedState);
            cell.removeClass(clRedundantState);

            if (cellStates[row][col]) {
                cell.addClass(clClickedState);
            }
            if (checkRedundant && redundantRooks[row][col]) {
                cell.addClass(clRedundantState);
            }
        }
    }
}

function copyCellStates(defaultValue) {
    if (typeof defaultValue === undefined) {
        defaultValue = false;
    }

    let arr = [];
    let row;
    for (let i_row = 0; i_row < nRows; i_row++) {
        row = [];
        for (let i_col = 0; i_col < nCols; i_col++) {
            row.push(defaultValue);
        }
        arr.push(row);
    }

    return arr;
}

function resetRedundantRooks() {
    redundantRooks = copyCellStates(false);
}

function resetCellsTouched() {
    cellsTouched = copyCellStates(false);
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

    $('#highlightRedundant').change(drawCellStates);
    $('#btnHelp').click(toggleHelp);
    $('#btnReset').click(reset);

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
