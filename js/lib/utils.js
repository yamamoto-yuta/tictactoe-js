/**
 * 配列の合計を計算する関数
 *
 * @param {array[number]} arr - 配列
 * @returns - 配列の合計値
 */
const sum  = function(arr) {
    return arr.reduce(function(prev, current, i, arr) {
        return prev + current;
    });
};

/**
 * 指定した値が配列中に存在するかを判定する関数
 *
 * @param {array} arr - 配列
 * @param {*} val - 指定値
 * @returns 存在するかどうか
 */
function isExist(arr, val) {
    return (arr.indexOf(val) >= 0);
}

/**
 * 2次元座標を1次元座標に変換する関数
 *
 * @param {int} y - y座標
 * @param {int} x - x座標
 * @returns {int} 1次元座標
 */
function conv2dto1d(y, x) {
    return y * OX.SIZE + x;
}

/**
 * 1次元座標を2次元座標に変換する関数
 *
 * @param {int} idx - 1次元座標
 * @returns x座標, y座標
 */
function conv1dto2d(idx) {
    return {y:Math.floor(idx / OX.SIZE), x: idx % OX.SIZE};
}

/**
 * 乱数を生成する関数
 *
 * @param {number} min - 最小値
 * @param {number} max - 最大値
 * @returns {number} 乱数
 */
function randbetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
