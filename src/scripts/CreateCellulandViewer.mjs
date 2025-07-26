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

    const programManager = new ProgramManager(canvas);
}

window.addEventListener("load", () => {
    Run();
});
