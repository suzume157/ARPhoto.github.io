const ARModelController = {

    // 現在のスケール
    scale: 1.0,

    // 最小スケール
    minScale: 0.1,

    // 最大スケール
    maxScale: 5.0,

    // 変更量
    scaleStep: 0.1,


    /**
     * 初期化
     */
    init() {

        this.model = document.getElementById("ar-model");
        this.scaleValue = document.getElementById("scale-value");

        document
            .getElementById("scale-up")
            .addEventListener("click", () => {
                this.changeScale(this.scaleStep);
            });

        document
            .getElementById("scale-down")
            .addEventListener("click", () => {
                this.changeScale(-this.scaleStep);
            });

        this.updateModelScale();
    },


    /**
     * モデルのスケールを変更
     */
    changeScale(amount) {

        this.scale += amount;

        // 範囲制限
        this.scale = Math.max(
            this.minScale,
            Math.min(this.scale, this.maxScale)
        );

        this.updateModelScale();
    },


    /**
     * モデルにスケールを反映
     */
    updateModelScale() {

        this.model.setAttribute(
            "scale",
            `${this.scale} ${this.scale} ${this.scale}`
        );

        this.scaleValue.textContent =
            `${Math.round(this.scale * 100)}%`;
    }
};


/*
 * ページ読み込み後に初期化
 */
window.addEventListener("DOMContentLoaded", () => {

    ARModelController.init();

});