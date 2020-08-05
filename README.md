### Task Lists

- [x] sudoku solver.
- [x] sudoku generator based on 1 seed.
- [x] sudoku generator based on random seed.
- [ ] sudoku -> HTML DOM. result -> HTML DOM implementation will be carried out at later date.

The sudoku solver logic in the `./dump` folder is usable. It requires some time to compute because it uses the backtracking strategy.

The **current** sudoku generator uses the swap, sort, shrink strategy. This approach require another strategy to solve without problem. **It's not production ready.**

Please feel free to make a PR to solve the current problem:

    ```
    // debug only: ERROR vertical steps 2 needs new strategy
    subGridRowLength = 2;
    gridNestedArray = [
        [3, 2, 3, 1],
        [4, 1, 2, 4],
        [3, 4, 3, 1],
        [1, 2, 2, 4]
    ];

    // debug only: ERROR vertical steps 1 needs new strategy
    subGridRowlength = 2;
    gridNestedArray = [
        [8,4,5,4,6,3,1,6,9],
        [3,1,2,9,8,7,4,8,3],
        [9,6,7,1,5,2,5,2,7],
        [2,3,4,6,7,3,1,9,8],
        [8,1,6,9,4,5,2,5,4],
        [7,5,9,8,1,2,7,3,6],
        [2,9,5,4,9,8,3,2,8],
        [7,1,3,3,1,7,4,6,5],
        [6,4,8,5,6,2,9,7,1]
    ];
    ```

### The Swap, Sort, Shrink Strategy

Swap: Only swap between `unsorted with unsorted` and `sorted with sorted` box.

Sort: See the diagram below, sorted row / column should not swap with different row / column.

Shrink: Horizontal -> Veritcal -> Horizontal -> repeat.

```
4x4
[┌, ─, ─, ─]
[|, ┌, ─, ─]
[|, |, ┌, ─|
[|, |, |,  ]

9x9
X ┌, ─, ─, X ─, ─, ─, X ─, ─, ─ X
X |, ┌, ─, X ─, ─, ─, X ─, ─, ─ X
X |, |, ┌, X ─, ─, ─, X ─, ─, ─ X
X----------+----------+---------X
X |, |, |, X ┌, ─, ─, X ─, ─, ─ X
X |, |, |, X |, ┌, ─, X ─, ─, ─ X
X |, |, |, X |, |, ┌, X ─, ─, ─ X
X----------+--------+-----------X
X |, |, |, X |, |, |, X ┌, ─, ─ X
X |, |, |, X |, |, |, X |, ┌, ─ X
X |, |, |, X |, |, |, X |, |    X
```

### Functions

- newGrid(subGridRowLength) to populate valid Sudoku.