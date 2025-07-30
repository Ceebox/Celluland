import { ProgramManager } from "./modules/ProgramManager.mjs";

if (!window.CellulandViewers) {
  window.CellulandViewers = new Set();
}

/**
 * @param {string} jsonString
 */
function parseConfig(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.warn("Failed to parse Celluland configuration JSON:", e);
    return null;
  }
}

/**
 * @param {any} config
 * @param {Element} script
 */
export function Run(config, script, initialState) {
  const cellulandParent = script.parentElement;
  if (!cellulandParent) {
    console.error("Script tag must be inside a container element.");
    return;
  }

  const parentContainer = document.createElement("div");
  cellulandParent.appendChild(parentContainer);

  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
  parentContainer.appendChild(canvas);

  window.CellulandViewers.add(new ProgramManager(canvas, config, initialState));
}

window.addEventListener("load", () => {
  const scripts = document.querySelectorAll("script[data-celluland-viewer][data-celluland-id]");
  scripts.forEach((script) => {
    const idStr = script.getAttribute("data-celluland-id");
    if (!idStr) {
      console.warn("data-celluland-id missing for a script tag; skipping.");
      return;
    }
    const dataId = idStr.trim();
    const configScript = document.querySelector(`script[data-celluland-config][data-celluland-id="${dataId}"], [data-celluland-config][data-celluland-id="${dataId}"]`);

    // Default config
    let config = { paused: true, fps: 4, editable: false, cellSize: 8 };

    if (configScript) {
      const configText = configScript.textContent?.trim();
      const parsedConfig = parseConfig(configText);
      if (parsedConfig) {
        config = parsedConfig;
      } else {
        console.warn(`Invalid JSON in config for Celluland instance with id ${dataId}`);
      }
    } else {
      console.warn(`No config found for Celluland instance with id ${dataId}, using default config.`);
    }

    const initialValuesScript = document.querySelector(`script[data-celluland-state][data-celluland-id="${dataId}"], [data-celluland-state][data-celluland-id="${dataId}"]`);
    let initialState = [];
    if (initialValuesScript) {
      initialState = JSON.parse(initialValuesScript.textContent);
    }

    Run(config, script, initialState);
  });
});
