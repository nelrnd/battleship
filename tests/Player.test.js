import { Player } from '../classes/Player.js';
import { Ship } from '../classes/Ship.js';

test('Creating a player', () => {
  const player = new Player('human');
  expect(player.type).toBe('human');
  expect(player.board.grid.length).toBe(100);
});

test('Attacking opponent grid', () => {
  const player = new Player('human');
  const opponent = new Player('computer');

  player.play({ x: 2, y: 4 }, opponent.board);
  expect(opponent.board.receivedAttacks.length).toBe(1);
  expect(opponent.board.getSquare(2, 4).shot).toBe(true);
});

test('Play random move', () => {
  const player = new Player('human');
  const opponent = new Player('computer');

  player.playRandom(opponent.board);
  expect(opponent.board.receivedAttacks.length).toBe(1);
  const attack = opponent.board.receivedAttacks[0];
  expect(opponent.board.getSquare(attack.x, attack.y).shot).toBe(true);
});

test('Playing 100 random move to hit every opponent board squares', () => {
  const player = new Player('human');
  const opponent = new Player('computer');

  for (let i = 0; i < 100; i++) {
    player.playRandom(opponent.board);
  }

  expect(opponent.board.receivedAttacks.length).toBe(100);
  expect(opponent.board.getSquare(2, 5).shot).toBe(true);
  expect(opponent.board.getSquare(5, 7).shot).toBe(true);
});

test('Getting attack that hit a ship but did not sunk it', () => {
  const player = new Player('human');
  const opponent = new Player('computer');

  opponent.board.placeShip(new Ship(3), { x: 2, y: 2 }, 'hor');
  player.play({ x: 2, y: 2 }, opponent.board);

  const hitNotSunkAttack = player.findHitNotSunkAttack(opponent.board);
  expect(hitNotSunkAttack).toEqual({ x: 2, y: 2 });
});

test('Try getting attack that hit a ship but did not sunk it when there is not', () => {
  const player = new Player('human');
  const opponent = new Player('computer');

  opponent.board.placeShip(new Ship(3), { x: 2, y: 2 }, 'hor');
  player.play({ x: 2, y: 2 }, opponent.board);
  player.play({ x: 3, y: 2 }, opponent.board);
  player.play({ x: 4, y: 2 }, opponent.board);

  const hitNotSunkAttack = player.findHitNotSunkAttack(opponent.board);
  expect(hitNotSunkAttack).toBe(undefined);
});

test('Finding valid nearby attack', () => {
  const player = new Player('human');
  const opponent = new Player('computer');

  player.play({ x: 0, y: 1 }, opponent.board);
  expect(player.findNearbyValidAttack({ x: 0, y: 0 }, opponent.board)).toEqual({
    x: 1,
    y: 0,
  });
});

test('Try finding valid nearby attack when there is none', () => {
  const player = new Player('human');
  const opponent = new Player('computer');

  player.play({ x: 0, y: 1 }, opponent.board);
  player.play({ x: 1, y: 0 }, opponent.board);
  expect(player.findNearbyValidAttack({ x: 0, y: 0 }, opponent.board)).toBe(
    undefined
  );
});

test('Finding adjacent hit attack', () => {
  const player = new Player('human');
  const opponent = new Player('computer');
  opponent.board.placeShip(new Ship(3), { x: 2, y: 2 }, 'hor');
  player.play({ x: 2, y: 2 }, opponent.board);
  const adjAtck = player.findAdjHitAttack({ x: 3, y: 2 }, opponent.board);
  expect(adjAtck).toEqual({ x: 2, y: 2 });
});

test('Try finding adjacent hit attack when there is none', () => {
  const player = new Player('human');
  const opponent = new Player('computer');
  opponent.board.placeShip(new Ship(3), { x: 2, y: 2 }, 'hor');
  const adjAtck = player.findAdjHitAttack({ x: 3, y: 2 }, opponent.board);
  expect(adjAtck).toBe(undefined);
});

test('Finding attack on the other side of another', () => {
  const player = new Player('human');
  expect(player.findOtherSideAttack({ x: 3, y: 1 }, { x: 2, y: 1 })).toEqual({
    x: 4,
    y: 1,
  });
  expect(player.findOtherSideAttack({ x: 2, y: 3 }, { x: 2, y: 2 })).toEqual({
    x: 2,
    y: 4,
  });
  expect(player.findOtherSideAttack({ x: 3, y: 6 }, { x: 4, y: 6 })).toEqual({
    x: 2,
    y: 6,
  });
});

test('Checking if an attack is surrounded when it is', () => {
  const player = new Player('human');
  const opponent = new Player('computer');
  player.play({ x: 1, y: 0 }, opponent.board);
  player.play({ x: 2, y: 1 }, opponent.board);
  player.play({ x: 1, y: 2 }, opponent.board);
  player.play({ x: 0, y: 1 }, opponent.board);
  expect(player.checkIfAttackSurrounded({ x: 1, y: 1 }, opponent.board)).toBe(
    true
  );
});

test('Checking if an attack is surrounded when it not', () => {
  const player = new Player('human');
  const opponent = new Player('computer');
  player.play({ x: 1, y: 0 }, opponent.board);
  player.play({ x: 2, y: 1 }, opponent.board);
  player.play({ x: 1, y: 2 }, opponent.board);
  expect(player.checkIfAttackSurrounded({ x: 1, y: 1 }, opponent.board)).toBe(
    false
  );
});

test('Checking if an attack in corner is surrounded when it is', () => {
  const player = new Player('human');
  const opponent = new Player('computer');
  player.play({ x: 0, y: 0 }, opponent.board);
  player.play({ x: 1, y: 1 }, opponent.board);
  player.play({ x: 0, y: 2 }, opponent.board);
  expect(player.checkIfAttackSurrounded({ x: 0, y: 1 }, opponent.board)).toBe(
    true
  );
});
