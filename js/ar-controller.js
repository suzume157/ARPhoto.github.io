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

        this.button =
            document.getElementById("screenshot-button");

        this.scene =
            document.querySelector("a-scene");


        this.button.addEventListener(
            "click",
            () => {

                this.capture();

            }
        );
    },


    capture() {

        const uiElements =
            document.querySelectorAll(
                ".screenshot-ignore"
            );


        // UIを非表示
        for (const element of uiElements) {

            element.style.display = "none";

        }


        const video =
            document.querySelector("video");

        const arCanvas =
            this.scene.canvas;


        if (!video) {

            console.error(
                "カメラ映像が見つかりません"
            );

            this.showUI(uiElements);

            return;
        }


        if (!arCanvas) {

            console.error(
                "A-FrameのCanvasが見つかりません"
            );

            this.showUI(uiElements);

            return;
        }


        // 出力Canvas
        const canvas =
            document.createElement("canvas");


        canvas.width =
            video.videoWidth;

        canvas.height =
            video.videoHeight;


        const ctx =
            canvas.getContext("2d");


        // カメラ映像を描画
        ctx.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );


        // ARモデルを描画
        ctx.drawImage(
            arCanvas,
            0,
            0,
            canvas.width,
            canvas.height
        );


        // UIを再表示
        this.showUI(uiElements);


        // PNGとして保存
        const image =
            canvas.toDataURL("image/png");


        const link =
            document.createElement("a");


        link.href = image;

        link.download =
            `ar-screenshot-${Date.now()}.png`;


        link.click();
    },


    showUI(uiElements) {

        for (const element of uiElements) {

            element.style.display = "";

        }
    }
};

/**
 * ページ読み込み後に初期化
 */
window.addEventListener("DOMContentLoaded", () => {
    ARModelController.init();
    ScreenshotController.init();
});