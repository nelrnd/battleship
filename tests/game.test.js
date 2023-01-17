test('switching turn', () => {
  let turn = 0;
  function switchTurn() {
    turn = Math.abs(turn - 1);
  }

  switchTurn();
  expect(turn).toBe(1);
  switchTurn();
  expect(turn).toBe(0);
  switchTurn();
  expect(turn).toBe(1);
  switchTurn();
  expect(turn).toBe(0);
});
