const winnerAnnouncement = document.querySelector('.overlay');
const winner = document.querySelector('#winner');
const newgameBtn = document.querySelector('#newgame');

let dimensionX = 5;
let dimensionY = 5;
const winLength = 5; // How many stones needed to win
const board = []; // The game board
let turn = 'X'; // Starting player. The other player is 'O'.
let isGameOver = false;

function initializeGame() {
  // TODO: Task 1
  // Initialize the game board to be an array of five arrays.
  // Each of the inner arrays should contain five empty strings.
  // Use the variable dimensions instead of hard coding the number five.

  for (let i = 0; i < dimensionY; i++) {
    let row = [];
    for (let j = 0; j < dimensionX; j++) {
      row.push('');
    }
    board.push(row);
  }
}

function nextTurn() {
  if (turn === 'X') {
    turn = 'O';
  } else {
    turn = 'X';
  }
  let turnLabel = document.getElementById('turn');
  turnLabel.textContent = turn;
}

function checkWin(x, y) {
  // TODO: Task 3
  // Hint: be careful to keep yourself inside of the game board!
  // Check the neighbouring squares of the square x,y.
  // If any of them contain same character as the current turn,
  // keep on checking to that direction -- and to the opposite!
  // Number of the stones needed is in variable winLength.

  x = parseInt(x);
  y = parseInt(y);

  // Character at current position
  const character = turn;

  const onboard = (x, y) => {
    if (x < 0 || x >= dimensionX || y < 0 || y >= dimensionY) {
      return false;
    } else {
      return true;
    }
  };

  const countChar = (x, y, dx, dy) => {
    // Counter for win!
    // Starts at -1 because the while loops count the clicked square twice
    let counter = -1;

    let i = x;
    let j = y;
    while (onboard(i, j) && board[j][i] === character) {
      i = i + dx;
      j = j + dy;
      counter++;
    }

    i = x;
    j = y;
    while (onboard(i, j) && board[j][i] === character) {
      i = i + dx * -1;
      j = j + dy * -1;
      counter++;
    }

    if (counter === winLength) {
      winnerAnnouncement.classList.remove('hidden');
      winner.textContent = character;

      isGameOver = true;

      newgameBtn.addEventListener('click', () => {
        location.reload();
      });
    }
  };

  // Horizontal, vertical, diagonal (to bottom right), and diagonal (to bottom left) checks
  countChar(x, y, 1, 0);
  countChar(x, y, 0, 1);
  countChar(x, y, 1, 1);
  countChar(x, y, -1, 1);
}

function expandBoard(direction) {
  // TODO: Task 2 B
  // This function adds a column or a row to the board
  // depending on the direction it gets as an argument.
  if (direction === 'LEFT') {
    dimensionX++;
    board.forEach((row) => {
      row.unshift('');
    });
  } else if (direction === 'RIGHT') {
    dimensionX++;
    board.forEach((row) => {
      row.push('');
    });
  }

  if (direction === 'UP') {
    dimensionY++;
    let row = [];
    for (let i = 0; i < dimensionX; i++) {
      row.push('');
    }
    board.unshift(row);
  } else if (direction === 'DOWN') {
    dimensionY++;
    let row = [];
    for (let i = 0; i < dimensionX; i++) {
      row.push('');
    }
    board.push(row);
  }

  drawBoard(isGameOver);
}

function handleClick(event) {
  let square = event.target;
  let x = square.dataset.x;
  let y = square.dataset.y;

  if (!isGameOver) {
    board[y][x] = turn;
    square.textContent = turn;
    square.removeEventListener('click', handleClick);
  }

  checkWin(x, y);

  // TODO: Task 2 A
  // Implement the conditions when the board should be expanded.
  // Ie when the player clicks the extreme rows or columns.

  if (x == 0) {
    expandBoard('LEFT');
  } else if (x == dimensionX - 1) {
    expandBoard('RIGHT');
  }
  if (y == 0) {
    expandBoard('UP');
  } else if (y == dimensionY - 1) {
    expandBoard('DOWN');
  }

  if (!isGameOver) {
    nextTurn();
  }
}

function createSquare(boardDiv, x, y) {
  let element = document.createElement('div');
  element.setAttribute('class', 'square');
  element.setAttribute('data-x', x);
  element.setAttribute('data-y', y);
  element.textContent = board[y][x];

  if (board[y][x] === '') {
    element.addEventListener('click', handleClick);
  }

  boardDiv.appendChild(element);
}

function drawBoard(gamestate) {
  if (gamestate) {
    return;
  }

  const boardDiv = document.getElementById('board');
  boardDiv.innerHTML = ''; // Clear the board first!

  boardDiv.style.gridTemplateRows = `repeat(${dimensionY}, 1fr)`;
  boardDiv.style.gridTemplateColumns = `repeat(${dimensionX}, 1fr)`;

  for (let y = 0; y < dimensionY; y++) {
    for (let x = 0; x < dimensionX; x++) {
      createSquare(boardDiv, x, y);
    }
  }
}

initializeGame();
drawBoard(isGameOver);
