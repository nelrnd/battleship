import { Player } from '../classes/Player.js';

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
