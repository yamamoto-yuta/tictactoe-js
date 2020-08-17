
const env = new TictactoeEnv();

const bo = new BoardOption();
const dw = new Drawer(bo);
const pm = new PositionManager(bo);
const cpu = new Cpu(env.board, OX.X_NUM);

let btnCell = [];

function preload() {
    env.reset();
    dw.preload();
}

function setup() {
    dw.reset();

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
