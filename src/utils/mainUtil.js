const constant = require('../constants/puzzleConstant')

module.exports = {

    /** 
     * 与えられたパズルのブランクを上に移動させたものを返す。
     * 副作用は伴わない
     */
    up: function (puzzle) {
        let blankPosition = this.searchBlank(puzzle)
        let p = this.copyArray(puzzle)
        p[blankPosition[constant.ROW]][blankPosition[constant.COL]] = p[blankPosition[constant.ROW] - 1][blankPosition[constant.COL]]
        p[blankPosition[constant.ROW] - 1][blankPosition[constant.COL]] = 0
        return p
    },

    /** 
     * 与えられたパズルのブランクを下に移動させたものを返す。
     * 副作用は伴わない
     */
    down: function (puzzle) {
        let blankPosition = this.searchBlank(puzzle)
        let p = this.copyArray(puzzle)
        p[blankPosition[constant.ROW]][blankPosition[constant.COL]] = p[blankPosition[constant.ROW] + 1][blankPosition[constant.COL]]
        p[blankPosition[constant.ROW] + 1][blankPosition[constant.COL]] = 0
        return p
    },

    /** 
     * 与えられたパズルのブランクを右に移動させたものを返す。
     * 副作用は伴わない
     */
    toRight: function (puzzle) {
        let blankPosition = this.searchBlank(puzzle)
        let p = this.copyArray(puzzle)
        p[blankPosition[constant.ROW]][blankPosition[constant.COL]] = p[blankPosition[constant.ROW]][blankPosition[constant.COL] + 1]
        p[blankPosition[constant.ROW]][blankPosition[constant.COL] + 1] = 0
        return p
    },

    /** 
     * 与えられたパズルのブランクを左に移動させたものを返す。
     * 副作用は伴わない
     */
    toLeft: function (puzzle) {
        let blankPosition = this.searchBlank(puzzle)
        let p = this.copyArray(puzzle)
        p[blankPosition[constant.ROW]][blankPosition[constant.COL]] = p[blankPosition[constant.ROW]][blankPosition[constant.COL] - 1]
        p[blankPosition[constant.ROW]][blankPosition[constant.COL] - 1] = 0
        return p
    },

    /** ブランク（０）の座業を探す */
    searchBlank: function (puzzle) {
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
    },

    /** 配列をコピーする */
    copyArray: function (arr) {
        if (!arr) {
            return []
        }
        return arr.slice(0)
    },

    /** 
     * パズルをコピーする
     * （本当はcopyArrayでやりたいが、うまくコピーできていないときがあるのでこちらを使う）
     */
    copyPuzzle: function (pzl) {
        let n = []
        for (let row of pzl) {
            let v = []
            for (let col of row) {
                v.push(col)
            }
            n.push(v)
        }
        return n
    },
}