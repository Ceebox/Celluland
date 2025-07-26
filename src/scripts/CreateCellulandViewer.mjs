import { ProgramManager } from "./modules/ProgramManager.mjs";

export function Run() {
    const cellulandParent = document.querySelector("#cellulandViewer").parentElement;
    if (cellulandParent === null) {
        "Celluland must be run from a script tag inside the body.";
        return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    cellulandParent.appendChild(canvas);

    const configScript = document.getElementById("cellulandConfig");
    let config = {};
    if (configScript === null) {
        // Use the default config
        config = {
            paused: true,
            fps: 4
        };
    }
    else {
        try {
            config = JSON.parse(configScript.textContent);
        } catch (e) {
            console.error("Failed to parse Celluland configuration:", e);
        }
    }

    const programManager = new ProgramManager(canvas, config);
}

window.addEventListener("load", () => {
    Run();
});
