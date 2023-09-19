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
        board[row][0].getValue() === board[row][1].getValue() &&
        board[row][1].getValue() === board[row][2].getValue() &&
        board[row][0].getValue() !== ""
      ) {
        return board[row][0].getValue();
      }
    }

    // Check Column
    for (let col = 0; col < 3; col++) {
      if (
        board[0][col].getValue() === board[1][col].getValue() &&
        board[1][col].getValue() === board[2][col].getValue() &&
        board[0][col].getValue() !== ""
      ) {
        return board[0][col].getValue();
      }
    }

    // Check diagonal
    if (
      (board[0][0].getValue() === board[1][1].getValue() &&
        board[1][1].getValue() === board[2][2].getValue() &&
        board[0][0].getValue() !== "") ||
      (board[0][2].getValue() === board[1][1].getValue() &&
        board[1][1].getValue() === board[2][0].getValue() &&
        board[0][2].getValue() !== "")
    ) {
      return board[1][1].getValue();
    }

    return null; // Return null if no one wins
  };

  const clearBoard = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        board[i][j].addToken("");
      }
    }
  };
  return { getBoard, dropToken, printBoard, checkBoardState, clearBoard };
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

    const winner = board.checkBoardState();
    console.log(winner);
    if (winner) {
      board.clearBoard();
      console.log(`Player ${winner} wins!`);
    } else {
      // 승자가 없으면 플레이어 전환 및 다음 라운드 진행
      switchPlayer();
      printNewRound();
    }
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
