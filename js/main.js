const env = new TictactoeEnv();

let bo;
let dw = new Drawer();
let pm = new PositionManager();
let cpu = new Cpu(env.board, OX.X_NUM);

let btnReset;

let isOver = false;

function preload() {
    env.reset();
    dw.preload();
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    bo = new BoardOption(width, height, 500);
    dw.setBoardOption(bo);
    pm.setBoardOption(bo);

    dw.reset();

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

    _cpuTurn();
}

function _reset() {

    isOver = false;
    env.reset();

    dw.reset();

    _cpuTurn();
}

function _cpuTurn() {
    cpu.board = env.board;
    var cpuPutPos = cpu.put();
    dw.sign(OX.btos(env.current_player), cpuPutPos.x, cpuPutPos.y);
    return env.changeTurn();
}

function mouseClicked() {
    pm.setMousePosition();
    if (!isOver && (pm.pos.x != null && pm.pos.y != null) && env.put(conv2dto1d(pm.pos.y, pm.pos.x))) {
        dw.sign(OX.btos(env.current_player), pm.pos.x, pm.pos.y);
        var result = env.changeTurn();
        isOver = result["isOver"];
        if (isOver) {
            dw.result(result["winner"]);
            return
        }

        result = _cpuTurn();
        isOver = result["isOver"];
        if (isOver) {
            dw.result(result["winner"]);
            return
        }
    }
}