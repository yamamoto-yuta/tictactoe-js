/**
 * 盤オプションクラス
 *
 * @class BoardOption
 */
class BoardOption {

    /**
     * コンストラクタ
     * @param {int} canvasWidth - キャンバス幅
     * @param {int} canvasHeight - キャンバス高
     * @param {int} boardSize - 盤の大きさ
     */
    constructor(canvasWidth, canvasHeight, boardSize) {
        this.boardSize = boardSize;
        this.cellSize = this.boardSize / OX.SIZE;

        this.left = (canvasWidth - this.boardSize) / 2;
        this.top = (canvasHeight - this.boardSize) / 2;
        this.right = this.left + this.boardSize;
        this.bottom = this.top + this.boardSize;

        console.log(this.boardSize);
    }
}

/**
 * 描写用クラス
 *
 * @class Drawer
 */
class Drawer {

    /**
     *Creates an instance of Drawer.
     * @param {BoardOption} bo - 盤オプション
     * @memberof Drawer
     */
    constructor(bo) {
        this.sign_o = null;
        this.sign_x = null;
    }

    /**
     * boardOptionのセッタ
     * @param {BoardOption} bo - 盤オプション
     */
    setBoardOption(bo) {
        this.boardOption = bo;
    }

    /**
     * preload()関数用関数
     *
     * @memberof Drawer
     */
    preload() {
        this.sign_o = loadImage("img/o.png");
        this.sign_x = loadImage("img/x.png");
    }

    /**
     * 初期化関数
     *
     * @memberof Drawer
     */
    reset() {
        // createCanvas(bo.field.width, bo.field.height);
        background("green");
        this.grid();
    }

    /**
     * 格子を描写する関数
     *
     * @memberof Drawer
     */
    grid() {
        for (var i = 0; i < OX.SIZE + 1; i++) {
            line(this.boardOption.left, this.boardOption.top + this.boardOption.cellSize * i,
                this.boardOption.right, this.boardOption.top + this.boardOption.cellSize * i);
            line(this.boardOption.left + this.boardOption.cellSize * i, this.boardOption.top,
                this.boardOption.left + this.boardOption.cellSize * i, this.boardOption.bottom);
        }
    }

    /**
     * OXを描写するクラス
     *
     * @param {string} sign - OかXか
     * @param {number} x - 格子上でのx座標
     * @param {number} y - 格子上でのy座標
     * @memberof Drawer
     */
    sign(sign, x, y) {
        var img;
        switch (sign) {
            case 'o':
                img = this.sign_o;
                break;
            case 'x':
                img = this.sign_x;
                break;
        }
        image(
            img,
            this.boardOption.left + x * this.boardOption.cellSize,
            this.boardOption.top + y * this.boardOption.cellSize,
            this.boardOption.cellSize, this.boardOption.cellSize);
    }
}

/**
 * 座標管理クラス
 *
 * @class PositionManager
 */
class PositionManager {

    /**
     * コンストラクタ
     * 
     * @memberof PositionManager
     */
    constructor() {
        this.mousePos = null;
        this.pos = null;
    }

    /**
     * boardOptionのセッタ
     * @param {BoardOption} bo - 盤オプション
     */
    setBoardOption(bo) {
        this.boardOption = bo;
    }

    /**
     * マウス座標を取得する関数
     *
     * @memberof PositionManager
     */
    setMousePosition() {
        this.mousePos = {
            x: mouseX,
            y: mouseY
        };
        this.setPosition();
    }

    /**
     * マウス座標を格子座標に変換する関数
     *
     * @memberof PositionManager
     */
    setPosition() {
        this.pos = {
            x: this.correctPosition(Math.floor((this.mousePos.x - this.boardOption.left) / this.boardOption.cellSize)),
            y: this.correctPosition(Math.floor((this.mousePos.y - this.boardOption.top) / this.boardOption.cellSize))
        }
    }

    /**
     * 格子座標が範囲外だった場合に範囲内へ修正する関数
     *
     * @param {{x:number y:number}} pos - 格子座標
     * @returns {{x:number y:number}} 修正済み格子座標
     * @memberof PositionManager
     */
    correctPosition(pos) {
        if (pos < 0) pos = 0;
        else if (pos >= OX.SIZE) pos = OX.SIZE - 1;
        return pos;
    }
}