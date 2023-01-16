/* GAME LOGIC */

import { Player } from './classes/Player.js';
import { createBoardElem, displayElem } from './dom.js';

const players = [];
let turn = 0;

function switchTurn() {
  turn++ % 2;
}

function getCurrent() {
  return players[turn];
}

function getOpponent() {
  return players[Math.abs(turn - 1)];
}

function setupGame() {
  if (players.length === 0) {
    players.push(new Player('human'));
    players.push(new Player('computer'));
  }

  turn = 0;

  players.forEach((player) => player.board.populateRandomly());
}

function startGame() {
  while (!getCurrent().board.allShipsSunk) {
    let current = getCurrent();
    let opponent = getOpponent();
    if (current.type === 'computer') {
      current.playRandom(opponent.board);
    } else {
      // not ready yet
    }
  }
}

setupGame();
const boardElem = createBoardElem(players[0].board);
displayElem(boardElem);
