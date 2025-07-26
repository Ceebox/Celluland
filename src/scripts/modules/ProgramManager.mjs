import { InputManager } from "./InputManager.mjs";
import { Renderer } from "./rendering/Renderer.mjs";
import { CellManager } from "./automata/CellManager.mjs";

export class ProgramManager {

    /**
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {

        const CELL_SIZE = 8;

        this._paused = true;
        this._fps = 4;
        this._canvas = canvas;
        this._simulateNextFrame = true;

        // I'm doing most of this offline, we probably don't have spector
        if (typeof SPECTOR === "undefined") {
            console.warn("SPECTOR has not been loaded correctly.");
        } else {
            this._spector = new SPECTOR.Spector();
            this._spector.spyCanvases();
        }

        const rowCount = Math.floor(canvas.height / CELL_SIZE);
        const columnCount = Math.floor(canvas.width / CELL_SIZE);

        this._cellManager = new CellManager(rowCount, columnCount);
        this._inputManager = new InputManager(canvas);
        this._renderer = new Renderer(canvas);

        // Produce the first frame (even though we are paused)
        this._renderer.setCellInfo(this._cellManager.getCellInfo());
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

    update() {
        if (this._paused) {
            return;
        }

        if (this._simulateNextFrame) {
            this._cellManager.updateCells();
            this._cellManager.getCellInfo().forEach(row => {
                row.forEach(cell => cell.simulate());
            });
        }

        this._renderer.setCellInfo(this._cellManager.getCellInfo());
    }

    _animationFrameRequested(timestamp) {
        this.update();
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
            this._simulateNextFrame = this._paused;
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