const solve = require('../index.js')
const util = require('../src/utils/mainUtil')
const constant = require('../src/constants/puzzleConstant.js')
const stringUtil = require('../src/utils/stringUtil')

let p = createRundumPuzzle(4, 4, 4)
console.log(stringUtil.puzzleToString(p))
console.log(solve(p))


function createRundumPuzzle(movingNum = 10, width = 3, height = 3) {
    let puzzle = []
    for (let r = 0; r < height; r++) {
        let row = []
        for (let c = 0; c < width; c++) {
            // row.push())
            row.push(r * width + c)
        }
        puzzle.push(row)
    }

    let cnt = 0
    let dircs = []
    while (cnt < movingNum) {
        dircs[cnt % 2] = Math.floor(Math.random() * 4)
        if (dircs[(cnt + 1) % 2] == (dircs[cnt % 2] + 2) % 4) {
            continue
        }
        puzzle = move(puzzle, dircs[cnt % 2])
        cnt++
    }

    return puzzle
}

function move(pz, direction) {
    let width = pz[0].length
    let height = pz.length

    let blankPosition = util.searchBlank(pz)

    // Right
    if (blankPosition[constant.COL] < width - 1 && direction == constant.RIGHT) {
        return util.toRight(pz)
    }
    // Up
    if (blankPosition[constant.ROW] > 0 && direction == constant.UP) {
        return util.up(pz)
    }
    // Left
    if (blankPosition[constant.COL] > 0 && direction == constant.LEFT) {
        return util.toLeft(pz)
    }
    // Down
    if (blankPosition[constant.ROW] < height - 1 && direction == constant.DOWN) {
        return util.down(pz)
    }

    return pz
}
