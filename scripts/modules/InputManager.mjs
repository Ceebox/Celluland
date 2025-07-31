export class InputManager {

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {number} cellSize
     */
    constructor(canvas, cellSize) {
        this._keys = new Set();
        this._mouseButtons = new Set();
        this._mousePosition = { x: 0, y: 0 };
        this._canvas = canvas;
        this._cellSize = cellSize;

        this._keyDownCallbacks = new Map();
        this._mouseDownCallbacks = new Map();
        this._mouseDownRepeatCallbacks = new Map();
        this._mouseButtonIntervals = new Map();

        // Key events
        document.addEventListener("keydown", (event) => {
            if (!this._keys.has(event.key)) {
                this._keys.add(event.key);
                const callback = this._keyDownCallbacks.get(event.key);
                if (callback) {
                    callback(event);
                }
            }
        });

        document.addEventListener("keyup", (event) => {
            this._keys.delete(event.key);
        });

        // Mouse events
        canvas.addEventListener("mousedown", (event) => {
            this._handlePointerDown(event.button, event, event.clientX, event.clientY);
        }, { passive: false });

        canvas.addEventListener("mousemove", (event) => {
            this._handlePointerMove(event.clientX, event.clientY);
        }, { passive: false });

        canvas.addEventListener("mouseup", (event) => {
            this._handlePointerUp(event.button, event);
        }, { passive: false });

        canvas.addEventListener("mouseleave", (event) => {
            for (const button of this._mouseButtons) {
                this._handlePointerUp(button, event);
            }
        });

        // Touch events
        canvas.addEventListener("touchstart", (event) => {
            event.preventDefault();
            const touch = event.touches[0];
            this._handlePointerDown(0, event, touch.clientX, touch.clientY);
        }, { passive: false });

        canvas.addEventListener("touchmove", (event) => {
            event.preventDefault();
            const touch = event.touches[0];
            if (touch) {
                this._handlePointerMove(touch.clientX, touch.clientY);
            }
        }, { passive: false });

        canvas.addEventListener("touchend", (event) => {
            event.preventDefault();
            this._handlePointerUp(0, event);
        }, { passive: false });

        canvas.addEventListener("touchcancel", (event) => {
            event.preventDefault();
            this._handlePointerUp(0, event);
        }, { passive: false });
    }

    /**
     * @param {string} key
     * @param {{ (): void; (): void; }} callback
     */
    onKeyDown(key, callback) {
        this._keyDownCallbacks.set(key, callback);
    }

    /**
     * @param {string} key
     */
    offKeyDown(key) {
        this._keyDownCallbacks.delete(key);
    }

    /**
     * @param {string} button
     * @param {{ (): void; (): void; }} callback
     */
    onMouseButtonDown(button, callback) {
        this._mouseDownCallbacks.set(button, callback);
    }

    /**
     * @param {string} button
     */
    offMouseButtonDown(button) {
        this._mouseDownCallbacks.delete(button);
    }

    /**
     * @param {number} button
     * @param {{ (): void; (): void; }} callback
     */
    onMouseButtonDownRepeat(button, callback) {
        this._mouseDownRepeatCallbacks.set(button, callback);
    }

    /**
     * @param {string} button
     */
    offMouseButtonDownRepeat(button) {
        this._mouseDownRepeatCallbacks.delete(button);
        const intervalId = this._mouseButtonIntervals.get(button);
        if (intervalId !== undefined) {
            clearInterval(intervalId);
            this._mouseButtonIntervals.delete(button);
        }
    }

    /**
     * @param {string} key
     */
    isKeyPressed(key) {
        return this._keys.has(key);
    }

    /**
     * @param {string} button
     */
    isMouseButtonPressed(button) {
        return this._mouseButtons.has(button);
    }

    getMousePosition() {
        return { ...this._mousePosition };
    }

    /**
     * @param {number} newCellSize
     */
    setCellSize(newCellSize) {
        this._cellSize = newCellSize;
    }

    /**
     * @param {number} button
     * @param {MouseEvent | TouchEvent} event
     * @param {number} clientX
     * @param {number} clientY
     */
    _handlePointerDown(button, event, clientX, clientY) {
        if (!this._mouseButtons.has(button)) {
            this._mouseButtons.add(button);

            // Update position first
            this._updatePointerPosition(clientX, clientY);

            const callback = this._mouseDownCallbacks.get(button);
            if (callback) {
                callback(event);
            }

            const repeatCallback = this._mouseDownRepeatCallbacks.get(button);
            if (repeatCallback) {
                const intervalId = setInterval(() => {
                    if (this._mouseButtons.has(button)) {
                        repeatCallback(event);
                    }
                }, 20);
                this._mouseButtonIntervals.set(button, intervalId);
            }
        }
    }

    /**
     * @param {number} clientX
     * @param {number} clientY
     */
    _handlePointerMove(clientX, clientY) {
        this._updatePointerPosition(clientX, clientY);
    }

    /**
     * @param {number} button
     * @param {MouseEvent | TouchEvent} event
     */
    _handlePointerUp(button, event) {
        if (this._mouseButtons.has(button)) {
            this._mouseButtons.delete(button);
            const intervalId = this._mouseButtonIntervals.get(button);
            if (intervalId !== undefined) {
                clearInterval(intervalId);
                this._mouseButtonIntervals.delete(button);
            }
        }
    }

    /**
     * @param {number} clientX
     * @param {number} clientY
     */
    _updatePointerPosition(clientX, clientY) {
        const bb = this._canvas.getBoundingClientRect();
        this._mousePosition.x = Math.floor(((clientX - bb.left) / bb.width * this._canvas.width) / this._cellSize);
        this._mousePosition.y = Math.floor(((clientY - bb.top) / bb.height * this._canvas.height) / this._cellSize);
    }
}
