/**
 * ボタンスタイルクラス
 */
class ButtonStyle {
    /**
     * コンストラクタ
     * @param {string} name - スタイル名
     * @param {string} value - スタイル値
     */
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}

/**
 * スタイル指定ボタンを作成する関数
 * @param {string} name - ボタンの表示名
 * @param {int} x - ボタンの左上のx座標
 * @param {int} y - ボタンの左上のy座標
 * @param {int} wid - ボタンの幅
 * @param {int} hei - ボタンの高さ
 * @param {array[ButtonStyle]} style - ボタンのスタイル
 * @param {function} pressed - ボタンが押された時に呼び出される関数
 */
function createStyleButton(name, x, y, wid, hei, style, pressed) {
    var button = createButton(name);
    button.position(x, y);
    button.size(wid, hei);
    for (var i = 0; i < style.length; i++) {
        button.style(style[i].name, style[i].value);
    }
    button.mousePressed(pressed);
    return button;
}


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
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.boardSize = boardSize;
        this.cellSize = this.boardSize / OX.SIZE;

        this.left = (this.canvasWidth - this.boardSize) / 2;
        this.top = (this.canvasHeight - this.boardSize) / 2;
        this.right = this.left + this.boardSize;
        this.bottom = this.top + this.boardSize;
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

        this.btnResult = null;
    }

    /**
     * boardOptionのセッタ
     * @param {BoardOption} bo - 盤オプション
     */
    setBoardOption(bo) {
        this.boardOption = bo;
    }

    /**
     * preload()関数用メソッド
     *
     * @memberof Drawer
     */
    preload() {
        this.sign_o = loadImage("img/o.png");
        this.sign_x = loadImage("img/x.png");
    }

    /**
     * 初期化メソッド
     *
     * @memberof Drawer
     */
    reset() {
        clear();
        if (this.btnResult != null) {
            this.btnResult.remove();
        }

        background("green");
        this.grid();
    }

    /**
     * 格子を描写するメソッド
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
     * OXを描写するメソッド
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

    /**
     * 勝敗を描写するメソッド
     * @param {*} winner 
     */
    result(winner) {
        var text;
        var btnColor;
        switch (winner) {
            case OX.O_STR:
                text = "〇の勝ち！";
                btnColor = color(255, 0, 0, 255);
                break;

            case OX.X_STR:
                text = "×の勝ち！";
                btnColor = color(78, 103, 200, 255);
                break;

            case OX.E_STR:
                text = "引き分け！";
                btnColor = color(150, 150, 150, 255);
                break;
        }

        this.btnResult = createStyleButton(
            text,
            this.boardOption.left,
            this.boardOption.top - 150,
            this.boardOption.boardSize,
            100, [
                new ButtonStyle('font-family', "'Kosugi Maru', sans-serif"),
                new ButtonStyle('font-size', 30 + 'px'),
                new ButtonStyle('color', color(255, 255, 255, 255)),
                new ButtonStyle('background-color', btnColor)
            ],
            null
        );
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
     * マウス座標を取得するメソッド
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
     * マウス座標を格子座標に変換するメソッド
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
     * 格子座標が範囲外だった場合に範囲内へ修正するメソッド
     *
     * @param {{x:number y:number}} pos - 格子座標
     * @returns {{x:number y:number}} 修正済み格子座標
     * @memberof PositionManager
     */
    correctPosition(pos) {
        if (pos < 0 || pos >= OX.SIZE) {
            return null;
        } else {
            return pos;
        }
    }
}