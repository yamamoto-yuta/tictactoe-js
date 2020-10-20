// NN
let nn;

/**
 * セットアップ関数
 */
function setup() {
    // NNの初期設定
    let options = {
        dataUrl: "data/tictactoe_custom.csv",
        inputs: ['tl', 'tm', 'tr', 'ml', 'mm', 'mr', 'bl', 'bm', 'br'],
        outputs: ['result'],
        task: 'classification',
        debug: true
    }

    nn = ml5.neuralNetwork(options, dataLoaded);
}

/**
 * データ前処理用関数
 */
function dataLoaded() {
    nn.normalizeData();
    trainModel();
}


/**
 * 学習用関数
 */
function trainModel() {
    const trainingOptions = {
        epochs: 64,
        batchSize: 100
    }
    nn.train(trainingOptions, whileTraining, finishedTraining);
}

function whileTraining(epoch, logs) {
    console.log(`Epoch: ${epoch} - loss: ${logs.loss.toFixed(2)}`);
}

function finishedTraining() {
    console.log('done!');

    // モデルを保存
    nn.save();
}