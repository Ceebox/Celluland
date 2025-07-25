import { Renderer } from "./modules/rendering/Renderer.mjs";

const FPS = 4;
let paused = true;
let renderer = undefined;

function run() {
    let canvas = document.getElementById("canvas");
    if (!canvas) {
        console.error("Canvas element not found.");
        return;
    }

    // Produce the first frame (even though we are paused)
    renderer = new Renderer(canvas);
    renderer.render();

    window.addEventListener("keydown", (key) => {

        handlePause(key);
        handleDebug(key);
    });

    requestAnimationFrame(() => animationFrameRequested());
}

window.addEventListener("load", function () {
    run();
});

function animationFrameRequested(timestamp) {

    if (paused) {
        return;
    }

    renderer.render();

    setTimeout(() => {
        requestAnimationFrame(() => animationFrameRequested());
    },
        1000 / FPS
    );
}

function handlePause(key) {
    if (key.key === " ") {
        paused = !paused;
        if (!paused) {
            requestAnimationFrame(() => animationFrameRequested());
        }
    }
}

function handleDebug(key) {

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

    // NOTE: We have to render a frame to capture anything
    renderer.render();

    // Capture from canvas:
    spector.captureCanvas(canvas).then((result) => {
        const resultView = new SPECTOR.ResultView(spector);
        resultView.display(result); // show the capture result
    });
}