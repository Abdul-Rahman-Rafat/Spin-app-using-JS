// machine size
const ROWS = 3;
const COLS = 3;
//each symbol possible 
const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
};

const SYMBOLS_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
};

const SYMBOLS = Object.keys(SYMBOLS_COUNT);

// DOM elements
const colsContainer = document.querySelector('.cols');
const spinBtn = document.querySelector('.spin-btn');
const depositInput = document.querySelector('.deposit-input');
const betInput = document.querySelector('.bet-input');
const linesBtn = document.querySelector('.lines-count-btn');
const messageEl = document.querySelector('.message');

let linesCount = 1;
let spinning = false;

function makeReelsDOM() {
    colsContainer.innerHTML = '';
    for (let c = 0; c < COLS; c++) {
        const col = document.createElement('div');
        col.className = 'col';
        for (let r = 0; r < ROWS; r++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = '-';
            col.appendChild(cell);
        }
        colsContainer.appendChild(col);
    }
}

function buildSymbolsArray() {
    const arr = [];
    for (const [sym, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) arr.push(sym);
    }
    return arr;
}

function spinOnce() {
  // build reels: COLS arrays each with ROWS symbols (no repeats inside a single reel)
    const symbols = buildSymbolsArray();
    const reels = [];
    for (let i = 0; i < COLS; i++) {
        const reelSymbols = [...symbols];
        reels[i] = [];
        for (let j = 0; j < ROWS; j++) {
        const idx = Math.floor(Math.random() * reelSymbols.length);
            reels[i].push(reelSymbols[idx]);
            reelSymbols.splice(idx, 1);
        }
    }
    return reels;
}
//turn the cols to rows to be able to identify the winning row
function transpose(reels) {
    const rows = [];
    for (let r = 0; r < ROWS; r++) {
        rows[r] = [];
        for (let c = 0; c < COLS; c++) rows[r].push(reels[c][r]);
    }
    return rows;
}

function getWinnings(rows, lines, betPerLine) {
    let winnings = 0;
    for (let r = 0; r < lines; r++) {
    const row = rows[r];
    const first = row[0];
    if (row.every(s => s === first)) {
      winnings += betPerLine * SYMBOLS_VALUES[first];
    }
    }
    return winnings;
}

function updateCellsFromReels(reels) {
const colEls = Array.from(colsContainer.children);
for (let c = 0; c < COLS; c++) {
    const cells = Array.from(colEls[c].children);
    for (let r = 0; r < ROWS; r++) {
        cells[r].textContent = reels[c][r];
    }
}
}

// remove any existing win highlights
function clearHighlights() {
    const colEls = Array.from(colsContainer.children);
    for (let c = 0; c < COLS; c++) {
    const cells = Array.from(colEls[c].children);
    for (let r = 0; r < ROWS; r++) {
        cells[r].classList.remove('win');
    }
}
}

// highlight rows that are winners (returns array of winning row indices)
function highlightWinningRows(rows, lines) {
    const winners = [];

    for (let r = 0; r < lines; r++) {
    const row = rows[r];
    const first = row[0];
    if (row.every(s => s === first)) {
        winners.push(r);
    }
}

if (winners.length === 0) return winners;

    const colEls = Array.from(colsContainer.children);
    for (const r of winners) {
    for (let c = 0; c < COLS; c++) {
        const cell = colEls[c].children[r];
        if (cell) cell.classList.add('win');
    }
}
return winners;
}

function animateSpin(finalReels) {
    spinning = true;
    spinBtn.disabled = true;
    linesBtn.disabled = true;
    betInput.disabled = true;
    depositInput.disabled = true;

    const colEls = Array.from(colsContainer.children);
    const intervals = [];

    for (let c = 0; c < COLS; c++) {
    intervals[c] = setInterval(() => {
      // show random symbols quickly
        const cells = Array.from(colEls[c].children);
        for (let r = 0; r < ROWS; r++) {
        cells[r].textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        }
    }, 80);
}

  // stop each column staggered
    for (let c = 0; c < COLS; c++) {
    setTimeout(() => {
        clearInterval(intervals[c]);
      // set final column
        const cells = Array.from(colEls[c].children);
        for (let r = 0; r < ROWS; r++) {
        cells[r].textContent = finalReels[c][r];
        }
      // if last column, finish spin
        if (c === COLS - 1) {
            spinning = false;
            spinBtn.disabled = false;
            linesBtn.disabled = false;
            betInput.disabled = false;
            depositInput.disabled = false;
        }
    }, 700 + c * 300);
}
}

function showMessage(text, type = 'info') {
    messageEl.textContent = text;
    messageEl.style.color = type === 'error' ? 'crimson' : type === 'win' ? 'green' : 'black';
}

function parseNumberInput(el, fallback = 0) {
    const v = parseFloat(el.value);
    return isNaN(v) ? fallback : v;
}

spinBtn.addEventListener('click', () => {
    if (spinning) return;

    let balance = parseNumberInput(depositInput, 0);
    const betPerLine = Math.max(1, Math.floor(parseNumberInput(betInput, 1)));
  const totalBet = betPerLine * linesCount;

    if (balance < totalBet) {
        showMessage('Insufficient balance for this bet.', 'error');
        return;
    }

    balance -= totalBet;
    depositInput.value = balance;
    clearHighlights();
    showMessage('Spinning...');

    const finalReels = spinOnce();
    animateSpin(finalReels);

  // compute results after full spin finishes (wait until last column stops)
    setTimeout(() => {
        const rows = transpose(finalReels);
        // clear previous highlights and add new ones if any
        clearHighlights();
        const winningRows = highlightWinningRows(rows, linesCount);

        const winnings = getWinnings(rows, linesCount, betPerLine);
        if (winnings > 0) {
        // highlight rows visually and show message
            showMessage(`You won $${winnings}!`, 'win');
            balance += winnings;
        } else {
            showMessage('You lost this spin. Try again!', 'info');
        }

        // if there are winning rows, keep them highlighted; otherwise nothing to show
        depositInput.value = balance;
  }, 700 + (COLS - 1) * 300 + 50);
});

linesBtn.addEventListener('click', () => {
    linesCount = (linesCount % 3) + 1; // cycles 1 -> 2 -> 3 -> 1
    linesBtn.textContent = `x${linesCount}`;
});

// initial setup
makeReelsDOM();
showMessage('Set your balance and bet, then press Spin');

// expose for debugging
window._slot = { spinOnce, transpose, getWinnings };
