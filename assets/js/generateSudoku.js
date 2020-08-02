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
  // subGridRowLength = 2;
  // gridNestedArray = [
  //   [3, 2, 1, 2],
  //   [1, 4, 4, 3],
  //   [2, 3, 1, 3],
  //   [1, 4, 4, 2]
  // ];

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
    changeStatus(turns, steps)
    for (let i = gridRowLength - 1; i >= 0; i--) {
      let tempDuplicates = listDuplicates(turns, steps);
      if (tempDuplicates.length != 0) {
        let subGrid = subGridExceptSorted(turns, steps, i);
        swapSG(subGrid, turns, steps, i);
        if (isValid(turns, steps) === false) {
          return; // TODO:
        };
      } else i = 0; // end -> wait next steps
    }

    // vertical
    turns = "vertical";
    changeStatus(turns, steps)
    for (let i = gridRowLength - 1; i >=0; i--) {
      let tempDuplicates = listDuplicates(turns, steps);
      if (tempDuplicates.length != 0) {
        let subGrid = subGridExceptSorted(turns, steps, i);
        let indexOflastDuplicates = listDuplicates(turns, steps, true);
        // console.log(`indexOflastDuplicate ${indexOflastDuplicates}`);
        swapSG(subGrid, turns, steps, indexOflastDuplicates)
        // if swapSG strategy failed -> rebuild the subGrid with sorted values.
        if (isValid(turns, steps) === false) {
          let exception = "rebuild with sorted values";
          subGrid = subGridExceptSorted(turns, steps, i, exception);

          // debug only
          // console.log(subGrid);
          // console.log(`before`)
          // console.log(gridNestedArray);

          swapSG(subGrid, turns, steps, indexOflastDuplicates, exception)

          // debug only
          // console.log(`after`)
          // console.log(gridNestedArray);
          // return;
        }
      } else i = 0; // end -> next steps
    }
  }
  return gridNestedArray;
}

function listDuplicates(turns, steps, index) {
  if (turns === "horizontal") {
    return gridNestedArray[steps].filter(
      (item, index) => gridNestedArray[steps].indexOf(item) != index
    );
  }
  if (turns === "vertical") {
    let columnFlatArray = columnToFlatArray(steps);
    if (index === true) {
      let tempDuplicates = columnFlatArray.filter(
        (item, index) => columnFlatArray.indexOf(item) != index
      );
      return columnFlatArray.lastIndexOf(tempDuplicates[tempDuplicates.length - 1]);
    } else { 
      return columnFlatArray.filter(
        (item, index) => columnFlatArray.indexOf(item) != index
      );
    }
  }
}

function columnToFlatArray(steps) {
  let flatArray = [];
  for (let i = 0; i < gridRowLength; i++) flatArray.push(gridNestedArray[i][steps]);
  return flatArray;
}

function changeStatus(turns, steps) {
  for (let i = gridRowLength - 1; i >= 0; i--) {
    if (turns === "horizontal") {
      statusNestedArray[steps][i] = true;
    }
    if (turns === "vertical") {
      statusNestedArray[i][steps] = true;
    }
  }
}

function subGridExceptSorted(turns, steps, i, exception) {
  let subGridFlatArray = [];
  let r0;
  let c0;

  if (turns === "horizontal") {
    r0 = Math.floor(Math.floor(steps / subGridRowLength) * subGridRowLength);
    c0 = Math.floor(Math.floor(i / subGridRowLength) * subGridRowLength);
  } else if (turns === "vertical") {
    r0 = Math.floor(Math.floor(i / subGridRowLength) * subGridRowLength);
    c0 = Math.floor(Math.floor(steps / subGridRowLength) * subGridRowLength);
  }

  if (exception == "rebuild with sorted values") {
    for (let rSG = 0; rSG < 1; rSG++) {
      for (let cSG = 0; cSG < subGridRowLength; cSG++) {
        if (statusNestedArray[r0 + rSG][c0 + cSG] === false) subGridFlatArray.push(0);
        if (statusNestedArray[r0 + rSG][c0 + cSG] === true) subGridFlatArray.push(gridNestedArray[r0 + rSG][c0 + cSG]);
      }
    }
  } else {
    for (let rSG = 0; rSG < subGridRowLength; rSG++) {
      for (let cSG = 0; cSG < subGridRowLength; cSG++) {
        if (statusNestedArray[r0 + rSG][c0 + cSG] === true) subGridFlatArray.push(0);
        if (statusNestedArray[r0 + rSG][c0 + cSG] === false) subGridFlatArray.push(gridNestedArray[r0 + rSG][c0 + cSG]);
      }
    }
  }

  return subGridFlatArray;
}

function swapSG(subGrid, turns, steps, i) {
  // compare every gridNestedArray[][] value to subGrid[a]
  // if subGrid[a] === 0 then end the iteration then end the iteration -> next subGrid[a]
  // if subGrid[a] === gridNestedArray[][] then end the iteration -> next subGrid[a]
  // if b reach the constraints && subGrid[a] != gridNestedArray[][] (means subGrid[a] value does not exist in gridNestedArray row / column) then swap.
  for (let a = 0; a < subGrid.length; a++) {
    let rSG = Math.floor(a / subGridRowLength);
    let cSG = a % subGridRowLength;
    for (let b = 0; b < gridRowLength; b++) {
      if (subGrid[a] === 0) continue;

      // horizontal
      if (turns === "horizontal") {
        if (subGrid[a] === gridNestedArray[steps][b]) break; // end -> next subGrid[a]
        if (b === gridRowLength - 1 && subGrid[a] != gridNestedArray[steps][b]) {
          let r0 = Math.floor(Math.floor(steps / subGridRowLength) * subGridRowLength);
          let c0 = Math.floor(Math.floor(i / subGridRowLength) * subGridRowLength);
          
          // swap method b = [b, a = b][0]
          gridNestedArray[steps][i] = [
            gridNestedArray[r0 + rSG][c0 + cSG],
            (gridNestedArray[r0 + rSG][c0 + cSG] = gridNestedArray[steps][i]),
            subGrid[a] = 0
          ][0];
        }
      }
      
      //vertical
      if (turns === "vertical") {
        if (subGrid[a] === gridNestedArray[b][steps]) break; // end -> next subGrid[a]
        if (a === subGrid.length - 1 && subGrid[a] === gridNestedArray[b][steps]);

        if (b === gridRowLength -1 && subGrid[a] != gridNestedArray[b][steps]) {
          let r0 = Math.floor(Math.floor(i / subGridRowLength) * subGridRowLength);
          let c0 = Math.floor(Math.floor(steps / subGridRowLength) * subGridRowLength);
          
          // swap method b = [b, a = b][0]
          gridNestedArray[i][steps] = [
            gridNestedArray[r0 + rSG][c0 + cSG],
            (gridNestedArray[r0 + rSG][c0 + cSG] = gridNestedArray[i][steps]),,
            subGrid[a] = 0
          ][0];
        }
      }
    }
  }
}

function isValid(turns, steps) {
    // horizontal
    if (turns === "horizontal") {
      if (new Set(gridNestedArray[steps]).size !== gridNestedArray[steps].length) {
        console.log(gridNestedArray);
        console.log(`gridNestedArray[${steps}] ${gridNestedArray[steps]}`);
        console.log(`ERROR: steps ${steps} horizontal need new strategy`);
        return false;
      }
    }

    // vertical
    if (turns === "vertical") {
      let columnFlatArray = columnToFlatArray(steps);
      if (new Set(columnFlatArray).size !== columnFlatArray.length) {
        // console.log(gridNestedArray);
        // console.log(`columnFlatArray steps ${steps} ${columnFlatArray}`);
        // console.log(`ERROR: steps ${steps} vertical need new strategy`);
        return false;
      }
    }
    
}