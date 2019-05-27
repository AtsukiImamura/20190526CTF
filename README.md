# slide-puzzle
`slide-puzzle` gives you a way to solve the [slide-puzzle](https://en.wikipedia.org/wiki/Sliding_puzzle). You can solve your slide-puzzle more quickly and easily by using this package. From today on, you do not need to get nervous when your children ask you to solve slide-puzzle got tangled up!

## Get Started
```
npm install [--save-dev] slide-puzzle
```

## Usage
```~~javascript
const solve = require('slide-puzzle')

// 0 represents blank.
let puzzle = [
    [1,4,2],
    [3,5,0],
    [6,7,8]
]

let ans = solve(puzzle)
console.log(ans) // 3,0,3

// Number 0 to 3 represent as follow:
//  0 : Up
//  1 : to Right
//  2 : Down
//  3 : to Left
```

## Docs
### methods
#### solve(puzzle)

```
 Solve the given puzzle. 
 
 @param puzzle:  Puzzle data. 
```
 Puzzle data must be an array. 
 Each element represents the row of the puzzle and each element in it represents the column in the row.

 The method may throws error such as situation below:
   1. There is some wrong in given puzzle data.
   2. There is no more nodes to be searched.

Note that a stack over flow may occur beause a recursive method is used in this method.

