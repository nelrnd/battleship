import { players, setupGame, startGame } from './game.js';

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

function createBoardElem(board, playerType) {
  const boardElem = document.createElement('div');
  const gridElem = createBoardGridElem(board.grid);
  const shipsElem = createBoardShipsElem(board.ships);
  const attacksElem = createBoardAttacksElem();

  boardElem.className = 'board';
  if (playerType === 'computer') {
    boardElem.classList.add('opponent');
  } else {
    boardElem.classList.add('player');
  }
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

function createBoardAttacksElem() {
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
  let pointerFromLeft;
  let pointerFromTop;
  if (event.type === 'touchmove') {
    pointerFromLeft = event.touches[0].clientX - rect.left;
    pointerFromTop = event.touches[0].clientY - rect.top;
  } else {
    pointerFromLeft = event.clientX - rect.left;
    pointerFromTop = event.clientY - rect.top;
  }
  const x = Math.floor((pointerFromLeft * gridSize) / rect.width);
  const y = Math.floor((pointerFromTop * gridSize) / rect.height);

  return { x, y };
}

function makeBoardPlayable(currentPlayer, board) {
  board.elem.onclick = (event) => {
    const coords = getGridCoordinates(event, board);
    currentPlayer.play(coords, board);
  };
}

function makeBoardUnplayable(board) {
  board.elem.onclick = null;
}

function drawAttack(attack, board) {
  const square = board.getSquare(attack.x, attack.y);
  const hit = square.hasShip;

  const markElem = createMarkElem(hit);
  board.elem.querySelector('.attacks').appendChild(markElem);
  positionElem(markElem, attack.x, attack.y, board);

  setTimeout(() => {
    square.elem.classList.add('shot');
  }, 200);
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

function changeShipColor(elem) {
  elem.classList.add('sunk');
}

/*
HANDLING MOVING AND ROTATING SHIPS
*/

let currentBoard = null;
let currentShip = null;
let currentShipSquare = null;
let hasMoved = false;

function makeShipMoveable(ship) {
  ship.elem.addEventListener('mousedown', dragStart);
  ship.elem.addEventListener('touchstart', dragStart);
}

function makeShipUnmoveable(ship) {
  ship.elem.removeEventListener('mousedown', dragStart);
  ship.elem.removeEventListener('touchstart', dragStart);
}

function makeShipsMoveable(ships) {
  ships.forEach((ship) => makeShipMoveable(ship));
}

function makeShipsUnmoveable(ships) {
  ships.forEach((ship) => makeShipUnmoveable(ship));
}

function getCurrentBoard(event) {
  let elem = event.target;
  while (!elem.classList.contains('board')) {
    elem = elem.parentNode;
  }
  return players.find((player) => player.board.elem === elem).board;
}

function getCurrentShip(event) {
  let elem = event.target;
  while (!elem.classList.contains('ship')) {
    elem = elem.parentNode;
  }
  return currentBoard.ships.find((ship) => ship.elem === elem);
}

function getCurrentShipSquare(event) {
  const ship = currentShip;
  const rect = ship.elem.getBoundingClientRect();
  let pointerFromLeft;
  let pointerFromTop;
  if (event.type === 'touchstart') {
    pointerFromLeft = event.touches[0].clientX - rect.left;
    pointerFromTop = event.touches[0].clientY - rect.top;
  } else {
    pointerFromLeft = event.clientX - rect.left;
    pointerFromTop = event.clientY - rect.top;
  }
  if (ship.dir === 'hor') {
    const square = Math.floor((pointerFromLeft * ship.length) / rect.width);
    return square;
  } else if (ship.dir === 'ver') {
    const square = Math.floor((pointerFromTop * ship.length) / rect.height);
    return square;
  }
}

function getCurrents(event) {
  currentBoard = getCurrentBoard(event);
  currentShip = getCurrentShip(event);
  currentShipSquare = getCurrentShipSquare(event);
}

function resetCurrents() {
  currentBoard = null;
  currentShip = null;
  currentShipSquare = null;
  hasMoved = false;
}

function dragStart(event) {
  event.preventDefault();
  getCurrents(event);

  document.addEventListener('mousemove', drag);
  document.addEventListener('touchmove', drag);

  document.addEventListener('mouseup', rotate);
  document.addEventListener('touchend', rotate);

  document.addEventListener('mouseup', dragEnd);
  document.addEventListener('touchend', dragEnd);
}

function drag(event) {
  const ship = currentShip;
  const square = currentShipSquare;
  const coords = getGridCoordinates(event, currentBoard);
  ship.dir === 'hor' ? (coords.x -= square) : (coords.y -= square);

  const squares = currentBoard.getSquares(coords, ship.dir, ship.length);
  if (currentBoard.checkSquaresValidity(squares, ship.length, ship)) {
    if (ship.pos.x !== coords.x || ship.pos.y !== coords.y) {
      hasMoved = true;
    }
    currentBoard.placeShip(ship, coords, ship.dir);
  }
}

function dragEnd() {
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('touchmove', drag);
  document.removeEventListener('mouseup', rotate);
  document.removeEventListener('touchend', rotate);
  document.removeEventListener('mouseup', dragEnd);
  document.removeEventListener('touchend', dragEnd);
  resetCurrents();
}

function rotate(event) {
  if (hasMoved === false) {
    event.preventDefault();
    getCurrents(event);
    try {
      currentBoard.rotateShip(currentShip);
      // update ship elem class
      if (currentShip.elem.classList.contains('hor')) {
        currentShip.elem.classList.remove('hor');
        currentShip.elem.classList.add('ver');
      } else if (currentShip.elem.classList.contains('ver')) {
        currentShip.elem.classList.remove('ver');
        currentShip.elem.classList.add('hor');
      }
    } catch (error) {
      addTempClass(currentShip.elem, 'invalid', 700);
    }

    resetCurrents();
  }
}

function addTempClass(elem, className, duration) {
  elem.classList.add(className);
  setTimeout(() => elem.classList.remove(className), duration);
}

/*
HANDLING DIFFERENT SCREENS OF THE GAME
*/

function createBtnElem(text, func, optClass) {
  const btnElem = document.createElement('button');
  btnElem.textContent = text;
  btnElem.className = 'btn';
  if (optClass) btnElem.classList.add(optClass);
  btnElem.onclick = func;
  return btnElem;
}

function createInfoElem(text) {
  const infoElem = document.createElement('div');
  const iconElem = document.createElement('img');
  infoElem.textContent = text;
  infoElem.className = 'info';
  iconElem.src = './assets/info-icon.svg';
  iconElem.alt = 'information icon';
  infoElem.prepend(iconElem);
  return infoElem;
}

// position ships screen
function displayPositionShips(player) {
  clearMain();
  main.className = 'placing';
  const col1 = document.createElement('div');
  const col2 = document.createElement('div');

  const heading = document.createElement('h2');
  heading.textContent = 'Position your ships:';

  const infos = document.createElement('div');
  infos.className = 'infos';
  const info1 = createInfoElem('Click and drag a ship to move it');
  const info2 = createInfoElem('Click once on a ship to rotate it');
  infos.appendChild(info1);
  infos.appendChild(info2);

  col1.appendChild(heading);
  col1.appendChild(player.board.elem);
  col1.appendChild(infos);

  const btn1 = createBtnElem('Start Game', startGame);
  const btn2 = createBtnElem('Randomize Ships', btn2Func);

  function btn2Func() {
    player.board.populateRandomly();
    makeShipsMoveable(player.board.ships);
  }

  col2.appendChild(btn1);
  col2.appendChild(btn2);

  main.appendChild(col1);
  main.appendChild(col2);

  player.board.ships.forEach((ship) => {
    positionElem(ship.elem, ship.pos.x, ship.pos.y, player.board);
  });

  makeShipsMoveable(player.board.ships);
}

function displayBoards(players) {
  clearMain();
  main.className = 'playing';

  players.forEach((player) => {
    displayBoard(player.board);
    makeShipsUnmoveable(player.board.ships);
  });
}

function displayGameOver(winner, nbOfMoves) {
  const modalWrapper = document.createElement('div');
  const modal = document.createElement('div');
  const text = document.createElement('p');
  const btn = createBtnElem('Play again', setupGame);

  modalWrapper.className = 'modal-wrapper';
  modal.className = 'modal';

  text.textContent = `${winner} won in ${nbOfMoves} moves!`;

  modal.appendChild(text);
  modal.appendChild(btn);
  modalWrapper.appendChild(modal);

  displayElem(modalWrapper);
}

/* Turn info */

function createTurnInfoElem() {
  const infoElem = document.createElement('div');
  infoElem.id = 'turn-info';
  infoElem.textContent = 'This is your turn to play';
  return infoElem;
}

function displayTurnInfo() {
  const infoElem = createTurnInfoElem();
  main.prepend(infoElem);
}

function setTurnInfo(playerType) {
  const infoElem = document.getElementById('turn-info');
  infoElem.textContent = `${playerType == 'human' ? 'You' : 'Computer'} turn`;
}

export {
  createBoardElem,
  createShipElem,
  displayBoard,
  makeBoardPlayable,
  makeBoardUnplayable,
  positionElem,
  drawAttack,
  changeShipColor,
  displayPositionShips,
  displayBoards,
  displayGameOver,
  displayTurnInfo,
  setTurnInfo,
};
