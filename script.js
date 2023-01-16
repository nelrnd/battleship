/* GAME LOGIC */

import { Player } from './classes/Player.js';

const players = [];
let turn = 0;

function setupGame() {
  if (players.length === 0) {
    players.push(new Player('human'));
    players.push(new Player('computer'));
  }

  turn = 0;

  players.forEach((player) => player.board.populateRandomly());
}

function startGame() {}

function switchTurn() {
  turn++ % 2;
}

function getCurrent() {
  return players[turn];
}

function getOpponent() {
  return players[Math.abs(turn - 1)];
}
