import { createPlayers, endGame, setupGame, startGame } from './game.js';

createPlayers();
setupGame();

endGame({ type: 'computer' }, { board: { receivedAttacks: [1, 2, 3] } });
