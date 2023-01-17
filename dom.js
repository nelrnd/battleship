function displayElem(elem) {
  document.body.appendChild(elem);
}

function createBoardElem(board) {
  const boardElem = document.createElement('div');
  const gridElem = createBoardGridElem(board.grid);
  const shipsElem = createBoardShipsElem(board.ships);
  const attacksElem = createBoardAttacksElem(board.receivedAttacks);

  boardElem.className = 'board';
  boardElem.appendChild(attacksElem);
  boardElem.appendChild(shipsElem);
  boardElem.appendChild(gridElem);

  board.elem = boardElem;
  return boardElem;
}

function createBoardGridElem(grid) {
  const gridElem = document.createElement('div');
  gridElem.className = 'grid';

  grid.forEach((square) => {
    const squareElem = document.createElement('div');
    squareElem.className = 'square';
    gridElem.appendChild(squareElem);
  });

  return gridElem;
}

function createBoardShipsElem(ships) {
  const shipsElem = document.createElement('div');
  shipsElem.className = 'ships';

  ships.forEach((ship) => {
    const shipElem = createShipElem(ship);
    shipsElem.appendChild(shipElem);
  });

  return shipsElem;
}

function createBoardAttacksElem(attacks) {
  const attacksElem = document.createElement('div');
  attacksElem.className = 'attacks';

  return attacksElem;
}

function createShipElem(ship) {
  const shipElem = document.createElement('div');
  shipElem.className = 'ship';
  shipElem.classList.add(ship.dir);

  for (let i = 0; i < ship.length; i++) {
    const squareElem = document.createElement('div');
    squareElem.className = 'square';
    shipElem.appendChild(squareElem);
  }

  ship.elem = shipElem;
  return shipElem;
}

function positionShipElem(ship, shipElem, board) {
  const gridWidth = board.elem.offsetWidth;
  const gridSize = Math.sqrt(board.grid.length);
  const posX = ((gridWidth / gridSize) * ship.pos.x * 100) / gridWidth;
  const posY = ((gridWidth / gridSize) * ship.pos.y * 100) / gridWidth;

  shipElem.style.left = posX + '%';
  shipElem.style.top = posY + '%';
}

export { createBoardElem, displayElem, positionShipElem };
