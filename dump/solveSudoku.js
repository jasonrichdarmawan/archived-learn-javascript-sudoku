/* a string of digits, 1 - 9, and '0' as spaces. Each character represent a square, e.g.,
5 3 . | . 7 . | . . .
6 . . | 1 9 5 | . . .
. 9 8 | . . . | . 6 .
------+-------+------
8 . . | . 6 . | . . 3
4 . . | 8 . 3 | . . 1
7 . . | . 2 . | . . 6
------+-------+------
. 6 . | . . . | 2 8 .
. . . | 4 1 9 | . . 5
. . . | . 8 . | . 7 9 
let grid = [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
];
*/

/// the grid is a solved sudoku and used as the seed for the puzzle generator.
let grid = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9]
];

function possible(r, c, n) {
  /// check the row / horizontal
  for (let i=0;i<9;i++) if (grid[r][i] === n) return false;
  /// check the column / vertical
  for (let i=0;i<9;i++) if (grid[i][c] === n) return false;
  // check the sub-grid / 3x3 grid.
  /// define the r0 and c0 of the su-grid.
  let r0 = Math.floor(Math.floor(r/3) * 3);
  let c0 = Math.floor(Math.floor(c/3) * 3);
  /// check the row -> check the column
  for (let i=0;i<3;i++) {
      for (let j=0;j<3;j++) {
          if (grid[r0+i][c0+j] === n) return false;
      }
  }
  /// all check passed
  return true;
}

let result;
let count = 0;

function solve(variable) {
  /// check the row -> check the column for grid with property value of 0.
  for (let r=0;r<9;r++) {
      for (let c=0;c<9;c++) {
          if (variable[r][c] === 0) {
              //console.log(`${r},${c}`)
              /// check for possible solution
              for (let n=1;n<10;n++) {
                  //console.log(`${r},${c},${n}`)
                  if (possible(r,c,n)) {
                      console.log(`possible ${r},${c},${n}`)
                      variable[r][c] = n;
                      // recursive function
                      solve(variable);
                      /// there is a high chance of generating bad solution
                      /// read comments outside the Loop arguments.
                      /// backtrack -> set the value to 0 to start from the new solution
                      console.log(`false ${r},${c},${n}`)
                      variable[r][c] = 0;
                  }
              }
              /// if there is no solution -> backtrack
              console.log(`${JSON.stringify(grid)} ${r},${c}`);
              return;
          }
      }
  }
  /// return the object value -> to a variable.
  console.log('start')
  console.log(`${JSON.stringify(variable)}`);
  console.log('end')
  count++
  result = JSON.stringify(variable);
}

let isNotProperPuzzle = false;
function isItProperPuzzle() {
  if (count > 1) isNotProperPuzzle = true;
}

function generate(difficulty) {
  //console.log(`puzzle ${puzzle}`)
  /// set random grid value to 0
  r = Math.floor(Math.random() * 8);
  c = Math.floor(Math.random() * 8);
  grid[r][c] = 0;
  memory = grid;
  /// solve the puzzle;
  solve(grid); count--;
  /// if there is more than 1 solution -> stop.
  if (count > 0) {
      /// ... stop -> go back to previous memory;
      memory = grid;
      //console.log("stop");
      return;
  } else grid = memory;
  if (difficulty === 1) return 1;
  return generate(difficulty-1);
}

generate(17);

/// Difficulty represent the number of squares with digits.
/// "easy":      62
/// "easy-2":    53
/// "easy-3":    44
/// "medium":    35
/// "hard":      26
/// "very-hard": 17