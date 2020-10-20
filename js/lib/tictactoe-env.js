/**
 * OXゲームに関する定数クラス
 *
 * @class OX
 */
class OX {
    static get SIZE() { return 3; }
    static get X_NUM() { return -1; }
    static get E_NUM() { return 0; }
    static get O_NUM() { return 1; }
    static get X_STR() { return 'x'; }
    static get E_STR() { return '-'; }
    static get O_STR() { return 'o'; }
    static get X_BOOL() { return true; }
    static get O_BOOL() { return false; }

    static btos(b) {
        switch (b) {
            case OX.X_BOOL:
                return OX.X_STR;
            case OX.O_BOOL:
                return OX.O_STR;
        }
    }

    static bton(b) {
        switch (b) {
            case OX.X_BOOL:
                return OX.X_NUM;
            case OX.O_BOOL:
                return OX.O_NUM;
        }
    }

    static itos(i) {
        switch (i) {
            case OX.X_NUM:
                return OX.X_STR;
            case OX.E_NUM:
                return OX.E_STR;
            case OX.O_NUM:
                return OX.O_STR;
        }
    }

    static itob(i) {
        switch (i) {
            case OX.X_NUM:
                return OX.X_BOOL;
            case OX.O_NUM:
                return OX.O_BOOL;
        }
    }
}


/**
 * Oxゲーム環境クラス
 *
 * @class TictactoeEnv
 */
class TictactoeEnv {

    /**
     *Creates an instance of TictactoeEnv.
     * @memberof TictactoeEnv
     */
    constructor() {
        this.board = null;
        this.current_player = null;
        this.reset();
    }

    /**
     * ゲームを初期化する関数
     *
     * @memberof TictactoeEnv
     */
    reset() {
        this.board = new Array(OX.SIZE * OX.SIZE).fill(OX.E_NUM);
        this.current_player = OX.X_BOOL;
    }

    /**
     * ターン交代を行う関数
     *
     * @returns {bool, str} - 勝負が決まったかどうか，誰が勝ったかどうか（まだ勝負が決まていない場合null）
     * @memberof TictactoeEnv
     */
    changeTurn() {
        var result = this.judgeResult();

        if (result.x_win) {
            return { "isOver": true, "winner": OX.X_STR };
        } else if (result.o_win) {
            return { "isOver": true, "winner": OX.O_STR };
        } else if (result.is_full) {
            return { "isOver": true, "winner": OX.E_STR };
        } else {
            this.current_player = !this.current_player;
            return { "isOver": false, "winner": null };
        }
    }

    /**
     * 記号を置く関数
     *
     * @param {int} idx - 置いた座標（1次元）
     * @returns {boolean} 置けたかどうか
     * @memberof TictactoeEnv
     */
    put(idx) {
        if (this.board[idx] == OX.E_NUM) {
            this.board[idx] = OX.bton(env.current_player);
            return true;
        } else {
            alert("そこには置けません！");
            return false;
        }
    }

    /**
     * 勝敗を判定する関数
     *
     * @returns Xが勝った, Oが勝ったか, 盤が全て埋まっているか
     * @memberof TictactoeEnv
     */
    judgeResult() {
        var x_win = false;
        var o_win = false;
        var is_full = !isExist(this.board, OX.E_NUM);

        for (var i = 0; i < OX.SIZE; i++) {
            var row = this.board.slice(i * OX.SIZE, i * OX.SIZE + OX.SIZE);
            var col = [];
            for (var j = 0; j < OX.SIZE; j++) {
                col.push(this.board[conv2dto1d(j, i)]);
            }

            var _whoWin = this.whoWin(row, col);
            x_win |= _whoWin.x_win;
            o_win |= _whoWin.o_win;
        }

        var diag_lr = [];
        var diag_rl = [];
        for (var i = 0; i < OX.SIZE; i++) {
            diag_lr.push(this.board[conv2dto1d(i, i)]);
            diag_rl.push(this.board[conv2dto1d(i, (OX.SIZE - 1) - i)]);
        }

        var _whoWin = this.whoWin(diag_lr, diag_rl);
        x_win |= _whoWin.x_win;
        o_win |= _whoWin.o_win;

        return { x_win: x_win, o_win: o_win, is_full: is_full };
    }

    /**
     * 縦横斜めから誰が勝ったかを判定する関数
     *
     * @param {array[int]} arr1 - 縦横斜めの配列
     * @param {array[int]} arr2 - 縦横斜めの配列
     * @returns Oが勝ったか，Xが勝ったか
     * @memberof TictactoeEnv
     */
    whoWin(arr1, arr2) {
        var x_win = false;
        var o_win = false;

        if (sum(arr1) == OX.SIZE || sum(arr2) == OX.SIZE) {
            o_win = true;
        }
        if (sum(arr1) == -OX.SIZE || sum(arr2) == -OX.SIZE) {
            x_win = true;
        }

        return { o_win: o_win, x_win: x_win };
    }
}