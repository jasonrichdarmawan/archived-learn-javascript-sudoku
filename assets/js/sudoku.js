function newGrid(subGridRowLength) {
  let gridArray = [];
  let statusArray = [];
  let gridArrayLength = Math.pow(subGridRowLength, 4);
  for (let length = 0; length < gridArrayLength; length++) {
    gridArray.push(0);
    statusArray.push(false);
  }
  return flatArrayToNestedArray(gridArray, statusArray, subGridRowLength);
}

function flatArrayToNestedArray(
  gridFlatArray,
  statusFlatArray,
  subGridRowLength
) {
  let gridNestedArray = [];
  let statusNestedArray = [];
  let gridRowLength = Math.pow(subGridRowLength, 2);

  let i = 0;
  for (i = 0; i < gridFlatArray.length; i += gridRowLength) {
    let tempGridRow = gridFlatArray.slice(i, i + gridRowLength);
    gridNestedArray.push(tempGridRow);

    let tempStatusRow = statusFlatArray.slice(i, i + gridRowLength);
    statusNestedArray.push(tempStatusRow);
  }
  return populateTheNestedArray(
    gridNestedArray,
    statusNestedArray,
    subGridRowLength
  );
}

function populateTheNestedArray(
  gridNestedArray,
  statusNestedArray,
  subGridRowLength
) {
  let gridRowLength = Math.pow(subGridRowLength, 2);

  /// r0, c0 of the subGrid within the Grid
  /// rSG, cSG within the subGrid
  for (let r0 = 0; r0 < gridRowLength; r0 += subGridRowLength) {
    for (let c0 = 0; c0 < gridRowLength; c0 += subGridRowLength) {
      let numbers = possibleNumbers(gridRowLength);
      for (let rSG = 0; rSG < subGridRowLength; rSG++) {
        for (let cSG = 0; cSG < subGridRowLength; cSG++) {
          n = Math.floor(Math.random() * gridRowLength + 1);
          if (numbers.indexOf(n) > -1) {
            /// Sudoku rules: Every possible numbers can only be registered once.
            numbers.splice(numbers.indexOf(n), 1);
            gridNestedArray[r0 + rSG][c0 + cSG] = n;
          } else cSG--; /// loop until the random n is set to nestedArray[][].
        }
      }
    }
  }
  // debug only
  //   return fix(
  //     [
  //       [3, 2, 1, 2],
  //       [1, 4, 4, 3],
  //       [2, 3, 1, 3],
  //       [1, 4, 4, 2],
  //     ],
  //     statusNestedArray,
  //     subGridRowLength
  //   );
  return fix(gridNestedArray, statusNestedArray, subGridRowLength);
}

function possibleNumbers(gridRowLength) {
  let numbers = [];
  for (let n = 1; n <= gridRowLength; n++) {
    numbers.push(n);
  }
  return numbers;
}

function fix(gridNestedArray, statusNestedArray, subGridRowLength) {
  let gridRowLength = Math.pow(subGridRowLength, 2);

  for (let steps = 0; steps < gridRowLength; steps++) {
    // horizontal
    let turns = "horizontal";
    changeStatus(statusNestedArray, subGridRowLength, steps, turns);
    for (let i = gridRowLength - 1; i >= 0; i--) {
      let tempDuplicates = gridNestedArray[steps].filter(
        (item, index) => gridNestedArray[steps].indexOf(item) != index
      );
      if (tempDuplicates.length != 0) {
        if (tempDuplicates.indexOf(gridNestedArray[steps][i]) > -1) {
          let subGrid = subGridExceptSorted(
            gridNestedArray,
            statusNestedArray,
            subGridRowLength,
            steps,
            i,
            turns
          );
          //   console.log(gridNestedArray);
          //   console.log(`subGrid before ${subGrid}`)
          swapSG(gridNestedArray, subGrid, steps, i, subGridRowLength, turns);
          //   console.log(`gridNestedArray after ${gridNestedArray}`);
          //   console.log(`subGrid after ${subGrid}`)
          //   return;
        }
      } else i = 0; // end -> next steps
    }

    // vertical
    turns = "vertical";
    changeStatus(statusNestedArray, subGridRowLength, steps, turns);
    for (let i = gridRowLength - 1; i >= 0; i--) {
      let columnFlatArray = columnToFlatArray(
        gridNestedArray,
        subGridRowLength,
        steps
      );
      let tempDuplicates = columnFlatArray.filter(
        (item, index) => columnFlatArray.indexOf(item) != index
      );
      if (tempDuplicates.length != 0) {
        let subGrid = subGridExceptSorted(
          gridNestedArray,
          statusNestedArray,
          subGridRowLength,
          steps,
          i,
          turns
        );
        // console.log(statusNestedArray);
        // console.log(gridNestedArray);
        // console.log(`subGrid before ${subGrid}`);
        swapSG(gridNestedArray, subGrid, steps, i, subGridRowLength, turns);
        // console.log(`gridNestedArray after ${gridNestedArray}`);
        // console.log(`subGrid after ${subGrid}`);
      } else i = 0; // end -> next steps
    }
  }

  return isValid(gridNestedArray, subGridRowLength);
}

function changeStatus(statusNestedArray, subGridRowLength, steps, turns) {
  let gridRowLength = Math.pow(subGridRowLength, 2);

  if (turns === "horizontal") {
    for (let i = gridRowLength - 1; i >= 0; i--)
      statusNestedArray[steps][i] = true;
  }

  if (turns === "vertical") {
    for (let i = gridRowLength - 1; i >= 0; i--)
      statusNestedArray[i][steps] = true;
  }
}

function subGridExceptSorted(
  gridNestedArray,
  statusNestedArray,
  subGridRowLength,
  steps,
  i,
  turns
) {
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

  for (let rSG = 0; rSG < subGridRowLength; rSG++) {
    for (let cSG = 0; cSG < subGridRowLength; cSG++) {
      if (statusNestedArray[r0 + rSG][c0 + cSG] === true)
        subGridFlatArray.push(0);
      if (statusNestedArray[r0 + rSG][c0 + cSG] === false)
        subGridFlatArray.push(gridNestedArray[r0 + rSG][c0 + cSG]);
    }
  }

  return subGridFlatArray;
}

function swapSG(gridNestedArray, subGrid, steps, i, subGridRowLength, turns) {
  let gridRowLength = Math.pow(subGridRowLength, 2);
  for (let a = 0; a < subGrid.length; a++) {
    for (let b = 0; b < gridRowLength; b++) {
      if (subGrid[a] === 0) continue;
      if (turns === "horizontal") {
        if (
          b === gridRowLength - 1 &&
          subGrid[a] != gridNestedArray[steps][b]
        ) {
          let r0 = Math.floor(
            Math.floor(steps / subGridRowLength) * subGridRowLength
          );
          let c0 = Math.floor(
            Math.floor(i / subGridRowLength) * subGridRowLength
          );
          let rSG = Math.floor(a / subGridRowLength);
          let cSG = a % subGridRowLength;
          /// swap method b = [b, a = b][0]
          gridNestedArray[steps][i] = [
            gridNestedArray[r0 + rSG][c0 + cSG],
            (gridNestedArray[r0 + rSG][c0 + cSG] = gridNestedArray[steps][i]),
          ][0];
          subGrid[a] = 0;
        }
        if (subGrid[a] === gridNestedArray[steps][b]) b = gridRowLength; // end -> next subGrid[a]
      } else if (turns === "vertical") {
        if (
          b === gridRowLength - 1 &&
          subGrid[a] != gridNestedArray[b][steps]
        ) {
          let r0 = Math.floor(
            Math.floor(i / subGridRowLength) * subGridRowLength
          );
          let c0 = Math.floor(
            Math.floor(steps / subGridRowLength) * subGridRowLength
          );
          let rSG = Math.floor(a / subGridRowLength);
          let cSG = a % subGridRowLength;
          /// swap method b = [b, a = b][0]
          gridNestedArray[i][steps] = [
            gridNestedArray[r0 + rSG][c0 + cSG],
            (gridNestedArray[r0 + rSG][c0 + cSG] = gridNestedArray[i][steps]),
          ][0];
          subGrid[a] = 0;
        }
        if (subGrid[a] === gridNestedArray[b][steps]) b = gridRowLength; // end -> next subGrid[a]
      }
    }
  }
}

function columnToFlatArray(gridNestedArray, subGridRowLength, steps) {
  let gridRowLength = Math.pow(subGridRowLength, 2);

  let flatArray = [];
  for (let i = 0; i < gridRowLength; i++)
    flatArray.push(gridNestedArray[i][steps]);
  return flatArray;
}

function isValid(gridNestedArray, subGridRowLength) {
  let gridRowLength = Math.pow(subGridRowLength, 2);
  for (let i = 0; i < gridRowLength; i++) {
    if (new Set(gridNestedArray[i]).size !== gridNestedArray[i].length) {
        console.log(gridNestedArray);
        console.log(`gridNestedArray[${i}] ${gridNestedArray[i]}`);
        return "ERROR: horizontal need new strategy";
    }
    let columnFlatArray = columnToFlatArray(
      gridNestedArray,
      subGridRowLength,
      i
    );
    if (new Set(columnFlatArray).size !== columnFlatArray.length) {
        console.log(gridNestedArray);
        console.log(`columnFlatArray steps ${i} ${columnFlatArray}`);
        return "ERROR: vertical need new strategy";
    }
  }
  return gridNestedArray;
}
