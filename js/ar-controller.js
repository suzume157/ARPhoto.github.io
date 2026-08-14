const ARModelController = {

    // 現在のスケール
    scale: 1.0,

    // 最小スケール
    minScale: 0.1,

    // 最大スケール
    maxScale: 5.0,


    /**
     * 初期化
     */
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


    /**
     * モデルのスケールを更新
     */
    updateModelScale() {

        this.model.setAttribute("scale",`${this.scale} ${this.scale} ${this.scale}`);
        this.scaleValue.textContent =`${Math.round(this.scale * 100)}%`;
    }
};

const ScreenshotController = {

    init() {
        this.button = document.getElementById("screenshot-button");
        this.scene = document.querySelector("a-scene");
        this.button.addEventListener("click", () => {
            this.capture();
        });
    },


    capture() {

    const viewport =
        document.querySelector('meta[name="viewport"]');

    // 元のviewportを保存
    const originalViewport =
        viewport.getAttribute("content");

    // 一時的に固定幅にする
    viewport.setAttribute(
        "content",
        "width=800"
    );


    html2canvas(document.body, {

        width: window.innerWidth,
        height: window.innerHeight,

        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,

        useCORS: true,

        scale: 1,

        backgroundColor: null

    })
    .then((canvas) => {

        // viewportを元に戻す
        viewport.setAttribute(
            "content",
            originalViewport
        );


        const image =
            canvas.toDataURL("image/png");


        const link =
            document.createElement("a");

        link.href = image;

        link.download =
            `ar-screenshot-${Date.now()}.png`;

        link.click();

    })
    .catch((error) => {

        // エラーでもviewportを元に戻す
        viewport.setAttribute(
            "content",
            originalViewport
        );

        console.error(
            "スクリーンショット失敗:",
            error
        );

    });
}
};

/**
 * ページ読み込み後に初期化
 */
window.addEventListener("DOMContentLoaded", () => {
    ARModelController.init();
    ScreenshotController.init();
});