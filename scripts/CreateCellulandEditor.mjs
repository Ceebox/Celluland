import { EXAMPLES } from "./modules/automata/Examples.mjs";
import { ProgramManager } from "./modules/ProgramManager.mjs";

// A helper function to create labeled controls
function createLabeledInput(labelText, inputElem) {
    const wrapper = document.createElement("div");
    wrapper.style.margin = "4px 0";
    const label = document.createElement("label");
    label.textContent = labelText;
    label.style.marginRight = "6px";
    label.style.fontWeight = "bold";
    wrapper.appendChild(label);
    wrapper.appendChild(inputElem);
    return wrapper;
}

export class CellulandUI {
    constructor(parentElement, initialConfig = {}) {
        this.parent = parentElement;

        this.container = document.createElement("div");
        this.container.style.display = "flex";
        this.container.style.alignItems = "flex-start";
        this.parent.appendChild(this.container);

        this.viewerContainer = document.createElement("div");
        this.container.appendChild(this.viewerContainer);

        this.canvas = document.createElement("canvas");
        this.canvas.width = 400;
        this.canvas.height = 400;
        this.viewerContainer.appendChild(this.canvas);

        this.config = {
            paused: false,
            fps: 4,
            cellSize: 8,
            editable: true,
            ...initialConfig
        };

        this.programManager = new ProgramManager(this.canvas, this.config);

        // Create UI controls container
        this.uiContainer = document.createElement("div");
        this.uiContainer.style.marginLeft = "10px";
        this.uiContainer.style.minWidth = "250px";
        this.container.appendChild(this.uiContainer);

        this.exampleSelect = document.createElement("select");
        const defaultOption = document.createElement("option");
        defaultOption.textContent = "Not Selected";
        defaultOption.value = "";
        this.exampleSelect.appendChild(defaultOption);

        for (const [name, script] of Object.entries(EXAMPLES)) {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            this.exampleSelect.appendChild(option);
        }

        this.uiContainer.appendChild(
            createLabeledInput("Preset:", this.exampleSelect)
        );

        this.scriptBox = document.createElement("textarea");
        this.scriptBox.rows = 10;
        this.scriptBox.cols = 30;
        this.scriptBox.placeholder = "Enter your code here...";
        this.scriptBox.style.fontFamily = "monospace";
        this.scriptBox.style.width = "100%";
        this.uiContainer.appendChild(createLabeledInput("Algorithm:", this.scriptBox));

        this.scriptBox.addEventListener("change", () => {
            this.programManager.setScript(this.scriptBox.value);
        });

        this.exampleSelect.addEventListener("change", () => {
            const selectedName = this.exampleSelect.value;
            let newScript = "";
            if (selectedName && EXAMPLES.hasOwnProperty(selectedName)) {
                newScript = EXAMPLES[selectedName];
            } 
            
            this.setScript(newScript);
        });

        // Control inputs:
        this.pauseButton = document.createElement("input");
        this.pauseButton.type = "button";
        this.pauseButton.value = this.programManager.isPaused() ? "Play" : "Pause";
        this.pauseButton.checked = this.config.paused;
        this.uiContainer.appendChild(this.pauseButton);

        this.pauseButton.addEventListener("click", () => {
            this.programManager.togglePause();
            this.pauseButton.value = this.programManager.isPaused() ? "Play" : "Pause";
        });

        this.resetButton = document.createElement("input");
        this.resetButton.type = "button";
        this.resetButton.value = "Reset";
        this.uiContainer.appendChild(this.resetButton);

        this.resetButton.addEventListener("click", () => {
            this.programManager.resetGrid();
            this.programManager.setScript(this.scriptBox.value);
        });

        this.fpsInput = document.createElement("input");
        this.fpsInput.type = "number";
        this.fpsInput.min = 1;
        this.fpsInput.max = 60;
        this.fpsInput.value = this.config.fps;
        this.uiContainer.appendChild(createLabeledInput("FPS:", this.fpsInput));

        this.cellSizeInput = document.createElement("input");
        this.cellSizeInput.type = "number";
        this.cellSizeInput.min = 1;
        this.cellSizeInput.max = 100;
        this.cellSizeInput.value = this.config.cellSize;
        this.uiContainer.appendChild(createLabeledInput("Cell Size:", this.cellSizeInput));

        this.isEditableInput = document.createElement("input");
        this.isEditableInput.type = "checkbox";
        this.isEditableInput.checked = this.config.editable;
        this.uiContainer.appendChild(createLabeledInput("Is Editable:", this.isEditableInput));

        this.pauseButton.addEventListener("change", () => {
            this.config.paused = this.pauseButton.checked;
            this.updateConfig();
        });

        this.fpsInput.addEventListener("change", () => {
            let fps = parseInt(this.fpsInput.value, 10);
            if (fps < 1) fps = 1;
            if (fps > 60) fps = 60;
            this.fpsInput.value = fps;
            this.config.fps = fps;
            this.updateConfig();
        });

        this.cellSizeInput.addEventListener("change", () => {
            let cellSize = parseInt(this.cellSizeInput.value, 10);
            if (cellSize < 1) cellSize = 1;
            if (cellSize > 100) cellSize = 100;
            this.cellSizeInput.value = cellSize;
            this.config.cellSize = cellSize;
            this.updateConfig();
        });

        this.isEditableInput.addEventListener("change", () => {
            this.config.editable = this.isEditableInput.checked;
            this.updateConfig();
        });
    }

    updateConfig() {
        this.programManager.applyConfig(this.config);
    }

    setScript(text) {
        this.scriptBox.value = text;
        this.programManager.setScript(this.scriptBox.value);

        if (this.programManager.isPaused()) {
            this.programManager.togglePause();
        }

        this.programManager.applyConfig();
    }

    getScript() {
        return this.scriptBox.value;
    }
}

window.addEventListener("load", () => {
    const container = document.querySelector("script[data-celluland-editor]").parentElement;
    const cellulandUI = new CellulandUI(container, { paused: true, fps: 10, cellSize: 16, editable: true });
});
