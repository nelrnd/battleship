import { players } from './game.js';

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
  const attacksElem = createBoardAttacksElem();

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
  const pointerFromLeft = event.clientX - rect.left;
  const pointerFromTop = event.clientY - rect.top;
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

function makeShipMoveable(ship) {
  ship.elem.addEventListener('mousedown', dragStart);
  ship.elem.addEventListener('dblclick', rotate);
}

function makeShipUnmoveable(ship) {
  ship.elem.removeEventListener('mousedown', dragStart);
  ship.elem.removeEventListener('dblclick', rotate);
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
  const pointerFromLeft = event.clientX - rect.left;
  const pointerFromTop = event.clientY - rect.top;
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

function dragStart(event) {
  event.preventDefault();
  getCurrents(event);

  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);
}

function drag(event) {
  event.preventDefault();
  const ship = currentShip;
  const square = currentShipSquare;
  const coords = getGridCoordinates(event, currentBoard);
  currentShip.dir === 'hor' ? (coords.x -= square) : (coords.y -= square);

  const squares = currentBoard.getSquares(coords, ship.dir, ship.length);
  if (currentBoard.checkSquaresValidity(squares, ship.length, ship)) {
    currentBoard.placeShip(currentShip, coords, currentShip.dir);
  }
}

function dragEnd() {
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', dragEnd);
  currentBoard = null;
  currentShip = null;
  currentShipSquare = null;
}

function rotate(event) {
  event.preventDefault();
  getCurrents(event);
  currentBoard.rotateShip(currentShip);
  // update ship elem class
  if (currentShip.elem.classList.contains('hor')) {
    currentShip.elem.classList.remove('hor');
    currentShip.elem.classList.add('ver');
  } else if (currentShip.elem.classList.contains('ver')) {
    currentShip.elem.classList.remove('ver');
    currentShip.elem.classList.add('hor');
  }
}

export {
  createBoardElem,
  displayBoard,
  makeBoardPlayable,
  makeBoardUnplayable,
  positionElem,
  drawAttack,
  changeShipColor,
  makeShipMoveable,
};
