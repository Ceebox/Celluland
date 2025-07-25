import { InputManager } from "./InputManager.mjs";
import { Renderer } from "./rendering/Renderer.mjs";

export class ProgramManager {

    /**
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        this._paused = true;
        this._fps = 4;
        this._canvas = canvas;

        // I'm doing most of this offline, we probably don't have spector
        if (typeof SPECTOR === "undefined") {
            console.warn("SPECTOR has not been loaded correctly.");
        } else {
            this._spector = new SPECTOR.Spector();
            this._spector.spyCanvases();
        }

        this._inputManager = new InputManager(canvas);
        this._renderer = new Renderer(canvas);

        // Produce the first frame (even though we are paused)
        this._renderer.render();

        this.handlePause = this.handlePause.bind(this);
        this.handleDebug = this.handleDebug.bind(this);
        this._animationFrameRequested = this._animationFrameRequested.bind(this);

        window.addEventListener("keydown", (event) => {
            this.handlePause(event);
            this.handleDebug(event);
        });
    }

    start() {
        this._paused = false;
        requestAnimationFrame(this._animationFrameRequested);
    }

    pause() {
        this._paused = true;
    }

    render() {
        this._renderer.render();
    }

    _animationFrameRequested(timestamp) {
        this.render();

        if (this._paused) {
            return;
        }

        setTimeout(
            () => {
                requestAnimationFrame(this._animationFrameRequested);
            },
            1000 / this._fps
        );
    }

    handlePause(event) {
        if (event.key === " ") {
            this._paused = !this._paused;
            if (!this._paused) {
                requestAnimationFrame(this._animationFrameRequested);
            }
        }
    }

    handleDebug(event) {
        if (event.key !== "/") {
            return;
        }

        this._spector.displayUI();

        // Render a frame first
        requestAnimationFrame(() => {
            this._renderer.render();
        });

        this._spector.captureCanvas(this._canvas).then((result) => {
            const resultView = new SPECTOR.ResultView(spector);
            resultView.display(result);
            this._spector.hideUI();
        }).catch((error) => {
            console.error("Failed to capture canvas:", error);
        });
    }
}