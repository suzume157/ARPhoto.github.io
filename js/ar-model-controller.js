const ARModelController = {
    // 現在のスケール
    scale: 1.0,
    // 最小スケール
    minScale: 0.1,
    // 最大スケール
    maxScale: 5.0,

    //初期化
    init() {

        this.model = document.getElementById("ar-model");
        this.slider = document.getElementById("scale-slider");
        this.scaleValue = document.getElementById("scale-value");

        // スライダー操作
        this.slider.addEventListener("input", () => {

            this.scale = Number(this.slider.value);
            this.updateModelScale();
        });

        this.updateModelScale();
    },

    //モデルのスケール変更
    updateModelScale() {

        this.model.setAttribute("scale",`${this.scale} ${this.scale} ${this.scale}`);
        this.scaleValue.textContent =`${Math.round(this.scale * 100)}%`;
    }
};

//ページ読み込み後に初期化
window.addEventListener("DOMContentLoaded", () => {ARModelController.init();});