function createBoardElem(board) {
  const boardElem = document.createElement('div');
  const gridElem = document.createElement('div');
  const shipWrapper = document.createElement('div');
  const attacksWrapper = document.createElement('div');

  gridElem.className = 'grid';

  // create a grid of squares
  board.grid.forEach((square) => {
    const squareElem = document.createElement('div');
    squareElem.className = 'square';
    gridElem.appendChild(squareElem);
  });

  boardElem.appendChild(gridElem);
  boardElem.appendChild(shipWrapper);
  boardElem.appendChild(attacksWrapper);

  return boardElem;
}

function displayElem(elem) {
  document.body.appendChild(elem);
}

export { createBoardElem, displayElem };
