import { Renderer } from "./modules/rendering/Renderer.mjs";

const FPS = 4;
let renderer = undefined;

function run() {
    let canvas = document.getElementById("canvas");
    if (!canvas) {
        console.error("Canvas element not found.");
        return;
    }

    renderer = new Renderer(canvas);

    window.addEventListener("keydown", (key) => {

        // I'm making this mostly offline, we're probably not going to have this    
        if (typeof SPECTOR === "undefined") {
            console.error("SPECTOR has not been loaded correctly.");
            return;
        }

        if (key.key !== "/") {
            return;
        }

        const spector = new SPECTOR.Spector();
        spector.spyCanvases();
        spector.displayUI();

        renderer.render();

        // Capture from canvas:
        spector.captureCanvas(canvas).then((result) => {
            const resultView = new SPECTOR.ResultView(spector);
            resultView.display(result); // show the capture result
        });
    });

    requestAnimationFrame(() => animationFrameRequested());
}

window.addEventListener("load", function () {
    run();
});

function animationFrameRequested(timestamp) {
    renderer.render();

    setTimeout(() => {
            requestAnimationFrame(() => animationFrameRequested());
        }, 
        1000 / FPS
    );
}