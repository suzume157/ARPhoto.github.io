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
            document.querySelectorAll(".screenshot-ignore");

        // UIを非表示
        for (const element of uiElements) {
            element.style.display = "none";
        }


        const video =
            document.querySelector("video");

        const arCanvas =
            this.scene.canvas;


        if (!video || !arCanvas) {
            this.showUI(uiElements);
            return;
        }


        // A-Frameを再描画
        this.scene.renderer.render(
            this.scene.object3D,
            this.scene.camera
        );


        // スマホ画面と同じサイズのCanvas
        const canvas =
            document.createElement("canvas");

        canvas.width =
            window.innerWidth;

        canvas.height =
            window.innerHeight;


        const ctx =
            canvas.getContext("2d");


        /*
        * カメラ映像
        */

        const videoAspect =
            video.videoWidth / video.videoHeight;

        const screenAspect =
            canvas.width / canvas.height;

        let videoWidth;
        let videoHeight;
        let videoX;
        let videoY;


        if (videoAspect > screenAspect) {

            videoHeight =
                canvas.height;

            videoWidth =
                videoHeight * videoAspect;

            videoX =
                (canvas.width - videoWidth) / 2;

            videoY = 0;

        } else {

            videoWidth =
                canvas.width;

            videoHeight =
                videoWidth / videoAspect;

            videoX = 0;

            videoY =
                (canvas.height - videoHeight) / 2;
        }


        ctx.drawImage(
            video,
            videoX,
            videoY,
            videoWidth,
            videoHeight
        );


        /*
        * ARモデル
        */

        const arRect =
            arCanvas.getBoundingClientRect();


        ctx.drawImage(
            arCanvas,
            0,
            0,
            arCanvas.width,
            arCanvas.height,
            arRect.left,
            arRect.top,
            arRect.width,
            arRect.height
        );


        // UIを再表示
        this.showUI(uiElements);


        /*
        * 保存
        */

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