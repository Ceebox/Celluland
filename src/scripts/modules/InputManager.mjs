export class InputManager {
    
    /**
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        this._keys = new Set();
        this._mouseButtons = new Set();
        this._mousePosition = { x: 0, y: 0 };
        this._canvas = canvas;

        this._keyDownCallbacks = new Map();
        this._mouseDownCallbacks = new Map();

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

        document.addEventListener("mousedown", (event) => {
            if (!this._mouseButtons.has(event.button)) {
                this._mouseButtons.add(event.button);
                const callback = this._mouseDownCallbacks.get(event.button);
                if (callback) {
                    callback(event);
                }
            }
        });

        document.addEventListener("mouseup", (event) => {
            this._mouseButtons.delete(event.button);
        });

        document.addEventListener("mousemove", (event) => {
            const bb = this._canvas.getBoundingClientRect();
            this._mousePosition.x = Math.floor( (event.clientX - bb.left) / bb.width * this._canvas.width );
            this._mousePosition.y = Math.floor( (event.clientY - bb.top) / bb.height * this._canvas.height );
        });
    }

    onKeyDown(key, callback) {
        this._keyDownCallbacks.set(key, callback);
    }

    offKeyDown(key) {
        this._keyDownCallbacks.delete(key);
    }

    onMouseButtonDown(button, callback) {
        this._mouseButtons.set(button, callback);
    }

    offMouseButtonDown(button) {
        this._mouseButtons.delete(button);
    }

    isKeyPressed(key) {
        return this._keys.has(key);
    }

    isMouseButtonPressed(button) {
        return this._mouseButtons.has(button);
    }

    getMousePosition() {
        return { ...this._mousePosition };
    }
}
