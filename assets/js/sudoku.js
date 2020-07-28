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
. . . | . 8 . | . 7 9 */

var grid = [[5,3,0,0,7,0,0,0,0],
            [6,0,0,1,9,5,0,0,0],
            [0,9,8,0,0,0,0,6,0],
            [8,0,0,0,6,0,0,0,3],
            [4,0,0,8,0,3,0,0,1],
            [7,0,0,0,2,0,0,0,6],
            [0,6,0,0,0,0,2,8,0],
            [0,0,0,4,1,9,0,0,5],
            [0,0,0,0,8,0,0,7,9]];

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

function solve() {
    /// check the row -> check the column for grid with property value of 0.
    for (let r=0;r<9;r++) {
        for (let c=0;c<9;c++) {
            if (grid[r][c] === 0) {
                //console.log(`${r},${c}`)
                /// check for possible solution
                for (let n=1;n<10;n++) {
                    //console.log(`${r},${c},${n}`)
                    if (possible(r,c,n)) {
                        //console.log(`possible ${r},${c},${n}`)
                        grid[r][c] = n;
                        // recursive function
                        solve();
                        /// there is a high chance of generating bad solution
                        /// read comments outside the Loop arguments.
                        /// backtrack -> set the value to 0 to start from the new solution
                        grid[r][c] = 0;
                    }
                }
                /// if there is no solution -> backtrack
                console.log(JSON.stringify(grid))
                return;
            }
        }
    }
    /// return the object value -> to a variable.
    window.value = JSON.stringify(grid);
}

solve();

console.log(window.value)