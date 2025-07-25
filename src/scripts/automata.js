import { ProgramManager } from "./modules/ProgramManager.mjs";

let programManager = null;

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  if (!canvas) {
    console.error("Canvas element not found.");
    return;
  }

  programManager = new ProgramManager(canvas);
});
