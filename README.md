### Task Lists

- [x] sudoku solver.
- [x] sudoku generator based on 1 seed.
- [x] sudoku generator based on random seed.
- [ ] sudoku -> HTML DOM. result -> HTML DOM implementation will be carried out at later date.

The sudoku solver logic in the `./dump` folder is usable. It requires some time to compute because it uses the backtracking strategy.

The **current** sudoku generator uses the swap, sort, shrink strategy. This approach require another strategy to solve without problem. **It's not production ready.**

Please feel free to make a PR to solve the current problem:

    ```
    // debug only: ERROR vertical steps 8 needs new strategy
    subGridRowLength = 3;
    gridNestedArray = [
        [5, 8, 3, 1, 9, 6, 7, 2, 8],
        [9, 7, 6, 2, 4, 5, 4, 3, 1],
        [1, 4, 2, 3, 8, 7, 5, 6, 9],
        [7, 2, 4, 6, 3, 1, 5, 9, 7],
        [8, 9, 1, 5, 2, 8, 6, 4, 3],
        [6, 3, 5, 4, 7, 9, 2, 1, 8],
        [2, 1, 8, 7, 5, 2, 6, 9, 5],
        [3, 6, 7, 9, 1, 4, 8, 3, 4],
        [4, 5, 9, 8, 6, 3, 1, 7, 2]
    ]
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