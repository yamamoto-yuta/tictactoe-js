const env = new TictactoeEnv();

let bo;
let dw = new Drawer();
let pm = new PositionManager();
let cpu = new Cpu(env.board, OX.X_NUM);

let btnReset;

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
        bo.top - 100,
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
    console.log('_reset')
}

function _cpuTurn() {
    cpu.board = env.board;
    var cpuPutPos = cpu.put();
    dw.sign(OX.btos(env.current_player), cpuPutPos.x, cpuPutPos.y);
    env.changeTurn();
}

function mouseClicked() {
    pm.setMousePosition();
    if (pm.pos.x == null || pm.pos.y == null) {
        alert("そこには置けません！");
    } else if (env.put(conv2dto1d(pm.pos.y, pm.pos.x))) {
        dw.sign(OX.btos(env.current_player), pm.pos.x, pm.pos.y);
        env.changeTurn();

        _cpuTurn();
    }
}