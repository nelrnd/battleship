import { Ship } from '../classes/Ship.js';

test('Creating a ship', () => {
  const ship = new Ship();
  expect(ship.length).toBe(3);
});

test('Creating a ship of length 5', () => {
  const ship = new Ship(5);
  expect(ship.length).toBe(5);
});

test('Checking if unplaced ship is placed', () => {
  const ship = new Ship();
  expect(ship.isPlaced).toBe(false);
});

test('Placing a ship', () => {
  const ship = new Ship();
  ship.place({ x: 2, y: 4 }, 'hor');
  expect(ship.pos.x).toBe(2);
  expect(ship.pos.y).toBe(4);
  expect(ship.dir).toBe('hor');
});

test('Checking if placed ship is placed', () => {
  const ship = new Ship();
  ship.place({ x: 2, y: 4 }, 'hor');
  expect(ship.isPlaced).toBe(true);
});

test('Removing a placed ship', () => {
  const ship = new Ship();
  ship.place({ x: 2, y: 4 }, 'hor');
  ship.remove();
  expect(ship.pos).toBe(undefined);
  expect(ship.dir).toBe(undefined);
});

test('Checking if removed ship is placed', () => {
  const ship = new Ship();
  ship.place({ x: 2, y: 4 }, 'hor');
  ship.remove();
  expect(ship.isPlaced).toBe(false);
});

test('Rotating a ship', () => {
  const ship = new Ship(3);
  ship.place({ x: 2, y: 2 }, 'hor');
  ship.rotate();
  expect(ship.dir).toBe('ver');
  ship.rotate();
  expect(ship.dir).toBe('hor');
  expect(ship.pos.x).toBe(2);
  expect(ship.pos.y).toBe(2);
});

test('Hitting a ship', () => {
  const ship = new Ship();
  ship.hit();
  expect(ship.hits).toBe(1);
  ship.hit();
  expect(ship.hits).toBe(2);
});

test('Checking if unsunk ship is sunked', () => {
  const ship = new Ship();
  expect(ship.isSunk).toBe(false);
});

test('Checking if sunk ship is sunk', () => {
  const ship = new Ship(3);
  ship.hit();
  ship.hit();
  ship.hit();
  expect(ship.isSunk).toBe(true);
});
