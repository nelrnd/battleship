/* MAIN GAME VARIABLES AND FUNCTIONS */

import { Player } from './classes/Player.js';
import {
  createBoardElem,
  displayBoard,
  makeBoardPlayable,
  makeBoardUnplayable,
} from './dom.js';

const players = [];
let turn = 0;

function switchTurn() {
  if (players.length === 2) {
    turn = Math.abs(turn - 1);
    playTurn();
  }
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
    if (player.type === 'computer') {
      player.board.elem.classList.add('opponent');
    }
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

  if (current.board.allShipsSunked) {
    endGame(opponent);
    return;
  }

  if (current.type === 'human') {
    makeBoardPlayable(current, opponent.board);
  } else {
    makeBoardUnplayable(current.board);
    setTimeout(() => {
      current.playSmart(opponent.board);
    }, 1000);
  }
}

function endGame(winner) {
  players.forEach((player) => {
    makeBoardUnplayable(player.board);
  });
  alert(`Game over! Winner is ${winner.type}`);
}

export { players, switchTurn, createPlayers, setupGame, startGame };
