# slide-puzzle
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
