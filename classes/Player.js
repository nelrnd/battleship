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

  playSmart(board) {
    // check if there is a previous attack that hit a ship but didn't sunk it
    const hitNotSunkAttack = this.findHitNotSunkAttack(board);
    if (hitNotSunkAttack) {
      // check if that attack has an adjacent attack that also hit the ship
      const adjacentHitAttack = this.findAdjHitAttack(hitNotSunkAttack, board);
      if (adjacentHitAttack) {
        // get coords from other side of adjacent attack
        const otherSideAttack = this.getOtherSideAttack(
          hitNotSunkAttack,
          adjacentHitAttack
        );
        this.play(otherSideAttack, board);
      } else {
        const nearbyValidAttack = this.findNearbyValidAttack(
          hitNotSunkAttack,
          board
        );
        this.play(nearbyValidAttack, board);
      }
    } else {
      this.playRandom(board);
    }
  }

  findHitNotSunkAttack(board) {
    const attacks = board.receivedAttacks;
    return attacks.find(
      (attack) =>
        board.getSquare(attack.x, attack.y).ship &&
        board.getSquare(attack.x, attack.y).ship.isSunk === false
    );
  }

  findNearbyValidAttack(attack, board) {
    const [x, y] = [attack.x, attack.y];
    // searching from top, right, bottom, left of attack
    const top = { x, y: y - 1 };
    const right = { x: x + 1, y };
    const bottom = { x, y: y + 1 };
    const left = { x: x - 1, y };
    const sides = [top, right, bottom, left];

    let nearbyValidAttack = undefined;

    for (let i = 0; i < sides.length; i++) {
      const [x, y] = [sides[i].x, sides[i].y];

      const attackIsValid = board.checkAttackValidity(x, y);
      if (attackIsValid) {
        nearbyValidAttack = sides[i];
        break;
      }
    }

    return nearbyValidAttack;
  }

  findAdjHitAttack(attack, board) {
    const [x, y] = [attack.x, attack.y];
    // searching from top, right, bottom, left of attack
    const top = { x, y: y - 1 };
    const right = { x: x + 1, y };
    const bottom = { x, y: y + 1 };
    const left = { x: x - 1, y };
    const sides = [top, right, bottom, left];

    let adjacentHitAttack = undefined;

    for (let i = 0; i < sides.length; i++) {
      const [x, y] = [sides[i].x, sides[i].y];

      const adjacentExist = board.findAttack(x, y);
      if (adjacentExist) {
        adjacentHitAttack = sides[i];
        break;
      }
    }

    return adjacentHitAttack;
  }

  findOtherSideAttack(firstAttack, secondAttack) {
    if (firstAttack.x > secondAttack.x) {
      return { x: firstAttack.x + 1, y: firstAttack.y };
    } else if (firstAttack.x < secondAttack.x) {
      return { x: firstAttack.x - 1, y: firstAttack.y };
    } else if (firstAttack.y > secondAttack.y) {
      return { x: firstAttack.x, y: firstAttack.y + 1 };
    } else if (firstAttack.y < secondAttack.y) {
      return { x: firstAttack.x, y: firstAttack.y - 1 };
    } else {
      return undefined;
    }
  }
}
