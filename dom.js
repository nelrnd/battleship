const main = document.querySelector('main');

function displayElem(elem) {
  main.appendChild(elem);
}

function displayBoard(board) {
  displayElem(board.elem);

  // position ships elems
  board.ships.forEach((ship) => {
    positionElem(ship.elem, ship.pos.x, ship.pos.y, board);
  });
}

function clearMain() {
  main.innerHTML = null;
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
    square.elem = squareElem;
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

function getPositionFromXY(x, y, board) {
  const gridWidth = board.elem.offsetWidth;
  const gridSize = Math.sqrt(board.grid.length);
  const posX = ((gridWidth / gridSize) * x * 100) / gridWidth + '%';
  const posY = ((gridWidth / gridSize) * y * 100) / gridWidth + '%';

  return { x: posX, y: posY };
}

function positionElem(elem, x, y, board) {
  const pos = getPositionFromXY(x, y, board);
  elem.style.left = pos.x;
  elem.style.top = pos.y;
}

function getGridCoordinates(event, board) {
  const rect = board.elem.querySelector('.grid').getBoundingClientRect();
  const gridSize = Math.sqrt(board.grid.length);
  const pointerFromLeft = event.clientX - rect.left;
  const pointerFromTop = event.clientY - rect.top;
  const x = Math.floor((pointerFromLeft * gridSize) / rect.width);
  const y = Math.floor((pointerFromTop * gridSize) / rect.height);

  return { x, y };
}

function makeBoardPlayable(board) {
  board.elem.addEventListener('mousedown', (event) => {
    const coords = getGridCoordinates(event, board);
    console.log(coords);
    board.getSquare(coords.x, coords.y).elem.style.backgroundColor = 'red';
  });
}

function drawAttack(attack, board) {
  const square = board.getSquare(attack.x, attack.y);
  const hit = square.hasShip;

  const markElem = createMarkElem(hit);
  board.elem.querySelector('.attacks').appendChild(markElem);
  positionElem(markElem, attack.x, attack.y, board);
}

function createMarkElem(hit) {
  const markElem = document.createElement('div');
  const bar1 = document.createElement('div');
  const bar2 = document.createElement('div');

  markElem.className = 'mark';
  bar1.className = 'bar bar-1';
  bar2.className = 'bar bar-2';

  markElem.appendChild(bar1);
  markElem.appendChild(bar2);

  if (hit) {
    markElem.classList.add('hit');
  }

  return markElem;
}

// drawAttack temp export
export { createBoardElem, displayBoard, makeBoardPlayable, drawAttack };
