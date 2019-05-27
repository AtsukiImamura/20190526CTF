const constant = require('./constants/puzzle_constant.js')

/** 現在検査対象のノード */
var currentNodes = []
/** チェック済みの盤面（ループしないように管理） */
var checkedPattern = []


/** パズルを解く。
 * @param data 0-9が一度づつ現れる文字列。 ex. 1,5,3,...,8
 */
module.exports = function (data) {
    let puzzle = createPuzzleByString(data)
    currentNodes.push({
        puzzle: puzzle,
        path: [],
        hash: ''
    })

    while (true) {
        if (currentNodes.lengh == 0) {
            throw new Error('There is no more nodes to be checked.')
        }

        // 検査対象のノードの中で最もコストの小さいものを取得
        let minCost = calcTotalCost(currentNodes[0])
        let node = currentNodes[0]
        for (let i = 0; i < currentNodes.length; i++) {
            let c = calcTotalCost(currentNodes[i])
            if (c < minCost) {
                minCost = c
                node = currentNodes[i]
            }
        }

        // 最もコストの小さいノードを対象に、検索を進める
        let res = searchCurrent(node, calcTotalCost(node))

        if (res) {
            return res.path.join(',')
        }
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
    let totalCost = calcTotalCost(node)
    if (totalCost > maxCost) {
        return false
    }
    // １ステップで到達可能な状態を全て取得
    let children = createChildren(node)
    // 既にチェックした盤面を除外
    children = children.filter(child => !checkedPattern.includes(puzzleToHash(child.puzzle)))
    // 検索対象に加える
    currentNodes.push(...children)
    // 現在のパズル盤面を検査済みに
    checkedPattern.push(puzzleToHash(node.puzzle))
    // 現在のnodeを検査対象外に
    currentNodes = currentNodes.filter(n => n.hash !== node.hash)
    // 新たに別にチェックされている可能性があるので
    currentNodes = currentNodes.filter(n => !checkedPattern.includes(puzzleToHash(n.puzzle)))

    for (let child of children) {
        // 再帰的に子ノードを検査（現在のコスト条件を満たす間は再帰的に探索を続ける）
        let res = searchCurrent(child, maxCost, prefix + '    ')
        if (!res) continue
        return res
    }
    // 与えられた最大コストでは解が見つからなかったことを示す
    return false
}


/** 
 * パズル盤面を文字列ハッシュ化する
 * （ここでは 000-000-000 形式に１次元化するだけ）
 */
function puzzleToHash(puzzle) {
    let hash = ''
    for (let row of puzzle) {
        for (let col of row) {
            hash += col
        }
        hash += '-'
    }
    return hash
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

/** ノードを見やすい形にする（デバッグ用） */
function nodeToString(node, prefix = '') {
    let str = prefix + '{\n'
    str += puzzleToString(node.puzzle, prefix)
    str += pathToString(node.path, prefix) + '\n'
    str += prefix + '  hash: ' + node.hash
    str += '\n' + prefix + '}'

    return str
}

/** パスを見やすい形にする（デバッグ用） */
function pathToString(path, prefix = '') {
    let str = prefix + '  path: ['
    for (let p of path) {
        str += p + ' '
    }
    str += ']'
    return str
}

/** パズルを見やすい形にする（デバッグ用） */
function puzzleToString(puzzle, prefix = '') {
    let str = ''
    str += prefix + '  puzzle:\n' + prefix + '    [\n'
    for (let row of puzzle) {
        str += prefix + '      ['
        for (let col of row) {
            str += col + ' '
        }
        str += ']\n'
    }
    str += prefix + '    ]\n'

    return str
}

/** ノードを特定するハッシュを作成する */
function nodeToHash(node) {
    return node.path.reduce((a, x) => {
        return a + (a === '' ? '' : '-') + x
    }, '')
}

/** 与えられたノードから１ステップで到達可能なノードの配列を得る */
function createChildren(node) {
    // ０（ブランク）の位置を検出
    let blankPosition = searchBlank(node.puzzle)

    let children = []

    // 右
    if (blankPosition[constant.COL] < constant.WIDTH - 1) {
        let path = copyArray(node.path)
        path.push(constant.RIGHT)
        children.push({
            puzzle: toRight(copyPuzzle(node.puzzle)),
            path: path
        })
    }
    // 上
    if (blankPosition[constant.ROW] > 0) {
        let path = copyArray(node.path)
        path.push(constant.UP)
        children.push({
            puzzle: up(copyPuzzle(node.puzzle)),
            path: path
        })
    }
    // 左
    if (blankPosition[constant.COL] > 0) {
        let path = copyArray(node.path)
        path.push(constant.LEFT)
        children.push({
            puzzle: toLeft(copyPuzzle(node.puzzle)),
            path: path
        })
    }
    // 下
    if (blankPosition[constant.ROW] < constant.HEIGHT - 1) {
        let path = copyArray(node.path)
        path.push(constant.DOWN)
        children.push({
            puzzle: down(copyPuzzle(node.puzzle)),
            path: path
        })
    }

    // ハッシュをつけて返す
    return children.map(child => {
        child.hash = nodeToHash(child)
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

/** 
 * 与えられたパズルのブランクを上に移動させたものを返す。
 * 副作用は伴わない
 */
function up(puzzle) {
    let blankPosition = searchBlank(puzzle)
    let p = copyArray(puzzle)
    p[blankPosition[constant.ROW]][blankPosition[constant.COL]] = p[blankPosition[constant.ROW] - 1][blankPosition[constant.COL]]
    p[blankPosition[constant.ROW] - 1][blankPosition[constant.COL]] = 0
    return p
}

/** 
 * 与えられたパズルのブランクを下に移動させたものを返す。
 * 副作用は伴わない
 */
function down(puzzle) {
    let blankPosition = searchBlank(puzzle)
    let p = copyArray(puzzle)
    p[blankPosition[constant.ROW]][blankPosition[constant.COL]] = p[blankPosition[constant.ROW] + 1][blankPosition[constant.COL]]
    p[blankPosition[constant.ROW] + 1][blankPosition[constant.COL]] = 0
    return p
}

/** 
 * 与えられたパズルのブランクを右に移動させたものを返す。
 * 副作用は伴わない
 */
function toRight(puzzle) {
    let blankPosition = searchBlank(puzzle)
    let p = copyArray(puzzle)
    p[blankPosition[constant.ROW]][blankPosition[constant.COL]] = p[blankPosition[constant.ROW]][blankPosition[constant.COL] + 1]
    p[blankPosition[constant.ROW]][blankPosition[constant.COL] + 1] = 0
    return p
}

/** 
 * 与えられたパズルのブランクを左に移動させたものを返す。
 * 副作用は伴わない
 */
function toLeft(puzzle) {
    let blankPosition = searchBlank(puzzle)
    let p = copyArray(puzzle)
    p[blankPosition[constant.ROW]][blankPosition[constant.COL]] = p[blankPosition[constant.ROW]][blankPosition[constant.COL] - 1]
    p[blankPosition[constant.ROW]][blankPosition[constant.COL] - 1] = 0
    return p
}

/** ブランク（０）の座業を探す */
function searchBlank(puzzle) {
    r = 0
    for (let row of puzzle) {
        c = 0
        for (let col of row) {
            if (col == 0) {
                return [r, c]
            }
            c++
        }
        r++
    }
    return []
}

/** 配列をコピーする */
function copyArray(arr) {
    if (!arr) {
        return []
    }
    return arr.slice(0)
}

/** 
 * パズルをコピーする
 * （本当はcopyArrayでやりたいが、うまくコピーできていないときがあるのでこちらを使う）
 */
function copyPuzzle(pzl) {
    let n = []
    for (let row of pzl) {
        let v = []
        for (let col of row) {
            v.push(col)
        }
        n.push(v)
    }
    return n
}