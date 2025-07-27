import { InputManager } from "./InputManager.mjs";
import { Renderer } from "./rendering/Renderer.mjs";
import { CellManager } from "./automata/CellManager.mjs";

export class ProgramManager {

    /**
     * @param {HTMLCanvasElement} canvas 
     * @param {Object} config
     */
    constructor(canvas, config) {

        this._paused = config.paused !== undefined ? config.paused : true;
        this._fps = config.fps !== undefined ? config.fps : 4;
        this._editable = config.editable !== undefined ? config.editable : false;
        this._cellSize = config.cellSize !== undefined ? config.cellSize : 8;

        this._canvas = canvas;
        this._simulateNextFrame = true;

        // I'm doing most of this offline, we probably don't have spector
        this._isDebug = typeof SPECTOR !== "undefined";
        if (this._isDebug) {
            this._spector = new SPECTOR.Spector();
            this._spector.spyCanvases();
        } else {
            this._spector = null;
            if (window.location.href.indexOf("ceebox") !== -1 || window.location.href.indexOf("127.0.0.1") !== -1) {
                console.warn("SPECTOR has not been loaded correctly.");
            }
        }

        const rowCount = Math.floor(canvas.height / this._cellSize);
        const columnCount = Math.floor(canvas.width / this._cellSize);

        this._cellManager = new CellManager(rowCount, columnCount);
        this._inputManager = new InputManager(canvas, this._cellSize);
        this._renderer = new Renderer(canvas, this._cellSize);

        this.togglePause = this.togglePause.bind(this);
        this.runDebug = this.runDebug.bind(this);
        this.drawCell = this.drawCell.bind(this);
        this.removeCell = this.removeCell.bind(this);

        this._inputManager.onKeyDown(" ", this.togglePause);
        this._inputManager.onKeyDown("/", this.runDebug);
        this._inputManager.onMouseButtonDownRepeat(0, this.drawCell);
        this._inputManager.onMouseButtonDownRepeat(2, this.removeCell);

        // Render an empty frame
        this._renderer.setCellInfo(this._cellManager.getCellInfo());
        this._renderer.render();

        this._animationFrameRequested = this._animationFrameRequested.bind(this);

        if (!this._paused) {
            this.start();
        }
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

        this.#updateCore();
    }

    #updateCore() {
        if (this._simulateNextFrame) {
            this._cellManager.updateCells();
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

    togglePause() {
        this._paused = !this._paused;
        this._simulateNextFrame = !this._paused;
        if (!this._paused) {
            requestAnimationFrame(this._animationFrameRequested);
        }
    }

    runDebug() {
        this._spector.displayUI();

        // Render a frame first
        requestAnimationFrame(() => {
            this._renderer.render();
        });

        this._spector.captureCanvas(this._canvas)?.then((result) => {
            const resultView = new SPECTOR.ResultView(spector);
            resultView.display(result);
            this._spector.hideUI();
        }).catch((error) => {
            console.error("Failed to capture canvas:", error);
        });
    }

    drawCell() {
        if (!this._editable) {
            return;
        }

        const mousePos = this._inputManager._mousePosition;
        const cell = this._cellManager.getCell(mousePos.x, mousePos.y);
        if (cell) {
            this._cellManager.setCell(cell.getColumn(), cell.getRow(), 1);
            this.render();
        }
    }

    removeCell() {
        if (!this._editable) {
            return;
        }

        const mousePos = this._inputManager._mousePosition;
        const cell = this._cellManager.getCell(mousePos.x, mousePos.y);
        if (cell) {
            this._cellManager.setCell(cell.getColumn(), cell.getRow(), 0);
            this.render();
        }
    }
}