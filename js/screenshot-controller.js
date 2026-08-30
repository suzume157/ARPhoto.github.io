const ScreenshotController = {

    init() {
        this.button = document.getElementById("screenshot-button");
        this.scene = document.querySelector("a-scene");

        this.button.addEventListener("click", () => {
            this.capture();
        });
    },

    capture() {
        const uiElements = document.querySelectorAll(".screenshot-ignore");

        // UIを非表示
        for (const element of uiElements) {
            element.style.display = "none";
        }

        const video = document.querySelector("video");
        const arCanvas = this.scene.canvas;

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
        const canvas = document.createElement("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext("2d");

        // カメラ映像の比率
        const videoAspect = video.videoWidth / video.videoHeight;
        const screenAspect = canvas.width / canvas.height;

        let videoWidth;
        let videoHeight;
        let videoX;
        let videoY;

        // 画面と同じ見え方になるようにカメラ映像を配置
        if (videoAspect > screenAspect) {
            videoHeight = canvas.height;
            videoWidth = videoHeight * videoAspect;
            videoX = (canvas.width - videoWidth) / 2;
            videoY = 0;
        } else {
            videoWidth = canvas.width;
            videoHeight = videoWidth / videoAspect;
            videoX = 0;
            videoY = (canvas.height - videoHeight) / 2;
        }

        // ① カメラ映像
        ctx.drawImage(
            video,
            videoX,
            videoY,
            videoWidth,
            videoHeight
        );

        // ② AR Canvas
        const arRect = arCanvas.getBoundingClientRect();

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

        // 画像を生成
        canvas.toBlob((blob) => {

            if (!blob) {
                return;
            }

            this.saveImage(blob);

        }, "image/png");
    },

    saveImage(blob) {

        const fileName = `ar-screenshot-${Date.now()}.png`;

        // iPhone / iPad
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {

            const file = new File(
                [blob],
                fileName,
                { type: "image/png" }
            );

            // Web Share API
            if (
                navigator.share &&
                navigator.canShare &&
                navigator.canShare({ files: [file] })
            ) {

                navigator.share({
                    files: [file]
                }).catch(function(error) {

                    if (error.name !== "AbortError") {
                        console.error("共有に失敗しました:", error);
                    }

                });

            } else {
                console.error(
                    "このiPhoneではWeb Share APIが利用できません"
                );
            }

            return;
        }

        // Android
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = fileName;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        setTimeout(function() {
            URL.revokeObjectURL(url);
        }, 1000);
    },

    // UIを再表示
    showUI(uiElements) {

        for (const element of uiElements) {
            element.style.display = "";
        }
    }
};

// ページ読み込み後に初期化
window.addEventListener("DOMContentLoaded", () => {
    ScreenshotController.init();
});