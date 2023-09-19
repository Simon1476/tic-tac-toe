function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i][j] = Cell();
    }
  }

  const getBoard = () => board;

  const dropToken = (position, player) => {
    if (board[position.row][position.column].getValue() !== "") return;
    board[position.row][position.column].addToken(player);
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
  };

  return { getBoard, dropToken, printBoard };
}

function Cell() {
  let value = "";

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addToken, getValue };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: "O",
    },
    {
      name: playerTwoName,
      token: "X",
    },
  ];

  let activePlayer = players[0];

  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => {
    return activePlayer;
  };

  const printNewRound = () => {
    board.printBoard();
  };

  const playRound = (position) => {
    board.dropToken(position, getActivePlayer().token);

    switchPlayer();
    printNewRound();
  };

  printNewRound();

  return {
    getActivePlayer,
    board: board.getBoard,
    playRound,
  };
}

function ScreenController() {
  const game = GameController();
  const boardDiv = document.querySelector(".board");

  const updateScreen = () => {
    const board = game.board();
    boardDiv.textContent = "";
    board.forEach((row, rowIndex) => {
      row.map((cell, columnIndex) => {
        const Cellbutton = document.createElement("button");
        Cellbutton.classList.add("cell");

        Cellbutton.dataset.row = rowIndex;
        Cellbutton.dataset.column = columnIndex;
        Cellbutton.textContent = cell.getValue();

        boardDiv.appendChild(Cellbutton);
      });
    });
  };

  function clickBoard(e) {
    if (!e.target.dataset.row || !e.target.dataset.column) return;
    const position = {
      row: e.target.dataset.row,
      column: e.target.dataset.column,
    };

    game.playRound(position);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickBoard);

  updateScreen();
}
ScreenController();
