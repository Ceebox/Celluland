import { Renderer } from "./modules/rendering/Renderer.mjs";

function run() {
    let canvas = document.getElementById("canvas");
    if (!canvas) {
        console.error("Canvas element not found.");
        return;
    }

    let renderer = new Renderer(canvas);

    window.addEventListener("keydown", (key) => {

        // I'm making this mostly offline, we're probably not going to have this    
        if (typeof SPECTOR === "undefined") {
            console.error("SPECTOR has not been loaded correctly.");
            return;
        }

        if(key.key !== "/") {
            return;
        }

        const spector = new SPECTOR.Spector();
        const result = spector.captureCanvas(canvas);
        console.log(result);
    });
}

window.addEventListener("load", function () {
    run();
});