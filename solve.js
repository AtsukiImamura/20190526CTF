const ROW = 0
const COL = 1

const UP = 0
const RIGHT = 1
const DOWN = 2
const LEFT = 3

const WEIGHT = 0.5

var currentNodes = []
var checkedPattern = []

var debugCnt = 0

const fs = require('fs');
const Netcat = require('node-netcat')
let client = new Netcat.client(24912, '133.242.50.201')
let writeStr = ''
let cnt = 0
client.start()
client.on('data', function (data) {
    writeStr = '\n' + data.toString('utf-8', 0, data.length)
    fs.writeFile('res.txt', writeStr, function (err) { });

    if (cnt > 0) {
        return
    }
    cnt++
    let ans = main(data.toString('utf-8', 0, data.length))
    if (ans === '') {
        return
    }

    writeStr += '\nans = ' + ans
    fs.writeFile('res.txt', writeStr, function (err) { });

    client.send(ans)
})




function main(data) {
    // const execSync = require('child_process').execSync;
    // const buf = execSync('nc 133.242.50.201 24912');
    // let data = buf.toString('utf-8', 0, buf.length)
    let ansExMatches = data.match(new RegExp('0[0-9]', "g"));
    if (ansExMatches == null || ansExMatches.length != 9) {
        // console.log('Length of ansExMatches must be 9.')
        return ''
    }

    let puzzle = []
    let cnt = 0
    let row = []
    for (ex of ansExMatches) {
        if (cnt % 3 == 0) {
            row = []
        }
        row.push(Number(ex))
        if (cnt % 3 == 2) {
            puzzle.push(row)
        }
        cnt++
    }
    // return

    let firstNode = {
        puzzle: puzzle,
        path: [],
        hash: ''
    }
    currentNodes.push(firstNode)

    let flag = ''
    let end = false
    let date = new Date()
    let startAt = (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) * 1000 + date.getMilliseconds()
    while (!end) {
        if (currentNodes.lengh == 0) {
            return ''
        }

        let minCost = calcTotalCost(currentNodes[0])
        let node = currentNodes[0]
        for (let i = 0; i < currentNodes.length; i++) {
            let c = calcTotalCost(currentNodes[i])
            if (c < minCost) {
                minCost = c
                node = currentNodes[i]
            }
        }

        let res = searchCurrent(node, calcTotalCost(node))

        if (res) {
            return res.path.join(',')
        }

        let now = new Date()
        if ((now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) * 1000 + now.getMilliseconds() > startAt + 20000) {
            end = true
        }
    }

    // console.log('flag = ' + flag)
    return ''
}


function nowToString() {
    let date = new Date()
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ':' + date.getMilliseconds()
}

function searchCurrent(node, maxCost, prefix = '') {
    debugCnt++
    if (checkGoal(node.puzzle)) {
        return node
    }

    let totalCost = calcTotalCost(node)
    if (totalCost > maxCost) {
        return false
    }
    let children = createChildren(node)
    children = children.filter(child => !checkedPattern.includes(puzzleToHash(child.puzzle)))

    // let gChildren = []
    // let newMaxCost = maxCost
    // for (let child of children) {
    //     let childTotalCost = calcTotalCost(child)
    //     console.log('[cost] ' + childTotalCost + '  [maxCost] ' + maxCost)
    //     if (childTotalCost < newMaxCost) {
    //         newMaxCost = childTotalCost
    //     }
    //     // if (childTotalCost > maxCost) {
    //     //     console.log('check!')
    //     //     continue
    //     // }
    //     gChildren.push(child)
    // }
    // currentNodes.push(...gChildren)

    currentNodes.push(...children)
    // maxcost = newMaxCost + 4
    // newMaxCost += 0.65
    // console.log(' ==> newMaxCost = ' + newMaxCost)
    // currentNodes.push(...children)

    checkedPattern.push(puzzleToHash(node.puzzle))
    // checkedPattern = Object.keys(checkedPattern.reduce((a, x) => {
    //     a[x] = true
    //     return a
    // }, {}))

    // nodeは不要になるので削除
    currentNodes = currentNodes.filter(n => {
        return n.hash !== node.hash
    })

    currentNodes = currentNodes.filter(n => {
        return !checkedPattern.includes(puzzleToHash(n.puzzle))
    })

    for (let child of children) {
        // console.log(puzzleToString(child.puzzle, prefix))
        // console.log(prefix + '  => cost = ' + calcTotalCost(child))
        // maxCost = calcTotalCost(child) + 1
        let res = searchCurrent(child, maxCost, prefix + '    ')
        if (!res) continue
        return res
    }

    return false
}

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


function nodeToString(node, prefix = '') {
    let str = prefix + '{\n'
    str += puzzleToString(node.puzzle, prefix)
    str += pathToString(node.path, prefix) + '\n'
    str += prefix + '  hash: ' + node.hash
    str += '\n' + prefix + '}'

    return str
}

function pathToString(path, prefix = '') {
    let str = prefix + '  path: ['
    for (let p of path) {
        str += p + ' '
    }
    str += ']'
    return str
}

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


function nodeToHash(node) {
    return node.path.reduce((a, x) => {
        return a + (a === '' ? '' : '-') + x
    }, '')
}

function createChildren(node) {
    let blankPosition = searchBlank(node.puzzle)
    let height = node.puzzle.length
    let width = node.puzzle[0].length
    let children = []

    if (blankPosition[COL] < width - 1) {
        let path = copyArray(node.path)
        path.push(RIGHT)
        let q = toRight(copyPuzzle(node.puzzle))
        children.push({
            puzzle: q,
            path: path
        })
    }
    if (blankPosition[ROW] > 0) {
        let path = copyArray(node.path)
        path.push(UP)
        let p = up(copyPuzzle(node.puzzle))
        // *console.log(puzzleToString(p))
        children.push({
            puzzle: p,
            path: path
        })
    }
    if (blankPosition[COL] > 0) {
        let path = copyArray(node.path)
        path.push(LEFT)
        let r = toLeft(copyPuzzle(node.puzzle))
        // *console.log(puzzleToString(r))
        children.push({
            puzzle: r,
            path: path
        })
    }
    if (blankPosition[ROW] < height - 1) {
        let path = copyArray(node.path)
        path.push(DOWN)
        let s = down(copyPuzzle(node.puzzle))
        // *console.log(puzzleToString(s))
        children.push({
            puzzle: s,
            path: path
        })
    }

    return children.map(child => {
        child.hash = nodeToHash(child)
        return child
    })
}


function calcTotalCost(node) {
    return node.path.length * WEIGHT + calcHeuristicCost(node.puzzle) * (1 - WEIGHT)
}

// function calcHeuristicCost(puzzle) {
//     // *console.log(puzzleToString(puzzle))
//     cost = 0
//     cnt = 0
//     for (let row of puzzle) {
//         for (let col of row) {
//             if (col !== cnt) {
//                 cost++
//             }
//             cnt++
//         }
//     }
//     // *console.log('[calcHeuristicCost] cost = ' + cost)
//     return cost
// }

function calcHeuristicCost(puzzle) {
    let cost = 0
    for (let row of puzzle) {
        for (let col of row) {
            cost += Math.floor(col / 3) + col % 3
        }
    }
    return cost
}


function up(puzzle) {
    let blankPosition = searchBlank(puzzle)
    let p = copyArray(puzzle)
    p[blankPosition[ROW]][blankPosition[COL]] = p[blankPosition[ROW] - 1][blankPosition[COL]]
    p[blankPosition[ROW] - 1][blankPosition[COL]] = 0
    return p
}

function down(puzzle) {
    let blankPosition = searchBlank(puzzle)
    let p = copyArray(puzzle)
    p[blankPosition[ROW]][blankPosition[COL]] = p[blankPosition[ROW] + 1][blankPosition[COL]]
    p[blankPosition[ROW] + 1][blankPosition[COL]] = 0
    return p
}

function toRight(puzzle) {
    let blankPosition = searchBlank(puzzle)
    let p = copyArray(puzzle)
    p[blankPosition[ROW]][blankPosition[COL]] = p[blankPosition[ROW]][blankPosition[COL] + 1]
    p[blankPosition[ROW]][blankPosition[COL] + 1] = 0
    return p
}

function toLeft(puzzle) {
    let blankPosition = searchBlank(puzzle)
    // *console.log('[left]')
    // *console.log(puzzleToString(puzzle))
    let p = copyArray(puzzle)
    p[blankPosition[ROW]][blankPosition[COL]] = p[blankPosition[ROW]][blankPosition[COL] - 1]
    p[blankPosition[ROW]][blankPosition[COL] - 1] = 0
    // *console.log(puzzleToString(p))
    return p
}




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

function copyArray(arr) {
    if (!arr) {
        return []
    }
    return arr.slice(0)
}

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