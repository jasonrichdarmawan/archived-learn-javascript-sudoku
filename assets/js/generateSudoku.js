let subGridRowLength = 2;
let gridRowLength = Math.pow(2, 2);

let gridNestedArray = [
  [3, 2, 3, 2],
  [1, 4, 4, 1],
  [2, 3, 1, 3],
  [1, 4, 4, 2]
];

let statusNestedArray = [
  [, , , ],
  [, , , ],
  [, , , ],
  [, , , ]
]

loopsteps();

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
    // TODO: strategy
    if (sortWithSG(turns, steps, "canSort") === true) {
      sortWithSG(turns, steps, "sort");
      check(turns, steps) // recursive
    } else if (request === "canFix") return false;
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
  console.log(tempSubGrid);

  let tempFlatArray = [];

  if (turns === "horizontal") {
    tempFlatArray = gridNestedArray[steps];
  } else if (turns === "vertical") {
    tempFlatArray = columnToFlatArray(steps);
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

function listDuplicates(turns, steps, request) {
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
          if (rSG === 0) {
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
          if (cSG === 0) {
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