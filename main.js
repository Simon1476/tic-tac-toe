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

  const checkBoardState = () => {
    // Check Row
    for (let row = 0; row < 3; row++) {
      if (
        board[row][0] === board[row][1] &&
        board[row][1] === board[row][2] &&
        board[row][0] !== ""
      ) {
        return board[row][0];
      }
    }

    // Check Column
    for (let col = 0; col < 3; col++) {
      if (
        board[0][col] === board[1][col] &&
        board[1][col] === board[2][col] &&
        board[0][col] !== ""
      ) {
        return board[0][col];
      }
    }

    // Check diagonal
    if (
      (board[0][0] === board[1][1] &&
        board[1][1] === board[2][2] &&
        board[0][0] !== "") ||
      (board[0][2] === board[1][1] &&
        board[1][1] === board[2][0] &&
        board[0][2] !== "")
    ) {
      return board[1][1];
    }

    return null; // Return null if no one wins
  };
  return { getBoard, dropToken, printBoard, checkBoardState };
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
