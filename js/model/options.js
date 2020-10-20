/**
 * モデル
 * 
 * @class
 */
class Model {

    /**
     * コンストラクタ
     * @memberof Model
     */
    constructor() {
        this.options = {
            dataUrl: "data/tictactoe_custom.csv",
            inputs: ['tl', 'tm', 'tr', 'ml', 'mm', 'mr', 'bl', 'bm', 'br'],
            outputs: ['result'],
            task: 'classification',
            debug: true
        }

        this.trainingOptions = null;
    }

    /**
     * レイヤを設定するメソッド
     * @param {array} layers - レイヤ
     */
    addLayers(layers) {
        this.options.layers = layers;
    }

    /**
     * 学習条件を設定するメソッド
     * @param {dict} trainingOptions 
     */
    setTrainingOptions(trainingOptions) {
        this.trainingOptions = trainingOptions;
    }
}

// デフォルトモデル
let model_default = new Model();
model_default.setTrainingOptions({
    epochs: 64,
    batchSize: 100
});

// モデルその１
let model_01 = new Model();
model_01.addLayers([{
        type: 'dense',
        units: 32,
        activation: 'relu'
    },
    {
        type: 'dense',
        units: 32,
        activation: 'relu'
    },
    {
        type: 'dense',
        units: 3,
        activation: 'softmax'
    }
]);
model_01.setTrainingOptions({
    epochs: 128,
    batchSize: 100
});