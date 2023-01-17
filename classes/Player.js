import { Board } from './Board.js';
import { switchTurn } from '../game.js';

export class Player {
  constructor(type) {
    this.type = type;
    this.board = new Board();
  }

  play(pos, board) {
    if (board.checkAttackValidity(pos.x, pos.y)) {
      board.receiveAttack(pos.x, pos.y);
      switchTurn();
    }
  }

  playRandom(board) {
    const gridSize = Math.sqrt(board.grid.length);
    let played = false;

    while (!played) {
      let x = Math.floor(Math.random() * gridSize);
      let y = Math.floor(Math.random() * gridSize);

      if (board.checkAttackValidity(x, y)) {
        board.receiveAttack(x, y);
        played = true;
        switchTurn();
      }
    }
  }
}
