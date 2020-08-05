### Task Lists

- [x] sudoku solver.
- [x] sudoku generator based on 1 seed.
- [x] sudoku generator based on random seed.
- [ ] sudoku -> HTML DOM. result -> HTML DOM implementation will be carried out at later date.

The sudoku solver logic in the `./dump` folder is usable. It requires some time to compute because it uses the backtracking strategy.

The **current** sudoku generator uses the swap, sort, shrink strategy. This approach require another strategy to solve without problem. **It's not production ready.**

Please feel free to make a PR to solve the current problem:

    ```
    // debug only: ERROR horizontal steps 3 needs new strategy
    subGridRowLength = 2;
    gridNestedArray = [
        [3,4,3,2],
        [1,2,1,4],
        [4,2,3,2],
        [3,1,1,4]
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