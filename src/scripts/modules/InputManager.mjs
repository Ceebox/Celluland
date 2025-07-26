export class InputManager {
    
    /**
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        this._keys = new Set();
        this._mouseButtons = new Set();
        this._mousePosition = { x: 0, y: 0 };
        this._canvas = canvas;

        document.addEventListener("keydown", (event) => {
            this._keys.add(event.key);
        });

        document.addEventListener("keyup", (event) => {
            this._keys.delete(event.key);
        });

        document.addEventListener("mousedown", (event) => {
            this._mouseButtons.add(event.button);
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
