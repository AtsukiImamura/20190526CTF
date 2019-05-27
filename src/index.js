const constant = require('./constants/puzzleConstant.js')
const util = require('./utils/mainUtil')
const stringUtil = require('./utils/stringUtil')

/** 現在検査対象のノード */
var currentNodes = []
var debugCnt = 0


/** パズルを解く。
 * @param data 0-9が一度づつ現れる文字列。 ex. 1,5,3,...,8
 */
module.exports = function (data) {
    let puzzle = createPuzzleByString(data)

    currentNodes[stringUtil.puzzleToHash(puzzle)] = {
        puzzle: puzzle,
        path: [],
        hash: ''
    }

    let cnt = 0
    while (true) {
        let hashList = Object.keys(currentNodes)
        if (hashList.lengh < 1) {
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

/** 文字列データからパズルのデータを作成する */
function createPuzzleByString(data) {
    let ansExMatches = data.match(new RegExp('[0-9]', "g"));
    if (ansExMatches == null || ansExMatches.length != 9) {
        throw new Error('Given string must includes exact 9 numbers covering between 0 and 9.')
    }

    let puzzle = []
    let cnt = 0
    let row = []
    for (ex of ansExMatches) {
        if (cnt % constant.WIDTH == 0) {
            row = []
        }
        row.push(Number(ex))
        if (cnt % constant.WIDTH == constant.WIDTH - 1) {
            puzzle.push(row)
        }
        cnt++
    }

    return puzzle
}

/** 
 * 与えられたノードを、指定された最大コストを下回る子ノードについて再帰的に探索する
 * @param node 探索するノード。puzzle, path, hash をフィールドに持つオブジェクト
 * @param maxCost 探索する際に対象とする最大のコスト
 * @param prefix デバッグで表示する際に階層を示す接頭辞
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


/** 最終状態かチェック */
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



/** 与えられたノードから１ステップで到達可能なノードの配列を得る */
function createChildren(node) {
    // ０（ブランク）の位置を検出
    let blankPosition = util.searchBlank(node.puzzle)

    let children = []

    // 右
    if (blankPosition[constant.COL] < constant.WIDTH - 1) {
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
    if (blankPosition[constant.ROW] < constant.HEIGHT - 1) {
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
function calcTotalCost(node) {
    return node.path.length * constant.WEIGHT + calcHeuristicCost(node.puzzle) * (1 - constant.WEIGHT)
}

/** 
 * 与えられたノードのヒューリスティックを返す。
 * ここでは、結果が良いとされる各数字の本来の位置までのマンハッタン距離の合計 
 * */
function calcHeuristicCost(puzzle) {
    let cost = 0
    for (let row of puzzle) {
        for (let col of row) {
            cost += Math.floor(col / 3) + col % 3
        }
    }
    return cost
}