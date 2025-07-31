import { EXAMPLES } from "./modules/automata/Examples.mjs";
import { Editor } from "./modules/editor/CodeEditor.mjs";
import { ProgramManager } from "./modules/ProgramManager.mjs";

/**
 * @param {string | null} labelText
 * @param {HTMLElement} inputElem
 */
function createLabeledInput(labelText, inputElem) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("input-wrapper");

    const label = document.createElement("label");
    label.textContent = labelText;
    label.classList.add("input-label");

    wrapper.appendChild(label);
    wrapper.appendChild(inputElem);
    return wrapper;
}

export class CellulandUI {
    /**
     * @param {HTMLElement} parentElement
     */
    constructor(parentElement, initialConfig = {}) {

        this.parent = parentElement;

        this.container = document.createElement("div");
        this.container.classList.add("celluland-container");
        this.parent.appendChild(this.container);

        this.viewerContainer = document.createElement("div");
        this.viewerContainer.classList.add("celluland-viewer-container");
        this.container.appendChild(this.viewerContainer);

        this.canvas = document.createElement("canvas");
        this.canvas.width = 400;
        this.canvas.height = 400;
        this.viewerContainer.appendChild(this.canvas);

        this.config = {
            paused: true,
            fps: 4,
            cellSize: 8,
            editable: true,
            ...initialConfig
        };

        this.programManager = new ProgramManager(this.canvas, this.config);
        this.updateConfig();

        // Create UI controls container
        this.uiContainer = document.createElement("div");
        this.uiContainer.classList.add("celluland-ui-container");
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

        this.codeEditor = document.createElement("div");
        const tempDiv = document.createElement("div");
        tempDiv.innerText = "​"; // Cheeky zero width space to make it render
        this.codeEditor.appendChild(tempDiv);
        this.codeEditor.classList.add("code-editor");
        this.codeEditor.setAttribute("contenteditable", "true");
        this.codeEditor.setAttribute("spellcheck", "false");
        this.uiContainer.appendChild(createLabeledInput("Algorithm:", this.codeEditor));
        this.editor = new Editor(this.codeEditor);

        this.editor.onTextChanged(() => {
            this.programManager?.setScript(this.editor.getText());
            this.updateEmbedScript();
        });

        this.exampleSelect.addEventListener("change", () => {
            const selectedName = this.exampleSelect?.value;
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
            this.programManager?.togglePause();
        });

        // Other things can change this value so listen to what the event listener says!
        this.programManager.onPauseChanged(this.pauseButton, () => {
            this.pauseButton.value = this.programManager?.isPaused() ? "Play" : "Pause";
        });

        this.resetButton = document.createElement("input");
        this.resetButton.type = "button";
        this.resetButton.value = "Reset";
        this.uiContainer.appendChild(this.resetButton);

        this.resetButton.addEventListener("click", () => {
            this.programManager?.resetGrid();
            this.programManager?.setScript(this.getScript());
        });

        this.fpsInput = document.createElement("input");
        this.fpsInput.type = "number";
        this.fpsInput.min = 1;
        this.fpsInput.max = 60;
        this.fpsInput.value = this.config.fps.toString();
        this.uiContainer.appendChild(createLabeledInput("FPS:", this.fpsInput));

        this.cellSizeInput = document.createElement("input");
        this.cellSizeInput.type = "number";
        this.cellSizeInput.min = 1;
        this.cellSizeInput.max = 100;
        this.cellSizeInput.value = this.config.cellSize.toString();
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
            this.fpsInput.value = fps.toString();
            this.config.fps = fps;
            this.updateConfig();
        });

        this.cellSizeInput.addEventListener("change", () => {
            let cellSize = parseInt(this.cellSizeInput.value, 10);
            if (cellSize < 1) cellSize = 1;
            if (cellSize > 100) cellSize = 100;
            this.cellSizeInput.value = cellSize.toString();
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
        this.updateEmbedConfig();
        this.updateInitialState();
    }

    updateEmbedConfig() {
        const insertSpan = document.getElementById("embed-config");
        if (!insertSpan) {
            return;
        }

        insertSpan.innerText = JSON.stringify(this.config, null, "\t");
    }

    updateInitialState() {
        const initalStateSpan = document.getElementById("embed-state");
        if (!initalStateSpan) {
            return;
        }

        initalStateSpan.innerText = JSON.stringify(this.programManager.getInitialState());
    }

    /**
     * @param {string} text
     */
    setScript(text) {
        this.editor.setText(text);
        this.programManager.setScript(this.editor.getText());
        this.updateEmbedScript();
    }

    updateEmbedScript() {
        const scriptSpan = document.getElementById("embed-script");
        if (!scriptSpan) {
            return;
        }

        scriptSpan.innerText = this.getScript();
    }

    getScript() {
        return this.editor.getText();
    }
}

window.addEventListener("load", () => {
    const root = document.querySelector("script[data-celluland-editor]")?.parentElement;
    if (!root) {
        console.error("No parent element supplied to Celluland");
        return;
    }

    const cellulandUI = new CellulandUI(root, { paused: true, fps: 4, cellSize: 16, editable: true });
});
