/// a string of digits, 1 - 9, and '0' as spaces. Each character represent a square, e.g.,
/// 5 3 . | . 7 . | . . .
/// 6 . . | 1 9 5 | . . .
/// . 9 8 | . . . | . 6 .
/// ------+-------+------
/// 8 . . | . 6 . | . . 3
/// 4 . . | 8 . 3 | . . 1
/// 7 . . | . 2 . | . . 6
/// ------+-------+------
/// . 6 . | . . . | 2 8 .
/// . . . | 4 1 9 | . . 5
/// . . . | . 8 . | . . .

var grid = [[5,3,0,0,7,0,0,0,0],
        [6,0,0,1,9,5,0,0,0],
        [0,9,8,0,0,0,0,6,0],
        [8,0,0,0,6,0,0,0,3],
        [4,0,0,8,0,3,0,0,1],
        [7,0,0,0,2,0,0,0,6],
        [0,6,0,0,0,0,2,8,0],
        [0,0,0,4,1,9,0,0,5],
        [0,0,0,0,8,0,0,7,9]];

function possible(r,c,n) {
  /// check the row
  for (let i=0;i<9;i++) if (grid[r][i] == n) return false;
  /// check the column
  for (let i=0;i<9;i++) if (grid[i][c] == n) return false;
  /// check the 3x3 grid
  let r0 = Math.floor(r/3)*3;
  let c0 = Math.floor(c/3)*3;
  for (let i=0;i<3;i++) {
    for (let j=0;j<3;j++) {
      if (grid[r0+i][c0+j] == n) return false;
    }
  }
  /// all check passed
  return true;
}

function solve() {
    for (let r=0;r<9;r++) {
      for (let c=0;c<9;c++) {
        /// check grid with value of 0
        if (grid[r][c] === 0) {
          /// check for possible solution
          for (let n=1;n<10;n++) {
            if (possible(r,c,n)) { 
              /// there is a possibility of the selected solution is a bad one.
              /// to solve this, use backtracking: try -> if it turns out the solution is a bad one, we go back to 0.
              grid[r][c] = n;
              /// recursion
              solve();
              grid[r][c] = 0;
            }
          }
          /// if there is no solution, we have to return.
          return;
        }
      }
    }
    console.log(grid);
}

solve()

/// Difficulty represent the number of squares with digits.
/// "easy":      62
/// "easy-2":    53
/// "easy-3":    44
/// "medium":    35
/// "hard":      26
/// "very-hard": 17