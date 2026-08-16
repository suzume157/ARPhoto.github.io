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

        //カメラから見える画像の取得
        const video =
            document.querySelector("video");
        //3Dモデルの画像を取得
        const arCanvas =
            this.scene.canvas;


        if (!video) {
            console.error("カメラ映像が見つかりません");
            this.showUI(uiElements);
            return;
        }

        if (!arCanvas) {
            console.error("A-FrameのCanvasが見つかりません");
            this.showUI(uiElements);
            return;
        }


        /*
         * A-FrameのWebGLを明示的に再描画
        */
        this.scene.renderer.render(
            this.scene.object3D,
            this.scene.camera
        );


        /*
         * 描画が完了してからCanvasを取得
        */
        requestAnimationFrame(() => {

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


            // AR Canvasの縦横比を維持
            const arAspect =
                arCanvas.width / arCanvas.height;

            const outputAspect =
                canvas.width / canvas.height;

            let drawWidth;
            let drawHeight;
            let drawX;
            let drawY;

            if (arAspect > outputAspect) {

                // AR Canvasの方が横長
                drawWidth = canvas.width;
                drawHeight = canvas.width / arAspect;

                drawX = 0;
                drawY = (canvas.height - drawHeight) / 2;

            } else {

                // AR Canvasの方が縦長
                drawHeight = canvas.height;
                drawWidth = canvas.height * arAspect;

                drawX = (canvas.width - drawWidth) / 2;
                drawY = 0;
            }


            // ARモデルを描画
            ctx.drawImage(
                arCanvas,
                drawX,
                drawY,
                drawWidth,
                drawHeight
            );


            /*
            * UIを再表示
             */
            this.showUI(uiElements);


            /*
            * PNGとして保存
            */
            const image =
                canvas.toDataURL("image/png");


            const link =
                document.createElement("a");

            link.href = image;

            link.download =
                `ar-screenshot-${Date.now()}.png`;

            link.click();

        });
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