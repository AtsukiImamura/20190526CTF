module.exports = {
    /** ノードを見やすい形にする（デバッグ用） */
    nodeToString: function (node, prefix = '') {
        let str = prefix + '{\n'
        str += puzzleToString(node.puzzle, prefix)
        str += pathToString(node.path, prefix) + '\n'
        str += prefix + '  hash: ' + node.hash
        str += '\n' + prefix + '}'

        return str
    },

    /** パスを見やすい形にする（デバッグ用） */
    pathToString: function (path, prefix = '') {
        let str = prefix + '  path: ['
        for (let p of path) {
            str += p + ' '
        }
        str += ']'
        return str
    },

    /** パズルを見やすい形にする（デバッグ用） */
    puzzleToString: function (puzzle, prefix = '') {
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
    },

    /** ノードを特定するハッシュを作成する */
    nodeToHash: function (node) {
        return node.path.reduce((a, x) => {
            return a + (a === '' ? '' : '-') + x
        }, '')
    },

    /** 
     * パズル盤面を文字列ハッシュ化する
     * （ここでは 000-000-000 形式に１次元化するだけ）
     */
    puzzleToHash: function (puzzle) {
        let hash = ''
        for (let row of puzzle) {
            for (let col of row) {
                hash += col
            }
            hash += '-'
        }
        return hash
    }
}