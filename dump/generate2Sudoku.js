// Shrinking grid strategy: sort the grid horizontally -> vertically -> horizontally -> repeat
// [1, 2, 2, 1] > 1
// [3, 4, 4, 1] > 3 
// [1, 2, 2, 1] > 5
// [3, 4, 4, 3] > 7
//  v  v  v  v
//  2  4  6  8

// 1st strategy:
// Sort the sub-Grid only with values from the sub-Grid (not including the row / column under sorting).
// Sort it from backwards. Start from the last duplicated number.
// [1, 2, 2, (1)] try to swap with [4, 3] > [1, 2, (2), 4] try to swap with [1,3] > [1, 2, 3, 4]
// [3, 4, 4,  3 ]                           [ ,  ,   1,  ]                          [ ,  ,  , 2]
// [1, 2, 2,  1 ]
// [3, 4, 4,  3 ]

// 1st strategy important rules: the sorting rules
// sorted row / column can't be resorted with different row or column.
// unsorted row / column can be sorted with different row or column.
// [┌, ─, ─, ─]
// [|, ┌, ─, ─]
// [|, |, ┌, ─|
// [|, |, |,  ]

// X ┌, ─, ─, X ─, ─, ─, X ─, ─, ─ X
// X |, ┌, ─, X ─, ─, ─, X ─, ─, ─ X
// X |, |, ┌, X ─, ─, ─, X ─, ─, ─ X
// X----------+----------+---------X
// X |, |, |, X ┌, ─, ─, X ─, ─, ─ X
// X |, |, |, X |, ┌, ─, X ─, ─, ─ X
// X |, |, |, X |, |, ┌, X ─, ─, ─ X
// X----------+--------+-----------X
// X |, |, |, X |, |, |, X ┌, ─, ─ X
// X |, |, |, X |, |, |, X |, ┌, ─ X
// X |, |, |, X |, |, |, X |, |    X

// 2nd strategy priority:
// if 1st strategy failed -> try to find the next duplicated number -> if the next duplicated number is sorted -> the only option left is to sort it within the sorted row.

// 2rd strategy for horizontal:
// If 1st strategy failed, for exmaple:
// [1, 4,   3, 2]
// [2, 3,   1, 4]
// [4, 2, (4), 3] unable to swap with [2, 1] > find the next duplicated number [(4), 2, 4, 3]
// [3, 1,   2, 1]
//  v
// [            ]
// [            ]
// [(4),        ]
// [            ]
// the next duplicated number is sorted > try to sort it vertically to prevent resorting.
// see [3][0] marked as sorted.
// [sorted, sorted, sorted,     sorted]
// [sorted, sorted, sorted,     sorted]
// [sorted, sorted, unsorted, unsorted]
// [sorted, sorted, unsorted, unsorted]

// 2nd strategy for vertical:
// If 1st strategy failed, for example:
// [3, 2,  1,  4]
// [1, 4,  2,  3]
// [2, 3, (1), 4]
// [4, 1,  3,  2]
//        v
// unable to swap with [2] > find the next duplicated number
// [ ,  , (1),  ]
// [ ,  ,   2,  ]
// [ ,  ,   1,  ]
// [ ,  ,   3,  ]
// the next duplicated number is sorted > try to sort it horizontally to prevent resorting.
// see [0][2] marked as sorted.
// [sorted, sorted, sorted,     sorted]
// [sorted, sorted, sorted,     sorted]
// [sorted, sorted, sorted,     sorted]
// [sorted, sorted, unsorted, unsorted]

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

  // debug only: ERROR steps 2 vertical needs new strategy
  subGridRowLength = 2;
  gridNestedArray = [
    [3, 2, 1, 2],
    [1, 4, 4, 3],
    [2, 3, 1, 3],
    [1, 4, 4, 2]
  ];

  // debug only: ERROR steps 3 horizontal needs new strategy
  // subGridRowlength = 2;
  // gridNestedArray = [
  //   [1, 4, 3, 2],
  //   [2, 3, 1, 4],
  //   [4, 2, 4, 3],
  //   [3, 1, 2, 1]
  // ];

  return fix(0);
}

function possibleNumbers() {
  let numbers = [];
  for (let n = 1; n <= gridRowLength; n++) {
    numbers.push(n);
  }
  return numbers;
}

function fix(value) {
  for (let steps = value; steps < gridRowLength; steps++) {
    // horizontal
    if (isValid("horizontal", steps) === true) {
      console.log(`horizontal update steps ${steps}`)
      updateStatus("horizontal", steps);
    } else if (isValid("horizontal", steps) === false) {
      let gridFlatArrayLastIndexOfDuplicate = listDuplicates("horizontal", steps, "lastIndexOf");
      if (sortWithSG("horizontal", steps, gridFlatArrayLastIndexOfDuplicate, "canSort") === true) {
        sortWithSG("horizontal", steps, gridFlatArrayLastIndexOfDuplicate, "sort");
        fix(steps);
      }
    }

    // vertical
    if (isValid("vertical", steps) === true) {
      console.log(`vertcal update steps ${steps}`)
      updateStatus("vertical", steps);
    } else if (isValid("vertical", steps) === false) {
      let gridFlatArrayLastIndexOfDuplicate = listDuplicates("vertical", steps, "lastIndexOf");
      if (sortWithSG("vertical", steps, gridFlatArrayLastIndexOfDuplicate, "canSort") === true) {
        sortWithSG("vertical", steps, gridFlatArrayLastIndexOfDuplicate, "sort");
        fix(steps);
        return;
      }
    }

    // // horizontal
    // for (let i = gridRowLength - 1; i >= 0; i--) {
    //   if (isValid("horizontal", steps) === true) {
    //     updateStatus("horizontal", steps);
    //     break;
    //   } else if (isValid("horizontal", steps) === false) {          
    //       if (listDuplicates("horizontal", steps, i, "indexOf") > -1) {
    //         // debug only
    //         // let tempDuplicates = listDuplicates("horizontal", steps);
    //         // console.log(`horizontal steps ${steps} tempDuplicates ${tempDuplicates} gridNestedArray[${steps}][${i}] ${gridNestedArray[steps][i]}`);
    //         if (sortWithSG("horizontal", steps, i, "canSort") === true) {
    //           sortWithSG("horizontal", steps, i, "sort");
    //         } else break loop1;
    //       }
    //   }
    // }

    // // vertical
    // for (let i = gridRowLength - 1; i >= 0; i--) {
    //   if (isValid("vertical", steps) === true) {
    //     updateStatus("vertical", steps);
    //     break;
    //   } else if (isValid("vertical", steps) === false) {
    //     if (listDuplicates("vertical", steps, i, "indexOf") > -1) {
    //       // debug only
    //       // let tempDuplicates = listDuplicates("vertical", steps);
    //       // console.log(`vertical steps ${steps} tempDuplicates ${tempDuplicates} gridNestedArray[${i}][${steps}] ${gridNestedArray[i][steps]}`);
    //       if (sortWithSG("vertical", steps, i, "canSort") === true) {

    //       } else break loop1;
    //     }
    //   }
    // }

  }
}

function isValid(turns, steps) {
  // horizontal
  if (turns === "horizontal") {
    if (new Set(gridNestedArray[steps]).size !== gridNestedArray[steps].length) {
      return false;
    }
  }

  // vertical
  if (turns === "vertical") {
    let columnFlatArray = columnToFlatArray(steps);
    if (new Set(columnFlatArray).size !== columnFlatArray.length) {
      return false;
    }
  }

  // check passed: valid.
  return true;
}

function columnToFlatArray(steps) {
  let flatArray = [];
  for (let i = 0; i < gridRowLength; i++) flatArray.push(gridNestedArray[i][steps]);
  return flatArray;
}

function updateStatus(turns, steps) {
  for (let i = gridRowLength - 1; i >= 0; i--) {
    // horizontal
    if (turns === "horizontal") {
      statusNestedArray[steps][i] = true;
    }

    // vertical
    else if (turns === "vertical") {
      statusNestedArray[i][steps] = true;
    }
  }
}

function listDuplicates(turns, steps, response) {
  // horizontal
  if (turns === "horizontal") {
    if (response === "lastIndexOf") {
      let tempDuplicates = listDuplicates("horizontal", steps, "list");
      return gridNestedArray[steps].lastIndexOf(
        tempDuplicates[tempDuplicates.length - 1]
      );
    } else if (response === "list") {
      return gridNestedArray[steps].filter(
        (item, index) => gridNestedArray[steps].indexOf(item) != index
      ); // list
    }
  }

  // vertical
  if (turns === "vertical") {
    let columnFlatArray = columnToFlatArray(steps);
    if (response === "lastIndexOf") {
      let tempDuplicates = listDuplicates("vertical", steps, "list");
      return columnFlatArray.lastIndexOf(
        tempDuplicates[tempDuplicates.length - 1]
      );
    } else if (response === "list") {
      return columnFlatArray.filter(
        (item, index) => columnFlatArray.indexOf(item) != index
      );
    }
  }

  // DELETE // // // // // // // // ///
  // // horizontal
  // if (turns === "horizontal") {
  //   if (response === "indexOf") {
  //     let tempDuplicates = listDuplicates("horizontal", steps);
  //     return tempDuplicates.lastIndexOf(gridNestedArray[steps][i]); // index
  //   } else {
  //     return gridNestedArray[steps].filter(
  //       (item, index) => gridNestedArray[steps].indexOf(item) != index
  //     ); // list
  //   }
  // }

  // // vertical
  // if (turns === "vertical") {
  //   if (response === "indexOf") {
  //     let tempDuplicates = listDuplicates("vertical", steps);
  //     return tempDuplicates.lastIndexOf(gridNestedArray[i][steps]);
  //   } else {
  //     let columnFlatArray = columnToFlatArray(steps);
  //     return columnFlatArray.filter(
  //       (item, index) => columnFlatArray.indexOf(item) != index
  //     );
  //   }
  // }
}

function sortWithSG(turns, steps, index, response, inverted) {
  let tempSubGrid = [];
  let tempDuplicates;

  // horizontal
  if (turns === "horizontal") {
    FlatArray = gridNestedArray[steps];

    tempDuplicates = listDuplicates(turns, steps, "list");

    if (statusNestedArray[steps][index] === false && tempDuplicates.length > 0) {
      tempSubGrid = subGrid(turns, steps, index);
    } else if (statusNestedArray[steps][index] === true && tempDuplicates.length > 0) {
      tempSubGrid = subGrid("vertical", steps, index, true);
      sortWithSG("vertical", steps, index, "sort", true);
    }
  }

  // vertical
  else if (turns === "vertical") {
    FlatArray = columnToFlatArray(steps);

    tempDuplicates = listDuplicates(turns, steps, "list");

    if (statusNestedArray[index][steps] === false && tempDuplicates.length > 0) {
      tempSubGrid = subGrid(turns, steps, index);
    } else if (statusNestedArray[index][steps] === true && tempDuplicates.length > 0) {
      tempSubGrid = subGrid("horizontal", steps, index, true);
      console.log(`vertical exception steps ${steps} index ${index} tempSubGrid ${tempSubGrid}`)
      sortWithSG("horizontal", steps, index, "sort", true);
    }
  }

  for (let i = 0; i < tempSubGrid.length; i++) {
    if (typeof tempSubGrid[i] === 'undefined') { console.log(`i ${i} continue`); continue; }

    console.log(`continue i ${i}`)
    if (FlatArray.indexOf(tempSubGrid[i]) > -1 && typeof inverted === 'undefined') {
      if (i === tempSubGrid.length - 1) {
        if (index - 1 < 0) {
          console.log(`ERROR steps ${steps} ${turns} needs new strategy`);
          break;
        } else if (index - 1 > 0) {
          console.log(`${turns} back index ${index}`)
          index = FlatArray.lastIndexOf(tempSubGrid[i], index - 1);
          sortWithSG(turns, steps, index, "sort"); // recursive -> next index (backwards)
        }
      } else if (i < tempSubGrid.length) continue;
    }
    
    else if (FlatArray.indexOf(tempSubGrid[i]) === -1 || inverted === true) {
      if (response === "canSort") {
        return true;
      }
      
      else if (response === "sort") {
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
            gridNestedArray[r0 + rSG][c0 + cSG] = gridNestedArray[steps][index],
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
          console.log(`index ${index} steps ${steps}`);
          console.log(`i ${i}`)
          console.log(`gridNestedArray[${index}][${steps}] ${gridNestedArray[index][steps]} gridNestedArray[${r0} + ${rSG}][${c0} + ${cSG}] ${gridNestedArray[r0 + rSG][c0 + cSG]}`);
          console.log(`tempSubGrid ${tempSubGrid}`);
          gridNestedArray[index][steps] = [
            gridNestedArray[r0 + rSG][c0 + cSG],
            gridNestedArray[r0 + rSG][c0 + cSG] = gridNestedArray[index][steps],
          ][0];
        }
      }
    }

  }

  // DELETE // // // // // // // // // // // // // // // // // // //
  // compare every gridNestedArray[][] -> subGrid[a]
  // if typeof tempSubGrid[] === 'undefined' it means you can't swap it with. It's undefined because if you swap with it, you will violate the no resorting rules.
  // if gridNestedArray[].indexOf(tempSubGrid[a]) > -1 . It means, the value has been registered once / you can't swap it with it.
  // if gridNestedArray[].indexOf(tempSubGrid[a]) > -1 && a === tempSubGrid.length - 1. it means, swapping with the current subGrid has failed. -> try to find the BeforeLastIndexOf(value of gridNestedArray[][]) and try to swap within the sort.
  // if gridNestedArray[steps].indexOf(tempSubGrid[a]) === -1 . It means, the value has not been registered / you can swap with it.
  
  // if response === "canSort" it return either true or false. -> false will break label loop1 and inform you it needs new strategy.
  // if response === "sort" starts the swap.

  // let tempSubGrid = subGrid(turns, steps, i);

  // loop1:
  //   for (let a = 0; a < tempSubGrid.length; a++) {
  //     if (typeof tempSubGrid[a] === 'undefined') continue;

  //     if (turns === "horizontal") {
  //       if (gridNestedArray[steps].indexOf(tempSubGrid[a]) > -1) {
  //         if (a === tempSubGrid.length - 1) {
  //           // TODO: find the gridNestedArray[steps].BeforeLastIndexOf(gridNestedArray[steps][i])
  //           // TODO: if the index is sorted, rebuild the subGrid with sorted values without violating the sorting rules.
  //           // TODO: if the index is not sorted, rebuild the subGrid with default rules.
  //           let nextIndexOfDuplicate = 
  //           continue loop1; // start over.
  //         } else continue;
  //       } else if (gridNestedArray[steps].indexOf(tempSubGrid[a]) === -1) {
  //         // TODO: swap method
  //       }
  //     }

  //   }

}

function subGrid(turns, steps, index, inverted) {
  let subGridFlatArray = [];

  // r0, c0 is relative to the Grid. r0, c0 is the NestedArray[0][0] of each subGrid.
  let r0;
  let c0;
  if (turns === "horizontal") {
    r0 = Math.floor(
      Math.floor(steps / subGridRowLength) * subGridRowLength
    );
    c0 = Math.floor(
      Math.floor(index / subGridRowLength) * subGridRowLength
    );
    // rSG, cSG is relative to the subGrid.
    for (let rSG = 0; rSG < subGridRowLength; rSG++) {
      for (let cSG = 0; cSG < subGridRowLength; cSG++) {
        // debug only
        // updateStatus("horizontal", steps);

        if (statusNestedArray[r0 + rSG][c0 + cSG] === true && typeof inverted === 'undefined' ||
          rSG === 0 && cSG < subGridRowLength
        ) {
          subGridFlatArray.push(undefined);
          continue; // prevent overlapping loop if the condition is satisfied.
        }
        if (statusNestedArray[r0 + rSG][c0 + cSG] === false ||
          inverted === true && statusNestedArray[r0 + rSG][c0 + cSG] === true && rSG === 0 && cSG < subGridRowLength
        ) subGridFlatArray.push(gridNestedArray[r0 + rSG][c0 + cSG]);
      }
    }
  } else if (turns === "vertical") {
    r0 = Math.floor(
      Math.floor(index / subGridRowLength) * subGridRowLength
    );
    c0 = Math.floor(
      Math.floor(steps / subGridRowLength) * subGridRowLength
    );
    // rSG, cSG is relative to the subGrid.
    for (let rSG = 0; rSG < subGridRowLength; rSG++) {
      for (let cSG = 0; cSG < subGridRowLength; cSG++) {
        // debug only
        // updateStatus("horizontal", steps);

        if (statusNestedArray[r0 + rSG][c0 + cSG] === true && typeof inverted === 'undefined' ||
          rSG < subGridRowLength && cSG === 0
        ) { 
          subGridFlatArray.push(undefined);
          continue; // prevent overlapping loop if the conditions is satisfied.
        }
        if (statusNestedArray[r0 + rSG][c0 + cSG] === false ||
          inverted === true && statusNestedArray[r0 + rSG][c0 + cSG] === true && rSG < subGridRowLength && cSG === 0
        ) subGridFlatArray.push(gridNestedArray[r0 + rSG][c0 + cSG]);
      }
    }
  }

  // debug only
  if (turns === "horizontal") {
    console.log(`horizontal r0 ${r0} c0 ${c0} subGrid ${subGridFlatArray}`)
  } else if (turns === "vertical") {
    console.log(`vertical r0 ${r0} c0 ${c0} subGrid ${subGridFlatArray}`);
  }

  return subGridFlatArray;
}