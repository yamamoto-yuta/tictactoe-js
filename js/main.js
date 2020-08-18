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

    console.log(bo);

    dw.reset();

    // btnReset = createButton("Hello");
    // btnReset.position(19, 19);

    cpu.board = env.board;
    var cpuPutPos = cpu.put();
    dw.sign(OX.btos(env.current_player), cpuPutPos.x, cpuPutPos.y);
    env.changeTurn();

    console.log(env.board);
}

function mouseClicked() {
    pm.setMousePosition();
    if (env.put(conv2dto1d(pm.pos.y, pm.pos.x))) {
        dw.sign(OX.btos(env.current_player), pm.pos.x, pm.pos.y);
        env.changeTurn();

        cpu.board = env.board;
        var cpuPutPos = cpu.put();
        dw.sign(OX.btos(env.current_player), cpuPutPos.x, cpuPutPos.y);
        env.changeTurn();

        console.log(env.board);
    }
}