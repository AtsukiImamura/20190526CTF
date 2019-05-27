const solve = require('../index.js')
const util = require('../src/utils/mainUtil')
const constant = require('../src/constants/puzzleConstant.js')
const stringUtil = require('../src/utils/stringUtil')

let p = createRundumPuzzle(100, 3, 3)
console.log(stringUtil.puzzleToString(p))
console.log(solve(p.join(',')))


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
    while (cnt < movingNum) {
        let direction = Math.floor(Math.random() * 4)
        if (move(puzzle, direction)) {
            cnt++
        }
    }

    return puzzle
}

function move(puzzle, direction) {
    let width = puzzle[0].length
    let height = puzzle.length

    let blankPosition = util.searchBlank(puzzle)

    // 坳
    if (blankPosition[constant.COL] < width - 1 && direction == constant.RIGHT) {
        util.toRight(puzzle)
        return true
    }
    // 上
    if (blankPosition[constant.ROW] > 0 && direction == constant.UP) {
        util.up(puzzle)
        return true
    }
    // 左
    if (blankPosition[constant.COL] > 0 && direction == constant.LEFT) {
        util.toLeft(puzzle)
        return true
    }
    // 下
    if (blankPosition[constant.ROW] < height - 1 && direction == constant.RIGHT) {
        util.down(puzzle)
        return true
    }

    return false
}

function resToDirec(data) {
    data = data.replace(/0/, '^')
    data = data.replace(/1/, '>')
    data = data.replace(/2/, '')
    data = data.replace(/3/, '<')

    return data
}