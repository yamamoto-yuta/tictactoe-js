// NN
let nn;

// 使用するモデル
let model = model_01;

/**
 * セットアップ関数
 */
function setup() {
    nn = ml5.neuralNetwork(model.options, dataLoaded);
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
    nn.train(model.trainingOptions, whileTraining, finishedTraining);
}

function whileTraining(epoch, logs) {
    console.log(`Epoch: ${epoch} - loss: ${logs.loss.toFixed(2)}`);
}

function finishedTraining() {
    console.log('done!');

    // モデルを保存
    nn.save();
}