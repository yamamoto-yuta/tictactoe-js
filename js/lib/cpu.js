/**
 * CPUに関するクラス
 *
 * @class Cpu
 */
class Cpu {

    /**
     *Creates an instance of Cpu.
     * @param {array[number]} board - Tictactoe-env.board
     * @param {number} sign - CPUの記号（数字）
     * @memberof Cpu
     */
    constructor(board, sign) {
        this.board = board;
        this.sign = sign;
    }

    /**
     * CPUのターンを制御する関数
     *
     * @returns - {x: number, y: number} どの座標に置いたか
     * @memberof Cpu
     */
    put() {
        var canPut = []
        this.board.map(function(v, i) {
            if (v == OX.E_NUM) {
                canPut.push(i);
            }
        });
        return canPut;

        // var putPos = canPut[randbetween(0, canPut.length)];
        // this.board[putPos] = this.sign;

        // return conv1dto2d(putPos);
    }
}