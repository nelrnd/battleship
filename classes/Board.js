import {
  drawAttack,
  changeShipColor,
  positionElem,
  createShipElem,
} from '../dom.js';
import { Ship } from './Ship.js';

export class Board {
  constructor(size) {
    this.grid = this.createGrid(size);
    this.ships = [];
    this.receivedAttacks = [];
  }

  get allShipsPlaced() {
    return this.ships.length === 5 && this.ships.every((ship) => ship.isPlaced);
  }

  get allShipsSunked() {
    return this.ships.length === 5 && this.ships.every((ship) => ship.isSunk);
  }

  createGrid(size = 10) {
    const grid = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const square = new Square(x, y);
        grid.push(square);
      }
    }
    return grid;
  }

  getSquare(x, y) {
    return this.grid.find((square) => square.x === x && square.y === y);
  }

  getSquares(pos, dir, length) {
    let x = pos.x;
    let y = pos.y;
    const squares = [];
    for (let i = 0; i < length; i++) {
      let square = this.getSquare(x, y);
      if (square) {
        squares.push(square);
        dir === 'hor' ? x++ : y++;
      }
    }
    return squares;
  }

  checkSquaresValidity(squares, length, ship) {
    if (squares.length !== length) return false;
    if (squares.some((sq) => sq.hasShip && sq.ship !== ship)) return false;
    return true;
  }

  placeShip(ship, pos, dir) {
    const squares = this.getSquares(pos, dir, ship.length);
    const isValid = this.checkSquaresValidity(squares, ship.length, ship);
    if (!isValid) throw 'Invalid ship placement';

    if (ship.isPlaced) {
      const shipSquares = this.getSquares(ship.pos, ship.dir, ship.length);
      shipSquares.forEach((square) => square.removeShip());
    }

    ship.place(pos, dir);
    squares.forEach((square) => (square.ship = ship));

    if (!this.ships.includes(ship)) this.ships.push(ship);

    if (!ship.elem && this.elem) {
      createShipElem(ship);
      this.elem.querySelector('.ships').appendChild(ship.elem);
    }

    if (this.elem && ship.elem) {
      positionElem(ship.elem, pos.x, pos.y, this);
    }
  }

  removeShips() {
    this.ships.forEach((ship) => {
      const squares = this.getSquares(ship.pos, ship.dir, ship.length);
      squares.forEach((square) => square.removeShip());
      ship.remove();
      if (ship.elem) ship.elem.remove();
    });
    this.ships.length = 0;
  }

  rotateShip(ship) {
    const newDir = ship.dir === 'hor' ? 'ver' : 'hor';
    this.placeShip(ship, ship.pos, newDir);
  }

  receiveAttack(x, y) {
    const square = this.getSquare(x, y);

    if (this.findAttack(x, y)) throw 'Location already attacked';
    if (!this.checkAttackValidity(x, y)) throw 'Invalid attack location';

    const attack = { x, y };

    square.shot = true;
    this.receivedAttacks.unshift(attack);

    const ship = square.ship;

    if (ship) {
      ship.hit();
    }

    if (this.elem) {
      drawAttack(attack, this);
    }

    if (this.elem && ship && ship.isSunk) {
      changeShipColor(ship.elem);
    }
  }

  findAttack(x, y) {
    const attack = this.receivedAttacks.find(
      (attack) => attack.x === x && attack.y === y
    );
    return attack;
  }

  checkAttackValidity(x, y) {
    return !this.findAttack(x, y) && !!this.getSquare(x, y);
  }

  populateRandomly() {
    this.removeShips();
    const shipLengths = [5, 4, 3, 3, 2];
    const gridSize = Math.sqrt(this.grid.length);

    for (let i = 0; i < shipLengths.length; i++) {
      const ship = new Ship(shipLengths[i]);
      let placed = false;

      while (!placed) {
        let x = Math.floor(Math.random() * gridSize);
        let y = Math.floor(Math.random() * gridSize);
        const pos = { x, y };
        const dir = Math.floor(Math.random() * 2) === 0 ? 'hor' : 'ver';

        const squares = this.getSquares(pos, dir, ship.length);
        if (this.checkSquaresValidity(squares, ship.length)) {
          this.placeShip(ship, pos, dir);
          placed = true;
        }
      }
    }
  }

  clearAttacks() {
    this.grid.forEach((square) => {
      if (square.shot) square.shot = false;
    });
    this.receivedAttacks.length = 0;
  }
}

// Grid square
class Square {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.ship = null;
    this.shot = false;
  }

  get hasShip() {
    return this.ship ? true : false;
  }

  removeShip() {
    this.ship = null;
  }
}
