const constant = require('./src/constants/puzzleConstant.js')
const util = require('./src/utils/mainUtil')
const stringUtil = require('./src/utils/stringUtil')

/** Nodes waiting to be searched. */
var currentNodes = []
var debugCnt = 0

/** Width of puzzle */
var PUZZLE_WIDTH = 0
/** Height of puzzle */
var PUZZLE_HEIGHT = 0


/** 
 * Solve the given puzzle. 
 * The method throws Error as follow situation:
 *   1. There is some wrong in given puzzle data.
 *   2. There is no more nodes to be searched.
 * There is recursive method in this method, so a stack over flow may occur.
 * 
 * @param puzzle Puzzle data. 
 * Puzzle data must be an array. 
 * Each element represents the row of the puzzle and Each element in it represents the column on the row.
 */
module.exports = function (puzzle) {

    let validationMessages = validatePuzzle(puzzle)
    if (validationMessages.length > 0) {
        throw new Error(validationMessages.join(' | '))
    }

    PUZZLE_HEIGHT = puzzle.length
    PUZZLE_WIDTH = puzzle[0].length

    currentNodes[stringUtil.puzzleToHash(puzzle)] = {
        puzzle: puzzle,
        path: [],
        hash: ''
    }

    let cnt = 0
    while (true) {
        let hashList = Object.keys(currentNodes)
        if (hashList.length < 1) {
            console.log('check!!!')
            throw new Error('There is no more nodes to be checked.')
        }

        // 検査対象のノードの中で最もコストの小さいものを取得
        let minCost = calcTotalCost(currentNodes[hashList[0]])
        let node = currentNodes[hashList[0]]

        for (let pHash of hashList) {
            let c = calcTotalCost(currentNodes[pHash])
            if (c < minCost) {
                minCost = c
                node = currentNodes[pHash]
            }
        }

        if (!node) {
            throw new Error('Why is the node null here?')
        }

        for (let pHash of hashList) {
            let res = searchCurrent(currentNodes[pHash], minCost)
            if (res) {
                return res.path.join(',')
            }
        }
        cnt++
    }
}


function validatePuzzle(puzzle) {
    let messages = []
    if (!_validateNull(puzzle))
        messages.push('Puzzle must not be null.')
    if (!_validateType(puzzle))
        messages.push('Puzzle must not be an array.')
    if (!_validateShape(puzzle))
        messages.push('Shape of the puzzle is sketchy.')

    return messages
}

function _validateNull(puzzle) {
    return puzzle != undefined & puzzle != null
}

function _validateType(puzzle) {
    return typeof puzzle === 'object'
}

function _validateShape(puzzle) {
    let width = 0
    try {
        width = puzzle[0].length
        for (row of puzzle) {
            if (row.length != width) {
                return false
            }
        }
    } catch (e) {
        return false
    }
    return true
}


/** 
 * Search recursively child nodes witch costs lower than given max cost.
 * @param node A node to be searched. Node must have fields named 'puzzle', 'path', 'hash'.
 * @param maxCost Max cost. 
 * @param prefix Prefix witch represents hierarchy of node for debug
 */
function searchCurrent(node, maxCost, prefix = '') {
    // 完成しているなら探索を終了
    if (checkGoal(node.puzzle)) {
        return node
    }
    // コストが高いものは探索を打ち切り
    if (calcTotalCost(node) > maxCost) {
        return false
    }

    // console.log('[' + (debugCnt++) + ']')

    // １ステップで到達可能な状態を全て取得
    let children = createChildren(node)

    delete currentNodes[stringUtil.puzzleToHash(node.puzzle)]

    for (let child of children) {
        let pHash = stringUtil.puzzleToHash(child.puzzle)
        if (!currentNodes[pHash]) {
            currentNodes[pHash] = child
        }
        if (calcTotalCost(child) > maxCost) {
            continue
        }

        // 再帰的に子ノードを検査（現在のコスト条件を満たす間は再帰的に探索を続ける）
        let res = searchCurrent(child, maxCost, prefix + '    ')
        if (!res) continue
        return res
    }
    // 与えられた最大コストでは解が見つからなかったことを示す
    return false
}


/**
 * Check that puzzle is solved ot not.
 */
function checkGoal(puzzle) {
    let cnt = 0
    for (let r = 0; r < puzzle.length; r++) {
        for (let c = 0; c < (puzzle[r]).length; c++) {
            if (cnt++ != puzzle[r][c]) {
                return false
            }
        }
    }
    return true
}


/**
 * Get list of node that can be reached from given node by one step.
 */
function createChildren(node) {
    // ０（ブランク）の位置を検出
    let blankPosition = util.searchBlank(node.puzzle)

    let children = []

    // 右
    if (blankPosition[constant.COL] < PUZZLE_WIDTH - 1) {
        let path = util.copyArray(node.path)
        path.push(constant.RIGHT)
        children.push({
            puzzle: util.toRight(util.copyPuzzle(node.puzzle)),
            path: path
        })
    }
    // 上
    if (blankPosition[constant.ROW] > 0) {
        let path = util.copyArray(node.path)
        path.push(constant.UP)
        children.push({
            puzzle: util.up(util.copyPuzzle(node.puzzle)),
            path: path
        })
    }
    // 左
    if (blankPosition[constant.COL] > 0) {
        let path = util.copyArray(node.path)
        path.push(constant.LEFT)
        children.push({
            puzzle: util.toLeft(util.copyPuzzle(node.puzzle)),
            path: path
        })
    }
    // 下
    if (blankPosition[constant.ROW] < PUZZLE_HEIGHT - 1) {
        let path = util.copyArray(node.path)
        path.push(constant.DOWN)
        children.push({
            puzzle: util.down(util.copyPuzzle(node.puzzle)),
            path: path
        })
    }

    // ハッシュをつけて返す
    return children.map(child => {
        child.hash = stringUtil.nodeToHash(child)
        return child
    })
}

/** 与えられたノードのコストを返す */
/**
 * Return the cost of given node.
 * The cost is defined as the sum of length of path from the root to the node AND calcurated heuristic cost.
 * @param {*} node 
 */
function calcTotalCost(node) {
    return node.path.length * constant.WEIGHT + calcHeuristicCost(node.puzzle) * (1 - constant.WEIGHT)
}

/**
 * Calcurate heuristic cost of given puzzle.
 * Cost is to calcurated as the sum of the Manhattan distance from each number's position to correct position.
 */
function calcHeuristicCost(puzzle) {
    let cost = 0
    for (let row of puzzle) {
        for (let col of row) {
            cost += Math.floor(col / 3) + col % 3
        }
    }
    return cost
}