let subGridRowLength;
let subGridLength;
let gridRowLength;
let gridLength;

function newGrid(value) {
  // reset global variables
  gridNestedArray = [];
  statusNestedArray = [];

  // global variables;
  subGridRowLength = value;
  subGridLength = Math.pow(subGridRowLength, 2);
  gridRowLength = Math.pow(subGridRowLength, 2);
  gridLength = Math.pow(subGridRowLength, 4);

  let gridFlatArray = [];
  let statusFlatArray = [];
  for (let i = 0; i < gridLength; i++) {
    gridFlatArray.push(0);
    statusFlatArray.push(undefined);
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

  // debug only: ERROR steps 2 vertical needs new strategy || Fixed
  // subGridRowLength = 2;
  // gridNestedArray = [
  //   [3, 2, 1, 2],
  //   [1, 4, 4, 3],
  //   [2, 3, 1, 3],
  //   [1, 4, 4, 2]
  // ];

  // debug only: ERROR steps 3 horizontal needs new strategy || Fixed
  // subGridRowLength = 2;
  // gridNestedArray = [
  //   [1, 4, 3, 2],
  //   [2, 3, 1, 4],
  //   [4, 2, 4, 3],
  //   [3, 1, 2, 1]
  // ];

  // debug only: ERROR horizontal steps 3 needs new strategy || Fixed
  subGridRowLength = 2;
  gridNestedArray = [
    [3,4,3,2],
    [1,2,1,4],
    [4,2,3,2],
    [3,1,1,4]
  ]

  // debug only: ERROR vertical steps 8 needs new strategy
  // subGridRowLength = 3;
  // gridNestedArray = [
  //     [5, 8, 3, 1, 9, 6, 7, 2, 8],
  //     [9, 7, 6, 2, 4, 5, 4, 3, 1],
  //     [1, 4, 2, 3, 8, 7, 5, 6, 9],
  //     [7, 2, 4, 6, 3, 1, 5, 9, 7],
  //     [8, 9, 1, 5, 2, 8, 6, 4, 3],
  //     [6, 3, 5, 4, 7, 9, 2, 1, 8],
  //     [2, 1, 8, 7, 5, 2, 6, 9, 5],
  //     [3, 6, 7, 9, 1, 4, 8, 3, 4],
  //     [4, 5, 9, 8, 6, 3, 1, 7, 2]
  // ]

  // debug only
  console.log(`=== Start: Before Fix ===`)
  console.log(JSON.stringify(gridNestedArray));
  console.log(`=== End ===`)

  return loopsteps();
}

function possibleNumbers() {
  let numbers = [];
  for (let n = 1; n <= gridRowLength; n++) {
    numbers.push(n);
  }
  return numbers;
}

function loopsteps() {
  // horizontal steps 0 -> veritcal steps 0 -> horizontal steps 1 -> repeat
  for (let steps = 0; steps < gridRowLength; steps++) {
    if (check("horizontal", steps, "canFix") === false) {
      console.log(`ERROR horizontal steps ${steps} needs new strategy`);
      break;
    }

    if (check("vertical", steps, "canFix") === false) {
      console.log(`ERROR vertical steps ${steps} needs new strategy`);
      break;
    }
  }
}

function check(turns, steps, request) {
  if (isValid(turns, steps) === true) {
    updateStatus(turns, steps);
  } else if (isValid(turns, steps) === false) {
    // TODO: add new strategy

    // swap unsorted with unsorted
    if (sortWithSG(turns, steps, "canSort") === true) {
      sortWithSG(turns, steps, "sort");
      check(turns, steps); // recursive
    }
    
    // swap sorted with sorted
    // else if (swapSorted(turns, steps, "canSort") === true) {
    //   swapSorted(turns, steps, "sort");
    //   check(turns, steps);
    // }

    else if (request === "canFix") return false;
  }
}

function isValid(turns, steps) {
  let tempFlatArray = [];

  // horizontal
  if (turns === "horizontal") {
    tempFlatArray = gridNestedArray[steps];
  }
  
  // vertical
  else if (turns === "vertical") {
    tempFlatArray = columnToFlatArray(steps);
  }
  
  // ERROR
  else { 
    console.log(`ERROR isValid(${turns}) the turns' parameter is not found`);
    return;
  }

  if (new Set(tempFlatArray).size !== tempFlatArray.length) {
    return false; // isValid false
  }

  // check passed: isValid true
  if (turns === "horizontal" || turns === "vertical") return true;
}

function columnToFlatArray(steps) {
  let tempFlatArray = [];
  for (let i = 0; i < gridRowLength; i++) tempFlatArray.push(gridNestedArray[i][steps]);
  return tempFlatArray;
}

function updateStatus(turns, steps) {
  for (let i = gridRowLength - 1; i >= 0; i--) {
    // horizontal
    if (turns === "horizontal" && typeof statusNestedArray[steps][i] === 'undefined') {
      statusNestedArray[steps][i] = steps;
    }

    // vertical
    else if (turns === "vertical" && typeof statusNestedArray[i][steps] === 'undefined') {
      statusNestedArray[i][steps] = steps;
    }
  }
}

function sortWithSG(turns, steps, request) {
  let index = listDuplicates(turns, steps, "lastIndexOf");

  let tempSubGrid = subGrid(turns, steps, index);

  let tempFlatArray = [];

  if (turns === "horizontal") {
    tempFlatArray = gridNestedArray[steps];
  } else if (turns === "vertical") {
    tempFlatArray = columnToFlatArray(steps);
  }

  // debug only
  if (turns === "horizontal") {
    console.log(`${turns} steps ${steps} index ${index}
      sort status ${statusNestedArray[steps][index]}
      tempFlatArray ${tempFlatArray}
      tempSubGrid ${tempSubGrid}`
    );
  } else if (turns === "vertical") {
    console.log(`${turns} index ${index} steps ${steps}
      sort status ${statusNestedArray[index][steps]}
      tempFlatArray ${tempFlatArray}
      tempSubGrid ${tempSubGrid}`
    );
  }

  for (let i = 0; i < tempSubGrid.length; i++) {
    if (typeof tempSubGrid[i] === 'undefined' || 
        tempFlatArray.indexOf(tempSubGrid[i]) > -1
    ) continue;

    if (tempFlatArray.indexOf(tempSubGrid[i]) === -1) {
      // request: canSort
      if (request === "canSort") {
        return true;
      }

      // request: sort
      else if (request === "sort") {
        let rSG = Math.floor(
          Math.floor(i / subGridRowLength)
        );
        let cSG = i % subGridRowLength;
  
        // horizontal
        if (turns === "horizontal") {
          let r0 = Math.floor(
            Math.floor(steps / subGridRowLength) * subGridRowLength
          );
          let c0 = Math.floor(
            Math.floor(index / subGridRowLength) * subGridRowLength
          );
          gridNestedArray[steps][index] = [
            gridNestedArray[r0 + rSG][c0 + cSG],
            gridNestedArray[r0 + rSG][c0 + cSG] = gridNestedArray[steps][index]
          ][0];
        }
        
        // vertical
        else if (turns === "vertical") {
          let r0 = Math.floor(
            Math.floor(index / subGridRowLength) * subGridRowLength
          );
          let c0 = Math.floor(
            Math.floor(steps / subGridRowLength) * subGridRowLength
          );
          gridNestedArray[index][steps] = [
            gridNestedArray[r0 + rSG][c0 + cSG],
            gridNestedArray[r0 + rSG][c0 + cSG] = gridNestedArray[index][steps]
          ][0];
        }
      }
    } 
  }
}

function listDuplicates(turns, steps, request, index) {
  let tempFlatArray = [];

  // horizontal
  if (turns === "horizontal") {
    tempFlatArray = gridNestedArray[steps];
  }

  // vertical
  else if (turns === "vertical") {
    tempFlatArray = columnToFlatArray(steps);
  }

  else {
    console.log(`ERROR listDuplicates(${turns}, steps, request) turns' parameter is not found`);
    return;
  }

  // request: lastIndexOf
  if (request === "lastIndexOf") {
    let tempDuplicates = listDuplicates(turns, steps, "list");
    return tempFlatArray.lastIndexOf(
      tempDuplicates[tempDuplicates.length - 1]
    ); // index
  }
  
  // request: nextLastIndexOf
  if (request === "nextLastIndexOf") {
    let tempDuplicates = listDuplicates(turns, steps, "list");
    return tempFlatArray.lastIndexOf(
      tempDuplicates[tempDuplicates.length - 1],
      tempFlatArray.lastIndexOf(
        tempDuplicates[tempDuplicates.length - 1]
      ) - 1
    ); // index
  }

  // request: list
  else if (request === "list") {
    return tempFlatArray.filter(
      (item, index) => tempFlatArray.indexOf(item) != index
    ); // list
  }

  else console.log(`ERROR listDuplicates(turns, steps, ${request}) request' parameter is not found`);
}

function subGrid(turns, steps, index) {
  let tempSubGrid = [];

  // r0, c0 is relative to the Grid. r0, c0 is the 0,0 of each subGrid.
  let r0;
  let c0;

  // horizontal
  if (turns === "horizontal") {
    r0 = Math.floor(
      Math.floor(steps / subGridRowLength) * subGridRowLength
    );
    c0 = Math.floor(
      Math.floor(index / subGridRowLength) * subGridRowLength
    );
  }

  else if (turns === "vertical") {
    r0 = Math.floor(
      Math.floor(index / subGridRowLength) * subGridRowLength
    );
    c0 = Math.floor(
      Math.floor(steps / subGridRowLength) * subGridRowLength
    );
  }

  // rSG, cSG is relative to the subGrid.
  for (let rSG = 0; rSG < subGridRowLength; rSG++) {
    for (let cSG = 0; cSG < subGridRowLength; cSG++) {
      // horizontal
      if (turns === "horizontal") {
        // if sorted
        if (typeof statusNestedArray[steps][index] != 'undefined') {
          if (statusNestedArray[r0 + rSG][c0 + cSG] === steps) tempSubGrid.push(gridNestedArray[r0 + rSG][c0 + cSG]);
          else tempSubGrid.push(undefined);
        }

        // if not sorted
        else if (typeof statusNestedArray[steps][index] === 'undefined') {
          if (rSG === 0 || typeof statusNestedArray[r0 + rSG][c0 + cSG] != 'undefined') {
            tempSubGrid.push(undefined);
            continue; // prevent overlapping with the next if statement.
          }
          tempSubGrid.push(gridNestedArray[r0 + rSG][c0 + cSG]);
        }
      }

      // vertical
      else if (turns === "vertical") {
        // if sorted
        if (typeof statusNestedArray[index][steps] != 'undefined'){
          if (statusNestedArray[r0 + rSG][c0 + cSG] === steps) tempSubGrid.push(gridNestedArray[r0 + rSG][c0 + cSG]);
          else tempSubGrid.push(undefined);
        }
        
        // if not sorted
        else if (typeof statusNestedArray[index][steps] === 'undefined') {
          if (cSG === 0 || typeof statusNestedArray[r0 + rSG][c0 + cSG] != 'undefined') {
            console.log(`[${r0} + ${rSG} , ${c0} + ${cSG}]`)
            tempSubGrid.push(undefined);
            continue; // prevent overlapping with the next if statement.
          }
          tempSubGrid.push(gridNestedArray[r0 + rSG][c0 + cSG]);
        }
      }
    }
  }

  return tempSubGrid;
}

// function swapSorted(turns, steps, request) {
//   console.log("swapSorted triggered")
//   let index = listDuplicates(turns, steps, "nextLastIndexOf");

//   let tempSubGrid = [];

//   if (turns === "horizontal") {
//     tempFlatArray = gridNestedArray[steps];
//     tempSubGrid = subGrid("vertical", index, steps); // inverted
//   } else if (turns === "vertical") {
//     tempFlatArray = columnToFlatArray(steps);
//     tempSubGrid = subGrid("horizontal", index, steps); // inverted
//   }

//   // debug only
//   console.log(`${turns} steps ${steps} index ${index}
//     tempFlatArray ${tempFlatArray} tempSubGrid ${tempSubGrid}`
//   )

//   for (let i = 0; i < tempSubGrid.length; i++) {
//     if (typeof tempSubGrid[i] === 'undefined' ||
//         tempFlatArray.indexOf(tempSubGrid[i]) > -1 
//     ) continue;

//     if (tempFlatArray.indexOf(tempSubGrid[i]) === -1) {
//       // request: canSort
//       if (request === "canSort") {
//         return true;
//       }

//       // request: sort
//       else if (request === "sort") {
//         let rSG = Math.floor(
//           Math.floor(i / subGridRowLength)
//         );
//         let cSG = i % subGridRowLength;
  
//         // horizontal
//         if (turns === "horizontal") {
//           let r0 = Math.floor(
//             Math.floor(steps / subGridRowLength) * subGridRowLength
//           );
//           let c0 = Math.floor(
//             Math.floor(index / subGridRowLength) * subGridRowLength
//           );
//           gridNestedArray[steps][index] = [
//             gridNestedArray[r0 + rSG][c0 + cSG],
//             gridNestedArray[r0 + rSG][c0 + cSG] = gridNestedArray[steps][index]
//           ][0];
//         }
        
//         // vertical
//         else if (turns === "vertical") {
//           let r0 = Math.floor(
//             Math.floor(index / subGridRowLength) * subGridRowLength
//           );
//           let c0 = Math.floor(
//             Math.floor(steps / subGridRowLength) * subGridRowLength
//           );
//           gridNestedArray[index][steps] = [
//             gridNestedArray[r0 + rSG][c0 + cSG],
//             gridNestedArray[r0 + rSG][c0 + cSG] = gridNestedArray[index][steps]
//           ][0];
//         }
//       }
//     }
//   }
// }