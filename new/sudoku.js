function newGrid(subGridRowSize) {
    let array = [];
    let gridSize = Math.pow(Math.pow(subGridRowSize, 2), 2);
    let arrayLength = Math.pow(subGridRowSize, 2);
    while (gridSize != 0) {
      gridSize--;
      array.push(0);
    }
    return nestedArray(array, arrayLength, subGridRowSize);
  }
  
  function nestedArray(array, arrayLength, subGridRowSize) {
    let i = 0;
    let tempNestedArray = [];
  
    for (i = 0; i < array.length; i += arrayLength) {
      tempRow = array.slice(i, i + arrayLength);
      tempNestedArray.push(tempRow);
    }
  
    return populate(tempNestedArray, arrayLength, subGridRowSize);
  }
  
  function populate(tempNestedArray, arrayLength, subGridRowSize) {
    for (r0 = 0; r0 < arrayLength; r0 += subGridRowSize) {
      for (c0 = 0; c0 < arrayLength; c0 += subGridRowSize) {
        let subGridSize = subGridRowSize * subGridRowSize;
        let possibleNumber = [];
        for (n = 1; n <= subGridSize; n++) {
          possibleNumber.push(n);
        }
        for (r = 0; r < subGridRowSize; r++) {
          for (c = 0; c < subGridRowSize; c++) {
            n = Math.floor(Math.random() * subGridSize + 1);
            if (possibleNumber.indexOf(n) > -1) {
              console.log(`set ${r0 + r},${c0 + c},${n} possible ${possibleNumber}`);
              possibleNumber.splice(possibleNumber.indexOf(n),1);
              tempNestedArray[r0+r][c0+c] = n;
            } else c--;
          }
        }
      }
    }
    return tempNestedArray;
  }
  