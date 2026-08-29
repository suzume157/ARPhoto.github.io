const ModelSwitcher = {
    currentModel: 0,

    models: [
        "./models/dinkstrong.glb",
        "./models/mao1.glb",
        "./models/mao2.glb",
        "./models/mao3.glb"
    ],

    init(){
        this.model = document.getElementById("ar-model");
        this.button = document.getElementById("model-switch-button");
        this.button.addEventListener("click",() => {
                this.switchModel();
            }
        );
    },

    switchModel(){
        this.currentModel++;

        if (this.currentModel >= this.models.length) {
            this.currentModel = 0;
        }

        this.model.setAttribute("gltf-model",this.models[this.currentModel]);
    }
};

window.addEventListener("DOMContentLoaded",() => {ModelSwitcher.init();});