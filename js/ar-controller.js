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

        this.button.addEventListener("click", () => {

            this.capture();

        });
    },


    capture() {

        const video =
            document.querySelector("video");

        if (!video) {

            console.error(
                "カメラ映像が見つかりません"
            );

            return;
        }


        /*
         * カメラ映像をCanvasにコピー
         */
        const canvas =
            document.createElement("canvas");

        const ctx =
            canvas.getContext("2d");


        canvas.width =
            video.videoWidth;

        canvas.height =
            video.videoHeight;


        ctx.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );


        /*
         * カメラ映像をvideoの背景に設定
         */
        video.style.backgroundImage =
            `url(${canvas.toDataURL("image/png")})`;

        video.style.backgroundSize =
            "cover";


        /*
         * A-Frameを再描画
         */
        this.scene.renderer.render(
            this.scene.object3D,
            this.scene.camera
        );


        /*
         * HTML全体をスクリーンショット
         */
        html2canvas(document.body, {

            width:
                document.documentElement.offsetWidth,

            height:
                document.documentElement.offsetHeight,

            useCORS: true

        }).then((resultCanvas) => {


            /*
             * PNGに変換
             */
            const image =
                resultCanvas.toDataURL(
                    "image/png"
                );


            /*
             * 保存
             */
            const link =
                document.createElement("a");

            link.href = image;

            link.download =
                "ar-screenshot.png";

            link.click();

        }).catch((error) => {

            console.error(
                "スクリーンショットに失敗しました:",
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