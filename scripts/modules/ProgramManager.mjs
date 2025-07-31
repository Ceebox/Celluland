import { InputManager } from "./InputManager.mjs";
import { Renderer } from "./rendering/Renderer.mjs";
import { CellManager } from "./automata/CellManager.mjs";

export class ProgramManager {

    /**
     * @param {HTMLCanvasElement} canvas 
     * @param {Object} config
     * @param {string} script
     */
    constructor(canvas, config, script = "", initialState = []) {

        this._config = config;
        this._currentState = 1;

        this.applyConfig(config);
        this.#applySettingsToConfig();

        this._canvas = canvas;
        this._simulateNextFrame = true;

        this._pausedChangedCallbacks = new Map();

        // Right click keeps making context menus
        canvas.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });

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

        this._cellManager = new CellManager(rowCount, columnCount, script, initialState);
        this._inputManager = new InputManager(canvas, this._cellSize);
        this._renderer = new Renderer(canvas, this._cellSize);

        this.togglePause = this.togglePause.bind(this);
        this.runDebug = this.runDebug.bind(this);
        this.resetToInitialState = this.resetToInitialState.bind(this);

        this._inputManager.onKeyDown(" ", this.togglePause);
        this._inputManager.onKeyDown("`", this.runDebug);
        this._inputManager.onKeyDown("r", this.resetToInitialState)

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
        if (isMobile) {
            this._inputManager.onMouseButtonDown(0, this.toggleCell.bind(this));
            this._inputManager.onMouseButtonDownRepeat(0, this.toggleCell.bind(this));
        } else {
            this._inputManager.onMouseButtonDownRepeat(0, this.drawCell.bind(this));
            this._inputManager.onMouseButtonDownRepeat(2, this.removeCell.bind(this));
        }

        // Render an empty frame
        this._renderer.setCellInfo(this._cellManager.getCellInfo());
        this._renderer.render();

        this._animationFrameRequested = this._animationFrameRequested.bind(this);

        if (!this._paused) {
            this.start();
        }
    }

    onPauseChanged(obj, callback) {
        this._pausedChangedCallbacks.set(obj, callback);
    }

    offPauseChanged(obj) {
        this._pausedChangedCallbacks.delete(obj);
    }

    start() {
        this.setPause(false);
        requestAnimationFrame(this._animationFrameRequested);
    }

    pause() {
        this.setPause(true);
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

    isPaused() {
        return this._paused;
    }

    togglePause() {
        this.setPause(!this._paused);
        this._simulateNextFrame = !this._paused;
        if (!this._paused) {
            requestAnimationFrame(this._animationFrameRequested);
        }
    }

    /**
     * @param {boolean} value
     */
    setPause(value) {
        this._paused = value;
        for (const callback of this._pausedChangedCallbacks.values()) {
            callback();
        }
    }

    /**
     * @param {string} script
     */
    setScript(script) {
        this._cellManager.setScript(script);
    }

    runDebug() {
        this._spector.displayUI();

        // Render a frame first
        requestAnimationFrame(() => {
            this._renderer.render();
        });

        this._spector.captureCanvas(this._canvas)?.then((result) => {
            const resultView = new SPECTOR.ResultView(this._spector);
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
            this._cellManager.setCell(cell.getColumn(), cell.getRow(), this._currentState);
            this.render();
        }
    }

    toggleCell() {
        if (!this._editable) return;

        const mousePos = this._inputManager.getMousePosition();

        // Debounce to avoid flickering cell
        if (this._lastToggledCell &&
            this._lastToggledCell.x === mousePos.x &&
            this._lastToggledCell.y === mousePos.y) {
            return;
        }

        const cell = this._cellManager.getCell(mousePos.x, mousePos.y);
        if (cell) {
            // HACK: This should totally not do this yo, why does calling it again fix it?!?!
            const currentState = this._cellManager.getCell(cell.getColumn(), cell.getRow()).getState();
            if (currentState != 0) {
                this._cellManager.setCell(cell.getColumn(), cell.getRow(), 0);
            } else {
                this._cellManager.setCell(cell.getColumn(), cell.getRow(), this._currentState);
            }
            this.render();

            this._lastToggledCell = { x: mousePos.x, y: mousePos.y, time: Date.now() };
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

    getInitialState() {
        return this._cellManager.getInitialState();
    }

    resetToInitialState() {
        this._cellManager.setToInitialState();
        this.render();
    }

    resetGrid() {
        this._cellManager.resetPhase();
        this._cellManager.clearInitialState();
        this._cellManager.setToInitialState();
        this.render();
    }

    resizeGrid() {
        const rowCount = Math.floor(this._canvas.height / this._cellSize);
        const columnCount = Math.floor(this._canvas.width / this._cellSize);
        this._cellManager.resize(rowCount, columnCount);
        this.render();
    }

    applyConfig(newConfig) {
        const oldCellSize = this._cellSize;
        this._config = newConfig;

        if (this._paused === undefined) {
            this._paused = this._config.paused;
        }

        this._fps = this._config.fps !== undefined ? this._config.fps : 4;
        this._editable = this._config.editable !== undefined ? this._config.editable : false;
        this._cellSize = this._config.cellSize !== undefined ? this._config.cellSize : 8;

        if (this._cellSize !== oldCellSize) {
            // Stop this being called before we have everything
            if (!this._canvas) {
                return;
            }

            this._renderer.setCellSize(this._cellSize);
            this._inputManager.setCellSize(this._cellSize);
            this.resizeGrid();
        }
    }

    #applySettingsToConfig() {
        this._config.paused = this._paused;
        this._config.fps = this._fps;
        this._config.editable = this._editable;
        this._config.cellSize = this._cellSize;
    }
}