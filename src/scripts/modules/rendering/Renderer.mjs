import { ShaderManager } from "./ShaderManager.mjs";
import { RenderPassManager } from "./RenderPassManager.mjs";
import { BaseRenderPass } from "./BaseRenderPass.mjs";

export class Renderer {
    constructor(canvas) {
        let gl = canvas.getContext("webgl2", {
            desynchronized: true,
            antialias: false,
            powerPreference: "low-power",
        });

        // Do people not have WebGL 2 anymore?
        if (!gl) {
            document.querySelector("#main-text").innerHtml =
                "Please aquire a new computer.";

            throw new Error("WebGL 2 is not supported by this browser.");
        }   

        let shaderManager = new ShaderManager(gl);
        let renderPassManager = new RenderPassManager(shaderManager);
        renderPassManager.addRenderPass(new BaseRenderPass(gl));

        renderPassManager.render();
    }
}