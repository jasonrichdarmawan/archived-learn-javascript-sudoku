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