import { Board } from '../classes/Board.js';
import { Ship } from '../classes/Ship.js';

test('Creating a board', () => {
  const board = new Board();
  expect(board.grid.length).toBe(100);
});

test('Creating a 6x6 board', () => {
  const board = new Board(6);
  expect(board.grid.length).toBe(36);
});

test('Get square from board grid', () => {
  const board = new Board();
  const square = board.getSquare(4, 6);
  expect(square.x).toBe(4);
  expect(square.y).toBe(6);
});

test('Try getting inexistant square from board grid', () => {
  const board = new Board();
  const square = board.getSquare(-3, 12);
  expect(square).toBe(undefined);
});

test('Getting squares from pos, dir and length', () => {
  const board = new Board();
  const squares = board.getSquares({ x: 0, y: 0 }, 'hor', 4);
  expect(squares.length).toBe(4);
  expect(squares.pop().x).toBe(3);
});

test('Try getting squares, where some squares are inexistant', () => {
  const board = new Board();
  const squares = board.getSquares({ x: 8, y: 0 }, 'hor', 4);
  expect(squares.length).not.toBe(4);
});

test('Checking if valid squares are valid for ship placement', () => {
  const board = new Board();
  const squares = board.getSquares({ x: 2, y: 3 }, 'hor', 4);
  expect(board.checkSquaresValidity(squares, 4)).toBe(true);
});

test('Checking if invalid squares are valid for ship placement', () => {
  const board = new Board();
  const squares = board.getSquares({ x: 8, y: 2 }, 'hor', 4);
  expect(board.checkSquaresValidity(squares, 4)).toBe(false);
});

test('Placing a ship on board', () => {
  const board = new Board();
  const ship = new Ship();
  board.placeShip(ship, { x: 3, y: 3 }, 'ver');
  expect(ship.isPlaced);
  expect(board.getSquare(3, 3).ship).toBe(ship);
  expect(board.getSquare(3, 5).ship).toBe(ship);
});

test('Try placing ship at invalid placement', () => {
  const board = new Board(10);
  const ship = new Ship(4);
  expect(() => board.placeShip(ship, { x: 7, y: 2 }, 'hor')).toThrow(
    'Invalid ship placement'
  );
  expect(ship.isPlaced).toBe(false);
});

test('Placing an already placed ship to a new location', () => {
  const board = new Board();
  const ship = new Ship();
  board.placeShip(ship, { x: 2, y: 2 }, 'hor');
  board.placeShip(ship, { x: 3, y: 1 }, 'ver');
  expect(board.getSquare(4, 2).ship).toBe(null);
  expect(board.getSquare(3, 3).ship).toBe(ship);
  expect(board.ships.length).toBe(1);
});

test('Try placing ship on top of another', () => {
  const board = new Board();
  const ship1 = new Ship();
  const ship2 = new Ship();

  board.placeShip(ship1, { x: 2, y: 2 }, 'hor');
  expect(() => board.placeShip(ship2, { x: 3, y: 1 }, 'ver')).toThrow(
    'Invalid ship placement'
  );
});

test('Rotating a placed ship', () => {
  const board = new Board();
  const ship = new Ship();
  board.placeShip(ship, { x: 3, y: 4 }, 'hor');
  board.rotateShip(ship);
  expect(board.getSquare(5, 4).hasShip).toBe(false);
  expect(board.getSquare(3, 6).ship).toBe(ship);
  expect(ship.dir).toBe('ver');
});

test('Try rotating ship at incorrect placement', () => {
  const board = new Board();
  const ship = new Ship(4);
  board.placeShip(ship, { x: 3, y: 8 }, 'hor');
  expect(() => board.rotateShip(ship)).toThrow('Invalid ship placement');
});

test('Try rotating a ship on top of another', () => {
  const board = new Board();
  const ship1 = new Ship();
  const ship2 = new Ship();
  board.placeShip(ship1, { x: 2, y: 0 }, 'hor');
  board.placeShip(ship2, { x: 2, y: 2 }, 'hor');
  expect(() => board.rotateShip(ship1)).toThrow('Invalid ship placement');
});

test('Attacking board', () => {
  const board = new Board();
  board.receiveAttack(3, 5);
  expect(board.receivedAttacks.length).toBe(1);
  expect(board.getSquare(3, 5).shot).toBe(true);
});

test('Attacking board, hitting a ship', () => {
  const board = new Board();
  const ship = new Ship();
  board.placeShip(ship, { x: 3, y: 2 }, 'hor');
  board.receiveAttack(3, 2);
  expect(ship.hits).toBe(1);
});

test('Attacking board multiple times, sunking a ship', () => {
  const board = new Board();
  const ship = new Ship();
  board.placeShip(ship, { x: 3, y: 2 }, 'hor');
  board.receiveAttack(3, 2);
  board.receiveAttack(4, 2);
  board.receiveAttack(5, 2);
  expect(ship.hits).toBe(3);
  expect(ship.isSunk).toBe(true);
});

test('Try attacking board at invalid location', () => {
  const board = new Board();
  expect(() => board.receiveAttack(-3, 12)).toThrow('Invalid attack location');
});

test('Try attacking board at already attacked location', () => {
  const board = new Board();
  board.receiveAttack(3, 2);
  expect(() => board.receiveAttack(3, 2)).toThrow('Location already attacked');
});

test('Checking if attack location is valid', () => {
  const board = new Board();
  expect(board.checkAttackValidity(3, 5)).toBe(true);
});

test('Checking if invalid attack location is valid', () => {
  const board = new Board();
  expect(board.checkAttackValidity(-3, 12)).toBe(false);
});

test('Checking if already attacked attack location is valid', () => {
  const board = new Board();
  board.receiveAttack(3, 5);
  expect(board.checkAttackValidity(3, 5)).toBe(false);
});

test('Populating board with ships randomly', () => {
  const board = new Board();
  board.populateRandomly();
  expect(board.ships.length).toBe(5);
  expect(board.ships.every((ship) => ship.isPlaced));
});

test('Populating board with ships randomly when there is already ships', () => {
  const board = new Board();
  board.populateRandomly();
  board.populateRandomly();
  expect(board.ships.length).toBe(5);
  expect(board.ships.every((ship) => ship.isPlaced));
});

test('Checking if all ships are placed on board when no ship is placed', () => {
  const board = new Board();
  expect(board.allShipsPlaced).toBe(false);
});

test('Checking if all ships are placed after populating board randomly', () => {
  const board = new Board();
  board.populateRandomly();
  expect(board.allShipsPlaced).toBe(true);
});

test('Checking if all ships are sunk when there is no ship', () => {
  const board = new Board();
  expect(board.allShipsSunked).toBe(false);
});

test('Checking if all ships are sunk when no ship is sunk', () => {
  const board = new Board();
  board.populateRandomly();
  expect(board.allShipsSunked).toBe(false);
});

test('Checking if all ships are sunk when all ships are sunk', () => {
  const board = new Board();
  board.populateRandomly();

  for (let i = 0; i < 100; i++) {
    let played = false;
    while (!played) {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      if (board.checkAttackValidity(x, y)) {
        board.receiveAttack(x, y);
        played = true;
      }
    }
  }

  expect(board.allShipsSunked).toBe(true);
});

test('Clearing attacks a board', () => {
  const board = new Board();
  board.receiveAttack(6, 6);

  board.clearAttacks();
  expect(board.receivedAttacks.length).toBe(0);
  expect(board.getSquare(6, 6).shot).toBe(false);
});
