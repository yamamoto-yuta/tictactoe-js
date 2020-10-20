// OXゲーム環境
const env = new TictactoeEnv();

// 盤オプション
let bo;
// 描写用クラス
let dw = new Drawer();
// 座標管理クラス
let pm = new PositionManager();
// CPUクラス
let cpu = new Cpu(env.board, OX.X_NUM);

// リセットボタン
let btnReset;

// NN
let nn;

// ゲームが終了したかどうか
let isOver = false;

/**
 * setup()より先に呼ばれる関数
 */
function preload() {
    env.reset();
    dw.preload();
}

/**
 * セットアップ関数
 */
function setup() {
    // キャンバスを描写
    _initView();

    // NNの初期設定
    let options = {
        task: 'classification',
        debug: true
    }
    nn = ml5.neuralNetwork(options);

    // 学習済みモデルを読み込み
    const modelDetails = {
        model: 'js/model/model.json',
        metadata: 'js/model/model_meta.json',
        weights: 'js/model/model.weights.bin'
    }
    nn.load(modelDetails, modelReady);
}

/**
 * キャンバスを描写する関数
 */
function _initView() {
    // キャンバスを作成
    createCanvas(windowWidth, windowHeight);

    // 盤オプションをインスタンス化
    bo = new BoardOption(width, height, 500);
    dw.setBoardOption(bo);
    pm.setBoardOption(bo);

    // 盤を描写
    dw.reset();
    // リセットボタンを設置
    btnReset = createStyleButton(
        "リセット",
        bo.left,
        bo.bottom + 50,
        200,
        50, [
            new ButtonStyle('font-family', "'Kosugi Maru', sans-serif"),
            new ButtonStyle('font-size', 24 + 'px'),
            new ButtonStyle('color', color(255, 255, 255, 255)),
            new ButtonStyle('background-color', color(255, 0, 0, 255)),
            new ButtonStyle('border-radius', 100 + 'px')
        ],
        _reset
    );
}

/**
 * リセット関数
 */
function _reset() {
    // 勝敗をリセット
    isOver = false;
    // ゲーム環境をリセット
    env.reset();
    // 盤を再描写
    dw.reset();

    // CPU先行
    _cpuTurn(true);
}

/**
 * モデル読み込み後の処理を行う関数
 */
function modelReady() {
    // CPU先行
    _cpuTurn(true);
}

// function mouseClicked() {
//     pm.setMousePosition();
//     if (!isOver && (pm.pos.x != null && pm.pos.y != null) && env.put(conv2dto1d(pm.pos.y, pm.pos.x))) {
//         dw.sign(OX.btos(env.current_player), pm.pos.x, pm.pos.y);
//         var result = env.changeTurn();
//         isOver = result["isOver"];
//         if (isOver) {
//             dw.result(result["winner"]);
//             return
//         }

//         result = _cpuTurn(false);
//         isOver = result["isOver"];
//         if (isOver) {
//             dw.result(result["winner"]);
//             return
//         }
//     }
// }

/**
 * タッチ入力時に呼ばれる関数
 */
function touchEnded() {
    // タッチ座標を格子座標に変換して取得
    pm.setMousePosition();

    if (!isOver && (pm.pos.x != null && pm.pos.y != null) && env.put(conv2dto1d(pm.pos.y, pm.pos.x))) {
        // プレーヤの駒を置く
        dw.sign(OX.btos(env.current_player), pm.pos.x, pm.pos.y);
        // ターン交代
        var result = env.changeTurn();
        // 勝敗が付いていたら勝敗を表示
        isOver = result["isOver"];
        if (isOver) {
            dw.result(result["winner"]);
            return
        }

        // CPUのターン
        _cpuTurn(false);
    }
}

// カウンタ
let _cnt;
// バックアップ用変数
let _backupSign;
// 置ける座標リスト
let _canPut;
// 盤情報へグローバルにアクセスするための変数
let _board;
// NNの計算結果を格納するための配列
let _prob = [];

/**
 * CPUのターンを制御する関数
 * 
 * @param {bool} isFirst 最初の一手かどうか
 */
function _cpuTurn(isFirst) {
    // 置ける座標を取得
    cpu.board = env.board;
    _canPut = cpu.put();

    // 置ける座標を１つずつ試行して，NNで勝率を計算
    _cnt = 0;
    _prob = [];
    if (isFirst) {
        // 最初の一手はランダムに決める
        _putCpu(cpu.board, randbetween(0, 8));
    } else {
        // それ以外はNNを利用
        classify(cpu.board, _cnt);
    }
}

/**
 * 勝敗を計算
 * @param {array[int]} board - 盤情報
 * @param {int} cnt - 置ける座標リストの添え字
 */
function classify(board, cnt) {
    // 盤情報のアドレスをグローバル変数に渡す
    _board = board;
    // 駒を置く
    _backupSign = board[_canPut[cnt]];
    board[_canPut[cnt]] = cpu.sign;

    // NNで勝率を計算
    var input = [];
    for (var i = 0; i < board.length; i++) {
        input.push(OX.itos(board[i]));
    }
    nn.classify(input, handleResults);
}

/**
 * NNの結果を取得する関数
 * @param {} error - エラー
 * @param {*} result - NNの計算結果
 */
function handleResults(error, result) {
    if (error) {
        console.error(error);
        return;
    }
    // NNの計算結果を格納
    _prob.push(result);
    // 盤を元の状態に戻す
    _board[_canPut[_cnt]] = _backupSign

    if (++_cnt < _canPut.length) {
        // 次の試行へ
        classify(_board, _cnt);
    } else {
        // 最適行動の選択へ
        _decidePos(_board, _prob);
    }
}

/**
 * CPUの駒を置く場所を決定する関数
 * @param {*} board 
 * @param {*} result 
 */
function _decidePos(board, result) {
    // NNの計算結果からCPUが勝つ確率と引き分けになる確率を抽出
    var probCpuWin = [];
    var probDraw = []
    for (var i = 0; i < result.length; i++) {
        for (var j = 0; j < OX.SIZE; j++) {
            if (result[i][j]['label'] == OX.itos(cpu.sign) + "win") {
                probCpuWin.push(result[i][j]['confidence']);
            }
            if (result[i][j]['label'] == "draw") {
                probDraw.push(result[i][j]['confidence']);
            }
        }
    }

    // 駒を置く
    _putCpu(board, _canPut[probCpuWin.indexOf(Math.max.apply(null, probCpuWin))]); // CPUが一番勝てる確率の高い手を選択
}

/**
 * 実際にCPUの駒を置く関数
 * 
 * @param {*} board - 盤情報
 * @param {int} putPos - 駒を置く場所
 */
function _putCpu(board, putPos) {
    // 駒を置く
    board[putPos] = cpu.sign;
    var cpuPutPos = conv1dto2d(putPos);
    dw.sign(OX.btos(env.current_player), cpuPutPos.x, cpuPutPos.y);

    // ターン交代
    var result = env.changeTurn();
    // 勝敗が付いていたら勝敗を表示
    isOver = result["isOver"];
    if (isOver) {
        dw.result(result["winner"]);
    }
}