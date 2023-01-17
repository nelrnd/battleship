/* MAIN GAME VARIABLES AND FUNCTIONS */

import { Player } from './classes/Player.js';
import {
  createBoardElem,
  displayBoard,
  drawAttack,
  makeBoardPlayable,
} from './dom.js';

const players = [];
let turn = 0;

function switchTurn() {
  turn = Math.abs(turn - 1);
  playTurn();
}

function getCurrent() {
  return players[turn];
}

function getOpponent() {
  return players[Math.abs(turn - 1)];
}

function createPlayers() {
  players.length = 0;
  players.push(new Player('human'));
  players.push(new Player('computer'));
}

function setupGame() {
  players.forEach((player) => {
    player.board.populateRandomly();
    createBoardElem(player.board);
  });
}

function startGame() {
  turn = 0;

  players.forEach((player) => {
    displayBoard(player.board);
  });

  playTurn();
}

function playTurn() {
  let current = getCurrent();
  let opponent = getOpponent();

  if (current.type === 'human') {
    console.log('hey');
    makeBoardPlayable(current, opponent.board);
  } else {
    setTimeout(() => {
      current.playRandom(opponent.board);
    }, 1000);
  }
}

export { switchTurn, createPlayers, setupGame, startGame };
