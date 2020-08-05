turns();

function turns() {
  // horizontal -> vertical -> horizontal -> repeat
  for (let steps = 0; steps < gridRowLength; steps++){
    // horizontal
    if (fix("horizontal", steps, "canFix") === true) {
      fix("horizontal", steps, "fix");
    } else if (fix("horizontal", steps, "canFix") === false) {
      console.log(`ERROR horizontal steps ${steps} needs new strategy`);
      break; // break if canFix return false
    }

    // vertical
    if (fix("vertical", steps, "canFix") === true) {
      fix("vertical", steps, "fix");
    } else if (fix("vertical", steps, "canFix") === false ) {
      console.log(`ERROR vertical steps ${steps} needs new strategy`)
      break; // break if canFix return false.
    }
  }

  // // horizontal -> vertical -> horizontal -> repeat
  // for (let steps = 0; steps < gridRowLength; steps++) {
  //   if (fix("horizontal", steps, "canFix") === true) {
  //     fix("horizontal", steps, "fix");
  //   } else if (fix("horizontal", steps, "canFix") === false) {
  //     break; // break if canFix return false.
  //   }

  //   if (fix("vertical", steps, "canFix") === true) {
  //     fix("vertical", steps, "fix");
  //   } else if (fix("vertical", steps, "canFix") === false) {
  //     break; // break if canFix return false.
  //   }
  // }
}

// function fix(turns, steps, request) {
//   if (isValid(turns, steps) === true) {
//     updateStatus(turns, steps);
//   } else if (isValid(turns, steps) === false) {
//     // TODO new strategy
//     if (sortWithSG(turns, steps, "canSort") === true) {
//       sortWithSG(turns, steps, "sort");
//       if (listDuplicates(turns, steps, "list").length > 0) fix(turns, steps);
//       if (requet === "canFix") return true;
//     } else if (sortWithSG(turns, steps, "canSort") === false) {
//       if (request === "canFix") {
//         return false;
//       }
//     }
//   }

//   // if (isValid(turns, steps) === true) {
//   //   updateStatus(turns, steps);
//   // } else if (isValid(turns, steps) === false) {
//   //   if (sortWithSG(turns, steps, "canSort") === true) { 
//   //     sortWithSG(turns, steps, "sort");
//   //     if (listDuplicates(turns, steps, "list").length > 0) fix(turns, steps);
//   //   }
//   //   // TODO: new strategy
//   //   else {
//   //     console.log(`ERROR fix(${turns}, steps ${steps}) needs new strategy`);
//   //     if (request === "canFix") {
//   //       return false;
//   //     }
//   //   }
//   // }
// }

function sortWithSG(turns, steps, request) {
    // let tempFlatArray = [];
  
    // let tempDuplicates = listDuplicates(turns, steps, "list");
  
    // // horizontal
    // if (turns === "horizontal") {
    //   tempFlatArray = gridNestedArray[steps];
    // }
  
    // // vertical
    // else if (turns === "vertical") {
    //   tempFlatArray = columnToFlatArray(steps);
    // }
  
    // let index = tempFlatArray.lastIndexOf(
    //   tempDuplicates[tempDuplicates.length - 1]
    // );
    
    // let tempSubGrid = subGrid(turns, steps, index);
    // console.log(`${turns} steps ${steps} index ${index} tempSubGrid ${tempSubGrid}`);
  
    // // horizontal
    // if (turns === "horizontal") {
    //   if (statusNestedArray[steps][index] === false) {
    //     if (request === "canSort") {
  
    //     } else if (request === "sort") {
    //       // swap
    //     }
    //   } else if (statusNestedArray[steps][index] === true) {
    //     if (request === "canSort") {
  
    //     } else if (request === "sort") {
    //       // swap
    //     }
    //   }
    // }
    
    // // vertical
    // else if (turns === "vertical") {
    //   if (statusNestedArray[index][steps] === false) {
    //     if (request === "canSort") {
  
    //     } else if (request === "sort") {
    //       // swap
    //     }
    //   } else if (statusNestedArray[index][steps] === true) {
    //     if (request === "canSort") {
  
    //     } else if (request === "sort") {
    //       // swap
    //     }
    //   }
    // }
  }