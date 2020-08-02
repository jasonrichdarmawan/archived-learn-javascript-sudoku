let subGridRowLength;
let gridRowLength;
let gridLength;

function newGrid(value) {
  subGridRowLength = value;
  gridRowLength = Math.pow(subGridRowLength, 2)
  gridLength = Math.pow(subGridRowLength, 4);

  let gridFlatArray = [];
  let statusFlatArray = [];
  for (let i = 0; i < gridLength; i++) {
    gridFlatArray.push(0);
    statusFlatArray.push(false);
  }
  
  return flatToNestedArray(gridFlatArray, statusFlatArray);
}

let gridNestedArray = [];
let statusNestedArray = []; // true = sorted, false = not sorted yet.

function flatToNestedArray(gridFlatArray, statusFlatArray) {
  let i = 0;
  for (i = 0; i < gridLength; i += gridRowLength) {
    let tempGridRow = gridFlatArray.slice(i, i + gridRowLength);
    gridNestedArray.push(tempGridRow);

    let tempStatusRow = statusFlatArray.slice(i, i + gridRowLength);
    statusNestedArray.push(tempStatusRow);
  }

  return populateTheNestedArray();
}

function populateTheNestedArray() {
  // r0, c0 is relative to the Grid. r0, c0 is the NestedArray[0][0] of each subGrid.
  // rSG, cSG is relative to the subGrid.

  for (let r0 = 0; r0 < gridRowLength; r0 += subGridRowLength) {
    for (let c0 = 0; c0 < gridRowLength; c0 += subGridRowLength) {
      let numbers = possibleNumbers();
      for (let rSG = 0; rSG < subGridRowLength; rSG++) {
        for (let cSG = 0; cSG < subGridRowLength; cSG++) {
          n = Math.floor(Math.random() * gridRowLength + 1); // random 1 to 9
          if (numbers.indexOf(n) > -1) {
            numbers.splice(numbers.indexOf(n), 1); // prevent double numbers within the subGrid.
            gridNestedArray[r0 + rSG][c0 + cSG] = n;
          } else cSG--; // loop until random generated n = numbers.
        }
      }
    }
  }

  // debug only
  subGridRowLength = 2;
  gridNestedArray = [
    [3, 2, 1, 2],
    [1, 4, 4, 3],
    [2, 3, 1, 3],
    [1, 4, 4, 2]
  ];

  return fix();
}

function possibleNumbers() {
  let numbers = [];
  for (let n = 1; n <= gridRowLength; n++) {
    numbers.push(n);
  }
  return numbers;
}

function fix() {
  // shrinking Grid strategy.
  // imagine sorting the Grid in sequence: horizontally -> vertically -> horizontally -> repeat.
  // sort it from backwards. For example, horizontal check: Row 0 Column 3 to 0.

  // important rules: sorted row / column should not be resorted with unsorted row / column.
  // For example, vertical check: Column 2
  // gridNestedArray   = [
  //                      [3, 2, 1,          4],
  //                      [1, 4, 2,          3],
  //                      [2, 3, 1 (double), 4],
  //                      [4, 1, 3,          2],
  //                     ];
  // statusNestedArray = [
  //                      [sorted, sorted,   sorted,     sorted],
  //                      [sorted, sorted,   sorted,     sorted],
  //                      [sorted, sorted,   sorted,     sorted],
  //                      [sorted, sorted,   unsorted, unsorted],
  //                     ];
  // gridnestedArray[2][2] = 1 can't swap with the unsorted value gridNestedArray[3][2] = 3 or gridNestedArray[3][3] = 2.
  // the only option left is to swap with sorted values within the subGrid.

  for (let steps = 0; steps < gridRowLength; steps++) {

    // horizontal
    let turns = "horizontal";
    for (let i = gridRowLength - 1; i >= 0; i--) {
      let tempDuplicates = listDuplicates(turns, steps);
    }

    // vertical
    turns = "vertical";
    for (let i = gridRowLength - 1; i >=0; i--) {
      let tempDuplicates = listDuplicates(turns, steps);
    }
  }
  return gridNestedArray;
}

function listDuplicates(turns, steps) {
  if (turns === "horizontal") {
    return gridNestedArray[steps].filter(
      (item, index) => gridNestedArray[steps].indexOf(item) != index
    );
  }
  if (turns === "vertical") {
    let columnFlatArray = columnToFlatArray(steps);
    return columnFlatArray.filter(
      (item, index) => columnFlatArray.indexOf(item) != index
    );
  }
}

function columnToFlatArray(steps) {
  let flatArray = [];
  for (let i = 0; i < gridRowLength; i++) flatArray.push(gridNestedArray[i][steps]);
  return flatArray;
}