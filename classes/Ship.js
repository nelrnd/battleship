export class Ship {
  constructor(length = 3) {
    this.length = length;
    this.hits = 0;
  }

  get isPlaced() {
    return this.pos && this.dir ? true : false;
  }

  get isSunk() {
    return this.hits >= this.length ? true : false;
  }

  place(pos, dir) {
    this.pos = pos;
    this.dir = dir;
  }

  remove() {
    this.pos = undefined;
    this.dir = undefined;
  }

  rotate() {
    this.dir = this.dir === 'hor' ? 'ver' : 'hor';
  }

  hit() {
    this.hits++;
  }
}
